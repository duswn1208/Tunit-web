import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useState } from 'react';
import { format } from 'date-fns';

interface Props {
  date?: string;
  time?: string;
  reservedTimes?: string[];
  onChange: (date: string, time: string) => void;
  availableTimeRange?: { start: string; end: string };
  enabledDayOfWeeks?: number[];
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
}: Props) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(date ? new Date(date) : null);
  const [selectedTime, setSelectedTime] = useState<string>(time || '');

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
    <div>
      <Calendar
        value={selectedDate}
        onChange={handleDateChange}
        minDate={new Date()}
        locale="ko-KR"
        tileDisabled={({ date }) => {
          // enabledDayOfWeeks에 없는 요일의 모든 날짜 비활성화
          if (!enabledDayOfWeeks || enabledDayOfWeeks.length === 0) return false;
          const dayOfWeekNum = date.getDay(); // 0(일)~6(토)
          return !enabledDayOfWeeks.includes(dayOfWeekNum);
        }}
      />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
        {times.map((t) => {
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
                padding: '8px 16px',
                borderRadius: 4,
                border: selectedTime === t ? '2px solid #1976d2' : '1px solid #ccc',
                background: selectedTime === t ? '#1976d2' : '#fff',
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
        })}
      </div>
      {selectedDate && selectedTime && (
        <div style={{ marginTop: 12, fontWeight: 500 }}>
          선택: {selectedDate.toISOString().slice(0, 10)} {selectedTime}
        </div>
      )}
    </div>
  );
}
