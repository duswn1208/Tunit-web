import { useState } from 'react';
import { getDayLabel } from '@/shared/constants/date';
import OnboardingLayout from '../../onboarding/components/OnboardingLayout';

export interface RegularLessonStep4FormProps {
  step1: any;
  step2: any;
  step3: any;
  onPrev: () => void;
  onSubmit: () => void;
  totalPrice: number;
}

export default function RegularLessonStep4Form({
  step1,
  step2,
  step3,
  onPrev,
  onSubmit,
  totalPrice,
}: RegularLessonStep4FormProps) {
  const [agreed, setAgreed] = useState(false);

  return (
    <OnboardingLayout title="[STEP 4/4] 최종 확인 및 요청">
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontWeight: 500, marginBottom: 8 }}>모든 정보가 맞는지 확인해 주세요.</div>
        <div style={{ background: '#f8f8fa', borderRadius: 10, padding: 16, marginBottom: 16 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>신청 정보 요약</div>
          <ul style={{ padding: 0, margin: 0, listStyle: 'none', fontSize: 15 }}>
            <li>레슨 패키지: {step1?.lessonPackage}회</li>
            <li>장소: {step1?.place}</li>
            <li>레슨 일정:</li>
            {/* 첫 번째 slot 기준 안내 */}
            {step2?.slots?.length > 0 &&
              (() => {
                const first = step2.slots[0];
                const dateObj = new Date(first.day);
                const dayNum = (
                  dateObj.getDay() === 0 ? 7 : dateObj.getDay()
                ) as import('@/shared/constants/date').DayOfWeekNumber;
                const dayLabel = getDayLabel(dayNum);
                return (
                  <div style={{ color: '#e14a4a', fontWeight: 600, margin: '4px 0 8px 16px' }}>
                    ※ 매주 {dayLabel}요일 {first.time}에 진행됩니다
                  </div>
                );
              })()}
            <ul style={{ marginLeft: 16 }}>
              {step2?.slots?.map((s: any, i: number) => (
                <li key={i}>
                  {s.day} {s.time}
                </li>
              ))}
            </ul>
            <li>실력: {step3?.level}</li>
            <li>목표/요청: {step3?.goal}</li>
            <li>비상 연락처: {step3?.phone}</li>
          </ul>
        </div>
        <div style={{ fontWeight: 700, fontSize: 18, color: '#e14a4a', marginBottom: 12 }}>
          총 견적 금액: {totalPrice.toLocaleString()}원
        </div>
        <label style={{ display: 'flex', alignItems: 'center', marginBottom: 20, fontSize: 15 }}>
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            style={{ marginRight: 8 }}
          />
          <span>
            <a
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#e14a4a', textDecoration: 'underline' }}
            >
              이용 약관
            </a>{' '}
            및{' '}
            <a
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#e14a4a', textDecoration: 'underline' }}
            >
              개인정보 처리방침
            </a>
            에 동의합니다.
          </span>
        </label>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          type="button"
          onClick={onPrev}
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 8,
            border: '1px solid #ddd',
            background: '#fff',
            fontWeight: 500,
          }}
        >
          이전
        </button>
        <button
          type="button"
          disabled={!agreed}
          onClick={onSubmit}
          style={{
            flex: 2,
            padding: 12,
            borderRadius: 8,
            background: '#e14a4a',
            color: '#fff',
            fontWeight: 700,
            border: 'none',
            fontSize: 16,
            opacity: agreed ? 1 : 0.6,
            cursor: agreed ? 'pointer' : 'not-allowed',
          }}
        >
          레슨 요청 및 결제 진행
        </button>
      </div>
    </OnboardingLayout>
  );
}
