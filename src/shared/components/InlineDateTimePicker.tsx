import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import './InlineDateTimePicker.css';

interface Props {
  date?: string;
  time?: string;
  reservedTimes?: string[];
  onChange: (date: string, time: string) => void;
  availableTimeRange?: { start: string; end: string };
  enabledDayOfWeeks?: number[];
  disabledDates?: string[]; // 비활성화할 날짜 배열 (YYYY-MM-DD 형식)
  size?: 'small' | 'medium' | 'large';
}

const times = Array.from({ length: 38 }, (_, i) => {
  const hour = Math.floor(i / 2) + 6;
  const minute = (i % 2) * 30;
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
}); // 06:00, 06:30, 07:00, ..., 24:30까지 30분 단위

export default function InlineDateTimePicker({
  date,
  time,
  reservedTimes = [],
  onChange,
  availableTimeRange,
  enabledDayOfWeeks,
  disabledDates = [],
  size = 'large',
}: Props) {
  function parseDateStringToLocal(dateStr?: string): Date | null {
    if (!dateStr) return null;
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  }
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    date ? parseDateStringToLocal(date) : null
  );
  const [selectedTime, setSelectedTime] = useState<string>(time || '');
  // 외부에서 time prop이 바뀌면 내부 selectedTime도 동기화 (날짜 바뀌면 칩 컬러 초기화)
  useEffect(() => {
    setSelectedTime(time || '');
  }, [time]);

  // 날짜가 바뀌면 시간 선택도 초기화
  useEffect(() => {
    setSelectedTime('');
  }, [date]);

  const handleDateChange = (value: any) => {
    setSelectedDate(value ?? null);
    onChange(value ? format(value, 'yyyy-MM-dd') : '', selectedTime);
  };

  const handleTimeClick = (t: string) => {
    setSelectedTime(t);
    if (selectedDate) {
      onChange(format(selectedDate, 'yyyy-MM-dd'), t);
    }
  };

  return (
    <div
      className="inline-datepicker-container"
      style={{
        width: '100%',
        maxWidth: '100%',
        margin: 0,
        padding: 0,
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      <div
        className={`calendar-wrapper ${size}`}
        style={{
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        <Calendar
          value={selectedDate}
          onChange={handleDateChange}
          minDate={new Date()}
          locale="ko-KR"
          className={size}
          tileDisabled={({ date }) => {
            // disabledDates에 포함된 날짜 비활성화
            const dateStr = format(date, 'yyyy-MM-dd');
            if (disabledDates.includes(dateStr)) return true;

            // enabledDayOfWeeks에 없는 요일의 모든 날짜 비활성화
            if (!enabledDayOfWeeks || enabledDayOfWeeks.length === 0) return true; // 빈 배열이면 모두 비활성화
            // JavaScript getDay(): 0(일)~6(토) → 백엔드 기준 1(월)~7(일)로 변환
            const jsDay = date.getDay(); // 0(일)~6(토)
            const dayOfWeekNum = jsDay === 0 ? 7 : jsDay; // 1(월)~7(일)
            return !enabledDayOfWeeks.includes(dayOfWeekNum);
          }}
        />
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
        {availableTimeRange && enabledDayOfWeeks && enabledDayOfWeeks.length > 0 ? (
          times.map((t) => {
            let disabled = false;
            if (!selectedDate) disabled = true;
            if (!availableTimeRange) disabled = true;
            if (reservedTimes.includes(t)) disabled = true;

            // 선택된 날짜가 활성화된 요일인지 확인
            if (selectedDate && enabledDayOfWeeks && enabledDayOfWeeks.length > 0) {
              const jsDay = selectedDate.getDay(); // 0(일)~6(토)
              const dayOfWeekNum = jsDay === 0 ? 7 : jsDay; // 1(월)~7(일)
              if (!enabledDayOfWeeks.includes(dayOfWeekNum)) {
                disabled = true;
              }
            }

            if (availableTimeRange) {
              // HH:mm 또는 HH:mm:00 형식 지원
              const baseDate = '2000-01-01';
              const timeToDate = (hhmm: string) =>
                new Date(baseDate + 'T' + (hhmm.length === 5 ? hhmm + ':00' : hhmm));
              const tDate = timeToDate(t);
              const startDate = timeToDate(availableTimeRange.start);
              const endDate = timeToDate(availableTimeRange.end);
              if (tDate < startDate || tDate > endDate) disabled = true;
            }
            return (
              <button
                key={t}
                type="button"
                onClick={() => handleTimeClick(t)}
                style={{
                  padding: '4px 16px',
                  borderRadius: 8,
                  border: selectedTime === t ? '' : '1px solid #ccc',
                  background: selectedTime === t ? 'var(--brand-mint)' : '#fff',
                  color: selectedTime === t ? '#fff' : '#333',
                  fontWeight: 500,
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  opacity: disabled ? 0.5 : 1,
                }}
                disabled={disabled}
              >
                {t}
              </button>
            );
          })
        ) : (
          <div style={{ width: '100%', textAlign: 'center', color: '#888', margin: '24px 0' }}>
            선택할 수 있는 시간이 없습니다
          </div>
        )}
      </div>
      {/* {selectedDate && selectedTime && (
        <div style={{ marginTop: 12, fontWeight: 500 }}>
          선택:{' '}
          {[
            selectedDate.getFullYear(),
            String(selectedDate.getMonth() + 1).padStart(2, '0'),
            String(selectedDate.getDate()).padStart(2, '0'),
          ].join('-')}{' '}
          {selectedTime}
        </div>
      )} */}
    </div>
  );
}
