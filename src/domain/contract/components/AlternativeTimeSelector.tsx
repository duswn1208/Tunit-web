import { useState } from 'react';
import Button from '@/shared/components/Button';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale/ko';

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

    // 중복 체크
    if (alternatives.some((a) => a.proposedDate === dateStr && a.proposedStartTime === selectedTime)) {
      alert('이미 선택한 시간입니다.');
      return;
    }

    const newAlt: AlternativeTime = {
      proposedDate: dateStr,
      proposedStartTime: selectedTime,
    };

    onChange([...alternatives, newAlt]);
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

  // 간단한 달력 (날짜 선택)
  const renderCalendar = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const days = [];

    // 빈 칸 채우기
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} style={{ padding: 8 }} />);
    }

    // 날짜 채우기
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const isPast = date < today && date.toDateString() !== today.toDateString();
      const isSelected = selectedDate?.toDateString() === date.toDateString();

      days.push(
        <div
          key={day}
          onClick={() => !isPast && setSelectedDate(date)}
          style={{
            padding: 8,
            textAlign: 'center',
            cursor: isPast ? 'not-allowed' : 'pointer',
            backgroundColor: isSelected ? '#1976d2' : 'transparent',
            color: isPast ? '#ccc' : isSelected ? 'white' : '#333',
            borderRadius: 4,
            fontWeight: isSelected ? 600 : 400,
          }}
        >
          {day}
        </div>
      );
    }

    return (
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, textAlign: 'center' }}>
          {currentYear}년 {currentMonth + 1}월
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 4,
            marginBottom: 8,
          }}
        >
          {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
            <div key={day} style={{ padding: 8, textAlign: 'center', fontWeight: 600, fontSize: 13 }}>
              {day}
            </div>
          ))}
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 4,
          }}
        >
          {days}
        </div>
      </div>
    );
  };

  return (
    <div>
      <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>
        대안 시간 제안 (선택사항, 최대 5개)
      </h4>

      {/* 선택된 대안 시간 목록 */}
      {alternatives.map((alt, index) => (
        <div
          key={index}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 12px',
            backgroundColor: '#f5f5f5',
            borderRadius: 6,
            marginBottom: 8,
            fontSize: 14,
          }}
        >
          <span>
            {formatDisplayDate(alt.proposedDate)} {alt.proposedStartTime}
          </span>
          <button
            onClick={() => handleRemove(index)}
            style={{
              background: 'none',
              border: 'none',
              color: '#f44336',
              cursor: 'pointer',
              fontSize: 14,
              padding: '4px 8px',
            }}
          >
            삭제
          </button>
        </div>
      ))}

      {/* 대안 시간 추가 UI */}
      {alternatives.length < 5 && (
        <div style={{ marginTop: 16 }}>
          {renderCalendar()}

          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            style={{
              width: '100%',
              padding: 12,
              borderRadius: 8,
              border: '1px solid #ddd',
              fontSize: 14,
              marginTop: 12,
            }}
          >
            <option value="">시간 선택</option>
            {timeOptions.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>

          <Button
            className="ui-btn--secondary"
            onClick={handleAdd}
            disabled={!selectedDate || !selectedTime}
            style={{ marginTop: 12, width: '100%' }}
          >
            대안 시간 추가
          </Button>
        </div>
      )}
    </div>
  );
}
