import React from 'react';
import { useParams } from 'react-router-dom';
import { useTutorDetail } from '../hooks/useTutorDetail';
import { format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import Chip from '../../../components/Chip';
import LessonCalendarSection from '../../../domain/lessonManage/components/LessonCalendarSection';
import '../css/lesson-booking.css';

export default function LessonBookingPage() {
  const { tutorId } = useParams();
  const { data: tutor, isLoading } = useTutorDetail(tutorId!);
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(new Date());
  const [selectedTime, setSelectedTime] = React.useState<string>();

  if (isLoading || !tutor) {
    return (
      <div className="booking-page">
        <div className="booking-container">
          <div className="info-card">
            <div className="loading-message">로딩 중...</div>
          </div>
        </div>
      </div>
    );
  }

  // 선택된 날짜의 요일 구하기
  const dayOfWeek = selectedDate ? format(selectedDate, 'EEEE') : '';

  // 해당 요일의 가능한 시간대 찾기
  const availableTime =
    selectedDate &&
    tutor.tutorAvailableTimeList?.find((time) => time.dayOfWeekNum === selectedDate.getDay());

  // 시간대 옵션 생성
  const timeOptions = React.useMemo(() => {
    if (!availableTime) return [];

    const { startTime, endTime } = availableTime;

    try {
      const [startHour, startMinute] = startTime.split(':').map(Number);
      const [endHour, endMinute] = endTime.split(':').map(Number);

      const slots: string[] = [];
      let currentHour = startHour;
      let currentMinute = startMinute;

      // 시작 시간과 종료 시간을 분 단위로 변환
      const startTotalMinutes = startHour * 60 + startMinute;
      const endTotalMinutes = endHour * 60 + endMinute;
      let currentTotalMinutes = startTotalMinutes;

      while (currentTotalMinutes <= endTotalMinutes) {
        currentHour = Math.floor(currentTotalMinutes / 60);
        currentMinute = currentTotalMinutes % 60;

        if (currentHour >= 24) break;

        slots.push(
          `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`
        );

        // 30분씩 증가
        currentTotalMinutes += 30;
      }

      return slots;
    } catch (error) {
      console.error('시간 파싱 오류:', error);
      return [];
    }
  }, [availableTime]);

  return (
    <div className="booking-page">
      <div className="booking-container">
        {/* 튜터 요약 정보 */}
        <div className="tutor-summary info-card">
          <div className="tutor-summary-header">
            {tutor.photoUrl ? (
              <img src={tutor.photoUrl} alt={tutor.nickname} className="tutor-avatar-sm" />
            ) : (
              <div className="tutor-avatar-placeholder-sm">
                <FontAwesomeIcon icon={faUser} className="text-2xl text-gray-500" />
              </div>
            )}
            <div>
              <h2 className="tutor-name-sm">{tutor.nickname}</h2>
              <div className="tutor-badges-sm">
                <Chip label={`경력 ${tutor.careerYears}년`} variant="blue" size="sm" />
                <Chip
                  label={`시간당 ${tutor.pricePerHour.toLocaleString()}원`}
                  variant="green"
                  size="sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 예약 캘린더 */}
        <div className="booking-calendar info-card">
          <h2 className="info-title">레슨 일정 선택</h2>
          <div className="calendar-container">
            <LessonCalendarSection
              lessonEvents={[]}
              onSelectEvent={() => {}}
              onSelectSlot={(slotInfo: { start: Date }) => {
                // 날짜가 선택되었을 때의 처리
                const selectedDate = slotInfo.start;
                const dayOfWeek = selectedDate.getDay();

                // 튜터의 가능한 시간대 확인
                const available = tutor.tutorAvailableTimeList?.find(
                  (time) => time.dayOfWeekNum === dayOfWeek
                );

                if (available) {
                  setSelectedDate(selectedDate);
                  setSelectedTime(undefined); // 시간 선택 초기화
                } else {
                  alert('선택하신 요일은 레슨이 불가능합니다.');
                  setSelectedDate(null);
                }
              }}
            />

            {/* 선택된 날짜의 시간대 선택 */}
            {availableTime ? (
              <div className="time-slots">
                <h3 className="time-slots-title">
                  {dayOfWeek} 가능한 시간 ({timeOptions.length}개 시간대)
                </h3>
                <div className="time-slots-grid">
                  {timeOptions.map((time) => {
                    const isSelected = selectedTime === time;
                    return (
                      <button
                        key={time}
                        className={`time-slot ${isSelected ? 'selected' : ''}`}
                        onClick={() => setSelectedTime(time)}
                        aria-selected={isSelected}
                      >
                        <span className="time-text">{time}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : selectedDate ? (
              <div className="no-availability">
                <p>선택하신 {dayOfWeek}은 레슨이 불가능합니다.</p>
                <p className="hint">다른 날짜를 선택해주세요.</p>
              </div>
            ) : (
              <div className="no-availability">
                <p>날짜를 선택해주세요.</p>
                <p className="hint">캘린더에서 원하시는 날짜를 클릭하세요.</p>
              </div>
            )}
          </div>
        </div>

        {/* 예약 버튼 */}
        <div className="booking-footer">
          <button
            className="booking-submit-button"
            disabled={!selectedDate || !selectedTime}
            onClick={() => {
              // TODO: 예약 처리 로직 구현
              console.log('예약:', {
                tutorId,
                date: selectedDate,
                time: selectedTime,
              });
            }}
          >
            레슨 예약하기
          </button>
        </div>
      </div>
    </div>
  );
}
