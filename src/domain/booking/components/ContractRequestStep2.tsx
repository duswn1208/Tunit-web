import { useState } from 'react';
import LessonCalendarPicker from '@/domain/lesson/components/LessonCalendarPicker';
import { getDayLabel } from '@/shared/constants/date';
import ContractRequestStepFooter from './ContractRequestStepFooter';
import { isRegular, type ContractType } from '../types/types';
import { useToast } from '@/shared/contexts/ToastContext';

interface ContractRequestStep2Props {
  tutorProfileNo: string;
  contractType: ContractType;
  weekCount: number;
  selectedDate: string;
  setSelectedDate: (v: string) => void;
  selectedTime: string;
  setSelectedTime: (v: string) => void;
  onPrev: () => void;
  onNext: (slots: string[]) => void;
}

export default function ContractRequestStep2({
  tutorProfileNo,
  contractType,
  weekCount,
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  onPrev,
  onNext,
}: ContractRequestStep2Props) {
  const { showToast } = useToast();
  const [slots, setSlots] = useState<{ date: string; time: string }[]>(
    selectedDate && selectedTime ? [{ date: selectedDate, time: selectedTime }] : []
  );
  const [tempDate, setTempDate] = useState<string>(selectedDate || '');
  const [tempTime, setTempTime] = useState<string>(selectedTime || '');
  const isNextEnabled = slots.length === weekCount;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <LessonCalendarPicker
          tutorProfileNo={Number(tutorProfileNo)}
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
            if (!isRegular(contractType)) {
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
            if (date && time && slots.some((s) => s.date === date && s.time === time)) {
              showToast('이미 선택한 스케줄입니다.', 'info');
              return;
            }

            if (date && time && !slots.some((s) => s.date === date && s.time === time)) {
              if (slots.length >= weekCount) {
                showToast(`최대 ${weekCount}회까지 선택할 수 있습니다.`, 'info');
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
      {isRegular(contractType) ? (
        <div style={{ color: '#888', fontSize: 14, marginBottom: 8, textAlign: 'right' }}>
          <b>
            {slots.length} / {weekCount}회
          </b>
          <br />
          <span>
            레슨을 시작하는 날짜와 시간을 선택해주세요. <br />
            (정기 레슨의 경우, 선택한 날짜대로 매주 레슨이 예약됩니다.) <br />
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
                    {isRegular(contractType)
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
      <ContractRequestStepFooter
        onPrev={onPrev}
        onNext={() => onNext(slots.map((s) => `${s.date} ${s.time}`))}
        nextLabel="다음"
        nextDisabled={!isNextEnabled}
      />
    </div>
  );
}
