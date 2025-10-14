import React from 'react';
import { useParams } from 'react-router-dom';
import Chip from '@/shared/components/Chip';
import TutorProfileCard from '../../profile/components/TutorProfileCard.tsx';
import LessonCalendarPicker from '@/domain/lesson/components/LessonCalendarPicker';
import { api } from '../../../shared/lib/api.ts';
import { useTutorDetail } from '../hooks/useTutorDetail';
import { useReservationState } from '../hooks/useReservationState';
import { DAYS_OF_WEEK, getCalendarRange } from '@/shared/constants/date';
import '../css/tutor-detail.css';
import '../css/tutor-calendar.css';

export default function TutorDetailPage() {
  const { tutorId } = useParams();
  const { data, isLoading, error } = useTutorDetail(tutorId!);
  const {
    state: { showBookingCalendar, selectedDate, selectedTime, selectedLesson, requestMessage },
    toggleCalendar,
    setDateTime,
    setLesson,
    setMessage,
  } = useReservationState();

  // 캘린더 날짜 범위 설정
  const { start: monthStart, end: monthEnd } = getCalendarRange();

  // 레슨 예약 제출 처리
  const handleReservationSubmit = async () => {
    if (!selectedDate || !selectedTime) {
      alert('날짜와 시간을 선택해주세요.');
      return;
    }
    if (!selectedLesson) {
      alert('레슨 과목을 선택해주세요.');
      return;
    }

    try {
      await api.post('/api/lessons/reserve', {
        tutorProfileNo: parseInt(tutorId!, 10),
        startTime: selectedTime,
        lesson: {
          tutorLessonNo: parseInt(selectedLesson!, 10),
        },
        lessonDate: selectedDate,
        reservationStatus: 'PENDING',
        memo: requestMessage || null,
      });

      alert('상담/체험 레슨 예약 요청이 전송되었습니다.');
      toggleCalendar(false);
    } catch (error) {
      alert('예약 요청 중 오류가 발생했습니다. 다시 시도해주세요.');
      console.error('Reservation error:', error);
    }
  };

  // 페이지 로드 시 자동으로 예약 캘린더 표시
  React.useEffect(() => {
    toggleCalendar(true);
  }, []);

  if (isLoading) {
    return (
      <div className="tutor-detail-page">
        <div className="tutor-detail-container">
          <div className="info-card">
            <div className="loading-message">로딩 중...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="tutor-detail-page">
        <div className="tutor-detail-container">
          <div className="info-card">
            <h2 className="error-title">오류 발생</h2>
            <p className="error-message">
              죄송합니다. 튜터 정보를 찾을 수 없습니다. (ID: {tutorId})
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tutor-detail-page">
      <div className="tutor-detail-container">
        {/* 프로필 헤더 */}
        <TutorProfileCard tutor={{ ...data, tutorId: parseInt(tutorId!, 10) }} variant="full" />
      </div>

      <div className="info-grid">
        {!showBookingCalendar ? (
          <>
            {/* 레슨 정보 */}
            <div className="info-card">
              <h2 className="info-title">레슨 정보</h2>
              <div className="info-content">
                <div>
                  <h3 className="info-subtitle">레슨 과목</h3>
                  <div className="badge-group">
                    {data.lessonSubcategoryList?.map((lesson) => (
                      <Chip
                        key={lesson.tutorLessonNo}
                        label={lesson.lessonCategory.label}
                        variant="gray"
                        size="md"
                        style={{ border: 'none' }}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="info-subtitle">레슨 가능 지역</h3>
                  <div className="badge-group">
                    {data.regionList?.map((region) => (
                      <Chip
                        key={region.code}
                        label={region.label}
                        variant="gray"
                        size="md"
                        style={{ border: 'none' }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 스케줄 정보 */}
            <div className="info-card">
              <div className="schedule-header">
                <h2 className="info-title">레슨 가능 시간</h2>
                <button className="booking-button" onClick={() => toggleCalendar(true)}>
                  레슨 예약하기
                </button>
              </div>
              <div className="schedule-list">
                {DAYS_OF_WEEK.map((day) => {
                  const dayIndex = DAYS_OF_WEEK.indexOf(day);
                  const schedule = data.tutorAvailableTimeList?.find(
                    (time) => time.dayOfWeekNum === dayIndex + 1
                  );
                  return (
                    <div
                      key={day}
                      className={`schedule-item ${schedule ? 'has-schedule' : 'no-schedule'}`}
                    >
                      <span className="schedule-day">{day}요일</span>
                      {schedule ? (
                        <span className="schedule-time">
                          {schedule.startTime} - {schedule.endTime}
                        </span>
                      ) : (
                        <span className="schedule-off">휴무</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          /* 레슨 예약 캘린더 */
          <div className="info-card full-width">
            <div className="schedule-header">
              <h2 className="info-title">레슨 예약</h2>
              <button className="back-button" onClick={() => toggleCalendar(false)}>
                뒤로 가기
              </button>
            </div>
            <div className="calendar-container">
              <LessonCalendarPicker
                teacherId={parseInt(tutorId!, 10)}
                startDate={monthStart.toISOString().split('T')[0]}
                endDate={monthEnd.toISOString().split('T')[0]}
                date={selectedDate}
                time={selectedTime}
                size="large"
                onChange={(date, time) => {
                  setDateTime(date, time);
                }}
              />

              {/* 레슨 선택 및 요청사항 입력 */}
              <div className="booking-form">
                <div className="lesson-select-container">
                  <label htmlFor="lessonSelect">레슨 과목 선택</label>
                  <select
                    id="lessonSelect"
                    className="lesson-select"
                    value={selectedLesson || ''}
                    onChange={(e) => setLesson(e.target.value)}
                  >
                    <option value="" disabled>
                      레슨 과목을 선택해주세요
                    </option>
                    {data.lessonSubcategoryList?.map((lesson) => (
                      <option key={lesson.tutorLessonNo} value={lesson.tutorLessonNo}>
                        {lesson.lessonCategory.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="request-input-container">
                  <label htmlFor="requestMessage">요청사항</label>
                  <textarea
                    id="requestMessage"
                    className="request-input"
                    placeholder="튜터에게 전달할 요청사항을 입력해주세요. (선택사항)"
                    value={requestMessage}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                  />
                </div>
                <div className="booking-buttons">
                  <button className="booking-button" onClick={handleReservationSubmit}>
                    상담/체험 레슨 예약
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
