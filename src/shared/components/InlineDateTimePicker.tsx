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
  size?: 'small' | 'medium' | 'large';
}

const times = Array.from({ length: 19 }, (_, i) => {
  const hour = i + 6;
  return `${hour.toString().padStart(2, '0')}:00`;
}); // 06:00 ~ 24:00

export default function InlineDateTimePicker({
  date,
  time,
  reservedTimes = [],
  onChange,
  availableTimeRange,
  enabledDayOfWeeks,
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
    <div className="inline-datepicker-container">
      <div className={`calendar-wrapper ${size}`}>
        <Calendar
          value={selectedDate}
          onChange={handleDateChange}
          minDate={new Date()}
          locale="ko-KR"
          className={size}
          tileDisabled={({ date }) => {
            // enabledDayOfWeeks에 없는 요일의 모든 날짜 비활성화
            if (!enabledDayOfWeeks || enabledDayOfWeeks.length === 0) return false;
            const dayOfWeekNum = date.getDay(); // 0(일)~6(토)
            return !enabledDayOfWeeks.includes(dayOfWeekNum);
          }}
        />
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
        {availableTimeRange ? (
          times.map((t) => {
            let disabled = false;
            if (!selectedDate) disabled = true;
            if (!availableTimeRange) disabled = true;
            if (reservedTimes.includes(t)) disabled = true;
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
