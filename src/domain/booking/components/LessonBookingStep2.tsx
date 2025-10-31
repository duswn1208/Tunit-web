import { useState } from 'react';
import LessonCalendarPicker from '@/domain/lesson/components/LessonCalendarPicker';
import { getDayLabel } from '@/shared/constants/date';
import LessonBookingStepFooter from './LessonBookingStepFooter';

interface LessonBookingStep2Props {
  contractType: string;
  totalCount: number;
  selectedDate: string;
  setSelectedDate: (v: string) => void;
  selectedTime: string;
  setSelectedTime: (v: string) => void;
  onPrev: () => void;
  onNext: (slots: string[]) => void;
}

export default function LessonBookingStep2({
  contractType,
  totalCount,
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  onPrev,
  onNext,
}: LessonBookingStep2Props) {
  const [slots, setSlots] = useState<{ date: string; time: string }[]>(
    selectedDate && selectedTime ? [{ date: selectedDate, time: selectedTime }] : []
  );
  const [tempDate, setTempDate] = useState<string>(selectedDate || '');
  const [tempTime, setTempTime] = useState<string>(selectedTime || '');
  const isNextEnabled =
    contractType === 'REGULAR' ? slots.length === totalCount : slots.length === 1;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <LessonCalendarPicker
          teacherId={undefined}
          startDate={new Date().toISOString().split('T')[0]}
          endDate={(() => {
            const today = new Date();
            const monthEnd = new Date(today.getFullYear(), today.getMonth() + 2, 0);
            return monthEnd.toISOString().split('T')[0];
          })()}
          date={tempDate}
          time={tempTime}
          onChange={(date, time) => {
            if (date && date !== tempDate) {
              setTempDate(date);
              setTempTime('');
              return;
            }
            if (contractType === 'FIRSTCOME' || contractType === 'TRIAL') {
              if (date && time) {
                setSlots([{ date, time }]);
                setTempTime(time);
                setSelectedDate(date);
                setSelectedTime(time);
              } else if (time) {
                setTempTime(time);
              }
              return;
            }
            // 정기레슨: 여러 개 선택 가능
            if (date && time && !slots.some((s) => s.date === date && s.time === time)) {
              if (slots.length >= totalCount) {
                // showToast(`최대 ${totalCount}회까지 선택할 수 있습니다.`, 'info');
                return;
              }
              setSlots([...slots, { date, time }]);
              setTempTime('');
            } else if (time) {
              setTempTime(time);
            }
          }}
          size="small"
        />
      </div>
      {contractType === 'REGULAR' ? (
        <div style={{ color: '#888', fontSize: 14, marginBottom: 8, textAlign: 'right' }}>
          <b>
            {slots.length} / {totalCount}회
          </b>
          <br />
          <span>
            처음 예약이라면 첫달 모든 스케줄 예약이 필요합니다. <br />
            스케줄을 선택해 주세요. <br />
            (정기 레슨의 경우, 첫 레슨 날짜를 기준으로 두 번째 달부터 매주 동일한 요일/시간대로
            예약됩니다.)
          </span>
        </div>
      ) : contractType === 'FIRSTCOME' || contractType === 'TRIAL' ? (
        <div style={{ color: '#888', fontSize: 14, marginBottom: 8, textAlign: 'right' }}>
          <span>원하는 날짜와 시간 1회만 선택해 주세요.</span>
        </div>
      ) : null}
      {slots.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontWeight: 500, marginBottom: 6 }}>신청 스케줄</div>
          <ul
            style={{
              padding: 0,
              margin: 0,
              listStyle: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            {slots.map((s, i) => {
              const dateObj = new Date(s.date);
              const dayNum = (
                dateObj.getDay() === 0 ? 7 : dateObj.getDay()
              ) as import('@/shared/constants/date').DayOfWeekNumber;
              const dayLabel = getDayLabel(dayNum);
              return (
                <li
                  key={s.date + s.time}
                  style={{
                    background: '#f8f8fa',
                    borderRadius: 8,
                    padding: '8px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <span style={{ fontWeight: 600, color: '#333' }}>
                    {contractType === 'REGULAR'
                      ? `(${s.date}) 매주 ${dayLabel}요일`
                      : `(${s.date}) ${dayLabel}요일`}
                  </span>
                  <span style={{ color: '#666', fontWeight: 500 }}>{s.time}</span>
                  <button
                    type="button"
                    style={{
                      marginLeft: 'auto',
                      color: '#d33',
                      background: 'none',
                      border: 'none',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                    onClick={() => setSlots(slots.filter((_, idx) => idx !== i))}
                  >
                    삭제
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      <LessonBookingStepFooter
        onPrev={onPrev}
        onNext={() => onNext(slots.map((s) => `${s.date} ${s.time}`))}
        nextLabel="다음"
        nextDisabled={!isNextEnabled}
      />
    </div>
  );
}
