import { useState } from 'react';
import LessonCalendarPicker from '@/domain/lesson/components/LessonCalendarPicker';
import { getDayLabel } from '@/shared/constants/date';
// import TuCalendar from '@/shared/components/TuCalendar';
import OnboardingLayout from '../../onboarding/components/OnboardingLayout';
import RegularLessonStepFooter from './RegularLessonStepFooter';
import { useToast } from '@/shared/contexts/ToastContext';
import { Button } from '@/shared/components';

interface ScheduleSlot {
  day: string; // 요일 (예: '월')
  time: string; // 시간대 (예: '오후 7:00')
}

export interface RegularLessonStep2FormProps {
  totalCount: number; // 총 신청 횟수
  lessonType: string;
  onPrev: () => void;
  onNext: (data: { startDate: string; slots: ScheduleSlot[] }) => void;
}

export default function RegularLessonStep2Form({
  totalCount,
  lessonType,
  onPrev,
  onNext,
}: RegularLessonStep2FormProps) {
  // 예약 캘린더+시간 칩 UI에서 선택한 값만 전달
  // 여러 날짜/시간을 lessonCount만큼 선택
  const [slots, setSlots] = useState<{ date: string; time: string }[]>([]);
  const [tempDate, setTempDate] = useState<string>('');
  const [tempTime, setTempTime] = useState<string>('');
  const isNextEnabled = slots.length === totalCount;

  const { showToast } = useToast();

  return (
    <OnboardingLayout title="언제 레슨을 받고 싶으신가요?">
      {/* 희망 시작일/시간대 예약 캘린더+칩 UI (공통) */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontWeight: 500, marginBottom: 8 }}>희망 시작일/시간대</div>
        <LessonCalendarPicker
          teacherId={undefined} // TODO: 실제 튜터 id 전달 필요
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
            if (lessonType === 'FIRSTCOME') {
              // 선착순 신청은 한 번만 선택 가능
              if (date && time) {
                setSlots([{ date, time }]);
                setTempTime(time);
              } else if (time) {
                setTempTime(time);
              }
              return;
            }
            // 정기레슨: 여러 개 선택 가능
            if (date && time && !slots.some((s) => s.date === date && s.time === time)) {
              if (slots.length >= totalCount) {
                showToast(`최대 ${totalCount}회까지 선택할 수 있습니다.`, 'info');
                return;
              }
              setSlots([...slots, { date, time }]);
              setTempTime('');
            } else if (time) {
              setTempTime(time);
            }
          }}
        />
      </div>
      {lessonType === 'REGULAR' ? (
        <div style={{ color: '#888', fontSize: 14, marginBottom: 8, textAlign: 'right' }}>
          <b>
            {slots.length} / {totalCount}회
          </b>
          <br />
          <span>
            처음 예약이라면 모든 스케줄 예약이 필요합니다. <br />
            스케줄을 선택해 주세요. <br />
            (정기 레슨의 경우, 첫 레슨 날짜를 기준으로 두 번째 달부터 매주 동일한 요일/시간대로
            예약됩니다.)
          </span>
        </div>
      ) : (
        <div style={{ color: '#888', fontSize: 14, marginBottom: 8, textAlign: 'right' }}>
          <span>원하는 날짜와 시간 1회만 선택해 주세요.</span>
        </div>
      )}
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
                    {lessonType === 'REGULAR'
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
      <RegularLessonStepFooter
        onPrev={onPrev}
        onNext={() =>
          onNext({
            startDate: slots[0]?.date ?? '',
            slots: slots.map((s) => ({
              day: s.date,
              time: s.time,
            })),
          })
        }
        nextLabel="다음 → (스케줄 확정)"
        nextDisabled={!isNextEnabled}
      />
    </OnboardingLayout>
  );
}
