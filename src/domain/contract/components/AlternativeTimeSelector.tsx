import { useState } from 'react';
import Button from '@/shared/components/Button';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale/ko';
import './css/alternative-time-selector.css';

interface AlternativeTime {
  proposedDate: string;
  proposedStartTime: string;
}

interface AlternativeTimeSelectorProps {
  alternatives: AlternativeTime[];
  onChange: (alternatives: AlternativeTime[]) => void;
}

export default function AlternativeTimeSelector({
  alternatives,
  onChange,
}: AlternativeTimeSelectorProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState('');

  const timeOptions = [
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
    '20:00',
  ];

  const handleAdd = () => {
    if (!selectedDate || !selectedTime) return;
    if (alternatives.length >= 5) return;

    const dateStr = format(selectedDate, 'yyyy-MM-dd');

    if (alternatives.some((a) => a.proposedDate === dateStr && a.proposedStartTime === selectedTime)) {
      alert('이미 선택한 시간입니다.');
      return;
    }

    onChange([
      ...alternatives,
      {
        proposedDate: dateStr,
        proposedStartTime: selectedTime,
      },
    ]);
    setSelectedDate(null);
    setSelectedTime('');
  };

  const handleRemove = (index: number) => {
    onChange(alternatives.filter((_, i) => i !== index));
  };

  const formatDisplayDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr + 'T00:00:00');
      return format(date, 'M월 d일 (E)', { locale: ko });
    } catch {
      return dateStr;
    }
  };

  const renderCalendar = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const cells: React.ReactNode[] = [];

    for (let i = 0; i < startDayOfWeek; i++) {
      cells.push(<div key={`empty-${i}`} className="alt-cal-cell alt-cal-cell--empty" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const isPast = date < today;
      const isSelected = selectedDate?.toDateString() === date.toDateString();
      const isToday = date.toDateString() === today.toDateString();

      cells.push(
        <button
          type="button"
          key={day}
          onClick={() => !isPast && setSelectedDate(date)}
          disabled={isPast}
          className={`alt-cal-cell alt-cal-day${isSelected ? ' is-selected' : ''}${
            isPast ? ' is-past' : ''
          }${isToday ? ' is-today' : ''}`}
        >
          {day}
        </button>,
      );
    }

    return (
      <div className="alt-cal">
        <div className="alt-cal-title">
          {currentYear}년 {currentMonth + 1}월
        </div>
        <div className="alt-cal-weekdays">
          {['일', '월', '화', '수', '목', '금', '토'].map((d) => (
            <div key={d} className="alt-cal-weekday">
              {d}
            </div>
          ))}
        </div>
        <div className="alt-cal-grid">{cells}</div>
      </div>
    );
  };

  return (
    <div className="alt-selector">
      <h4 className="alt-selector-title">대안 시간 제안 (선택, 최대 5개)</h4>

      {alternatives.length > 0 && (
        <div className="alt-selector-list">
          {alternatives.map((alt, index) => (
            <div key={`${alt.proposedDate}-${alt.proposedStartTime}`} className="alt-selector-row">
              <span className="alt-selector-row-text">
                {formatDisplayDate(alt.proposedDate)} {alt.proposedStartTime}
              </span>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="alt-selector-remove"
              >
                삭제
              </button>
            </div>
          ))}
        </div>
      )}

      {alternatives.length < 5 && (
        <div className="alt-selector-add">
          {renderCalendar()}

          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="alt-selector-time"
          >
            <option value="">시간 선택</option>
            {timeOptions.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>

          <Button
            className="ui-btn--outlined"
            onClick={handleAdd}
            disabled={!selectedDate || !selectedTime}
            style={{ width: '100%' }}
          >
            대안 시간 추가
          </Button>
        </div>
      )}
    </div>
  );
}
