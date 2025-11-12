import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../css/exception-schedule.css';
import Button from '@/shared/components/Button';
import { api } from '@/shared/lib/api';
import { useToast } from '@/shared/contexts/ToastContext';

export default function ExceptionScheduleSection() {
  const { showToast } = useToast();
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [isAllDay, setIsAllDay] = useState(true);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('18:00');
  const [holidays, setHolidays] = useState<
    Array<{
      date: string;
      endDate?: string;
      isAllDay: boolean;
      startTime?: string;
      endTime?: string;
      reason?: string;
    }>
  >([]);
  const [reason, setReason] = useState('');

  const handleDateClick = (date: Date) => {
    if (selectedDates.length === 0) {
      // 첫 번째 날짜 선택
      setSelectedDates([date]);
      setIsAllDay(false);
      setReason('');
    } else if (selectedDates.length === 1) {
      // 두 번째 날짜 선택 - 기간으로 설정
      const firstDate = selectedDates[0];
      const secondDate = date;

      // 날짜 순서 정렬 (빠른 날짜가 먼저 오도록)
      if (secondDate < firstDate) {
        setSelectedDates([secondDate, firstDate]);
      } else {
        setSelectedDates([firstDate, secondDate]);
      }

      // 기간 선택 시 자동으로 종일 모드
      setIsAllDay(true);
      setReason('');
    } else {
      // 이미 2개 선택된 상태에서 다시 클릭하면 초기화하고 새로 시작
      setSelectedDates([date]);
      setIsAllDay(false);
      setReason('');
    }
  };

  const handleAddHoliday = async () => {
    if (selectedDates.length === 0) return;

    try {
      if (selectedDates.length === 1) {
        // 단일 날짜 휴무
        const dateStr = formatDateLocal(selectedDates[0]);
        const newHoliday = {
          date: dateStr,
          isAllDay,
          startTime: isAllDay ? undefined : startTime,
          endTime: isAllDay ? undefined : endTime,
          reason: reason || undefined,
        };

        console.log('Adding holiday:', newHoliday);

        // API 호출
        await api.post('/api/tutor/schedule/save/holiday', newHoliday);
        setHolidays((prev) => [...prev, newHoliday]);
        showToast('휴무가 등록되었습니다.', 'success');
      } else {
        // 기간 휴무 (2개 날짜 선택)
        const startDateStr = formatDateLocal(selectedDates[0]);
        const endDateStr = formatDateLocal(selectedDates[1]);
        const newHoliday = {
          date: startDateStr,
          endDate: endDateStr,
          isAllDay: true,
          reason: reason || undefined,
        };

        console.log('Adding holiday:', newHoliday);
        // API 호출
        await api.post('/api/tutor/schedule/save/holiday', newHoliday);
        setHolidays((prev) => [...prev, newHoliday]);
        showToast('기간 휴무가 등록되었습니다.', 'success');
      }

      setSelectedDates([]);
      setReason('');
      setIsAllDay(true);
    } catch (error) {
      console.error('휴무 등록 실패:', error);
      showToast('휴무 등록에 실패했습니다.', 'error');
    }
  };

  const handleRemoveHoliday = async (index: number) => {
    const holiday = holidays[index];

    try {
      // API 호출 - 삭제 엔드포인트
      await api.delete(`/api/tutor/profile/modify/holiday`, {
        body: JSON.stringify({ date: holiday.date, endDate: holiday.endDate }),
      });

      setHolidays((prev) => prev.filter((_, i) => i !== index));
      showToast('휴무가 삭제되었습니다.', 'success');
    } catch (error) {
      console.error('휴무 삭제 실패:', error);
      showToast('휴무 삭제에 실패했습니다.', 'error');
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  const formatDateLocal = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
      date.getDate()
    ).padStart(2, '0')}`;
  };

  const formatDateDisplay = (date: Date) => {
    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  return (
    <div className="exception-schedule-section">
      <p className="exception-schedule-section__description">
        특정 날짜의 휴무나 일시적인 시간 변경을 등록하세요.
      </p>

      <div className="exception-schedule-section__container">
        {/* 왼쪽: 달력 */}
        <div className="exception-schedule-section__calendar-wrapper">
          <Calendar
            onChange={(value) => handleDateClick(value as Date)}
            value={selectedDates.length > 0 ? selectedDates[0] : null}
            locale="ko-KR"
            minDate={new Date()}
            tileClassName={({ date }) => {
              const dateStr = formatDateLocal(date);
              const isHoliday = holidays.some((h) => h.date === dateStr);
              const isSelected = selectedDates.some((d) => formatDateLocal(d) === dateStr);

              let className = '';
              if (isHoliday) className += 'holiday-date ';
              if (isSelected) className += 'selected-date';

              return className.trim();
            }}
          />
        </div>

        {/* 오른쪽: 설정 패널 */}
        <div className="exception-schedule-section__panel-wrapper">
          {selectedDates.length > 0 ? (
            <div className="exception-schedule-section__panel">
              <h4 className="exception-schedule-section__panel-title">
                {selectedDates.length === 1
                  ? `${formatDateDisplay(selectedDates[0])} 휴무 설정`
                  : `${formatDateDisplay(selectedDates[0])} ~ ${formatDateDisplay(
                      selectedDates[1]
                    )} 기간 휴무`}
              </h4>

              <div className="exception-schedule-section__checkbox-wrapper">
                <label className="exception-schedule-section__checkbox-label">
                  <input
                    type="checkbox"
                    checked={isAllDay}
                    onChange={(e) => setIsAllDay(e.target.checked)}
                    disabled={selectedDates.length === 2}
                    className="exception-schedule-section__checkbox"
                  />
                  <span className="exception-schedule-section__checkbox-text">종일 휴무</span>
                  {selectedDates.length === 2 && (
                    <span className="exception-schedule-section__checkbox-note">
                      (기간 휴무는 종일만 가능)
                    </span>
                  )}
                </label>
              </div>

              {!isAllDay && selectedDates.length === 1 && (
                <div className="exception-schedule-section__time-inputs">
                  <div className="exception-schedule-section__time-row">
                    <div className="exception-schedule-section__time-field">
                      <label className="exception-schedule-section__time-label">시작 시간</label>
                      <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="exception-schedule-section__time-input"
                      />
                    </div>
                    <div className="exception-schedule-section__time-field">
                      <label className="exception-schedule-section__time-label">종료 시간</label>
                      <input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="exception-schedule-section__time-input"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="exception-schedule-section__reason-wrapper">
                <label className="exception-schedule-section__reason-label">사유 (선택)</label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="예: 개인 사정, 휴가 등"
                  className="exception-schedule-section__reason-input"
                />
              </div>

              <Button onClick={handleAddHoliday}>휴무 등록</Button>
            </div>
          ) : (
            <div className="exception-schedule-section__empty-state">
              날짜를 선택하여 휴무를 등록하세요
            </div>
          )}

          {/* 등록된 휴무 목록 */}
          {holidays.length > 0 && (
            <div className="exception-schedule-section__holidays">
              <h4 className="exception-schedule-section__holidays-title">
                등록된 휴무 ({holidays.length})
              </h4>
              <div className="exception-schedule-section__holidays-list">
                {holidays.map((holiday, index) => (
                  <div key={index} className="exception-schedule-section__holiday-item">
                    <div>
                      <div className="exception-schedule-section__holiday-date">
                        {holiday.endDate
                          ? `${formatDate(holiday.date)} ~ ${formatDate(holiday.endDate)}`
                          : formatDate(holiday.date)}
                      </div>
                      <div className="exception-schedule-section__holiday-details">
                        {holiday.isAllDay ? '종일' : `${holiday.startTime} ~ ${holiday.endTime}`}
                        {holiday.reason && ` • ${holiday.reason}`}
                      </div>
                    </div>
                    <Button
                      onClick={() => handleRemoveHoliday(index)}
                      className="ui-btn--outline"
                      size="sm"
                    >
                      삭제
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
