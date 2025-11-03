import { useState } from 'react';
import { getDayLabel } from '@/shared/constants/date';
import LessonBookingStepFooter from './LessonBookingStepFooter';
import { getContractTypeLabel, isFirstcome, isRegular } from '../types/types';

export interface LessonBookingStep4Props {
  step1: any;
  step2: any;
  step3: any;
  onPrev: () => void;
  onSubmit: () => void;
  totalPrice: number;
}

export default function LessonBookingStep4({
  step1,
  step2,
  step3,
  onPrev,
  onSubmit,
  totalPrice,
}: LessonBookingStep4Props) {
  const [agreed, setAgreed] = useState(false);

  return (
    <div>
      <div style={{ fontWeight: 500, marginBottom: 8 }}>모든 정보가 맞는지 확인해 주세요.</div>
      <div style={{ background: '#f8f8fa', borderRadius: 10, padding: 16, marginBottom: 16 }}>
        <ul style={{ padding: 0, margin: 0, listStyle: 'none', fontSize: 15 }}>
          <li>
            <b>레슨 유형:</b> {getContractTypeLabel(step1?.contractType)}
          </li>
          <li>
            <b>레슨 패키지:</b> {step1?.weekCount ? `주 ${step1.weekCount}회` : '-'} / 총{' '}
            {step1?.lessonCount || '-'}회
          </li>
          <li>
            <b>레슨 과목:</b> {step1?.lessonCategory ? step1.lessonCategory.label : '-'}
          </li>
          <li>
            <b>희망 장소:</b> {step1?.place || '-'}
          </li>
          <li>레슨 일정:</li>
          {/* 첫 번째 slot 기준 안내 - 정기레슨만 */}
          {isRegular(step1?.contractType) &&
            step2?.lessonDtList?.length > 0 &&
            (() => {
              const first = step2.lessonDtList[0];
              const dateObj = new Date(first);
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
          {isFirstcome(step1?.contractType) && (
            <div style={{ color: '#888', fontSize: 14, margin: '8px 0 0 16px' }}>
              선착순 신청은 매달 마지막일부터 다음달 레슨을 신청할 수 있습니다.
            </div>
          )}
          <li>실력: {step3?.level}</li>
          <li>목표/요청: {step3?.memo}</li>
          <li>비상 연락처: {step3?.emergencyContact}</li>
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
      <LessonBookingStepFooter
        onPrev={onPrev}
        onNext={onSubmit}
        nextLabel="신청 완료"
        nextDisabled={!agreed}
      />
    </div>
  );
}
