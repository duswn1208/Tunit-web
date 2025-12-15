import { useState } from 'react';
import ContractRequestStepFooter from './ContractRequestStepFooter';
import { getContractTypeLabel, isFirstcome, isTrial } from '../types/types';
import { toKoreanDateTime } from '@/domain/dayTime/lib/timeUtils';

export interface ContractRequestStep4Props {
  step1: any;
  step2: any;
  step3: any;
  onPrev: () => void;
  onSubmit: () => void;
  totalPrice: number;
}

export default function ContractRequestStep4({
  step1,
  step2,
  step3,
  onPrev,
  onSubmit,
  totalPrice,
}: ContractRequestStep4Props) {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="max-w-lg mx-auto p-4">
      <div
        className="font-semibold text-lg mb-3 flex items-center gap-2"
        style={{ color: 'var(--text-primary)' }}
      >
        <span role="img" aria-label="bear">
          🐻
        </span>
        모든 정보가 맞는지 확인해 주세요.
      </div>
      <div className="bg-white rounded-2xl shadow-md p-5 mb-5">
        <ul className="list-none text-base space-y-2">
          <li>
            <span className="font-bold" style={{ color: 'var(--brand-red)' }}>
              🎀 레슨 유형:
            </span>
            <span style={{ color: 'var(--text-secondary)' }}>
              {' '}
              {getContractTypeLabel(step1?.contractType)}
            </span>
          </li>
          {!isTrial(step1?.contractType) && (
            <li>
              <span className="font-bold" style={{ color: 'var(--brand-red)' }}>
                📦 레슨 패키지:
              </span>
              <span style={{ color: 'var(--text-secondary)' }}>
                {' '}
                {step1?.weekCount ? `주 ${step1.weekCount}회` : '-'} / 총{' '}
                {step1?.lessonCount || '-'}회
              </span>
            </li>
          )}
          <li>
            <span className="font-bold" style={{ color: 'var(--brand-red)' }}>
              📚 레슨 과목:
            </span>
            <span style={{ color: 'var(--text-secondary)' }}>
              {' '}
              {step1?.lessonCategory ? step1.lessonCategory.label : '-'}
            </span>
          </li>
          <li>
            <span className="font-bold" style={{ color: 'var(--brand-red)' }}>
              🏠 희망 장소:
            </span>
            <span style={{ color: 'var(--text-secondary)' }}>
              {' '}
              {(step1?.place || '-') + ' (튜터에 의해 변경될 수 있어요)'}
            </span>
          </li>
          <li className="font-bold" style={{ color: 'var(--brand-red)' }}>
            🗓️ 첫 레슨일:
          </li>
          {step2?.lessonDtList?.length > 0 && (
            <div
              className="font-semibold ml-4 my-2 flex flex-wrap gap-2"
              style={{ color: 'var(--brand-red)' }}
            >
              {step2.lessonDtList.map((dt: string, idx: number) => (
                <span key={dt}>
                  {toKoreanDateTime(dt)}
                  {idx < step2.lessonDtList.length - 1 ? ',' : ''}
                </span>
              ))}
            </div>
          )}
          <ul className="ml-4 space-y-1">
            {step2?.slots?.map((s: any, i: number) => (
              <li
                key={i}
                className="flex items-center gap-1"
                style={{ color: 'var(--text-secondary)' }}
              >
                <span role="img" aria-label="clock">
                  ⏰
                </span>{' '}
                {s.day} {s.time}
              </li>
            ))}
          </ul>
          {isFirstcome(step1?.contractType) && (
            <div className="text-sm ml-4 mt-2" style={{ color: 'var(--text-muted)' }}>
              선착순 신청은 매주 일요일부터 다음주 레슨을 신청할 수 있습니다.
            </div>
          )}
          <li>
            <span className="font-bold" style={{ color: 'var(--brand-red)' }}>
              💪 실력:
            </span>
            <span style={{ color: 'var(--text-secondary)' }}> {step3?.level}</span>
          </li>
          <li>
            <span className="font-bold" style={{ color: 'var(--brand-red)' }}>
              🎯 목표/요청:
            </span>
            <span style={{ color: 'var(--text-secondary)' }}> {step3?.memo}</span>
          </li>
          <li>
            <span className="font-bold" style={{ color: 'var(--brand-red)' }}>
              📞 비상 연락처:
            </span>
            <span style={{ color: 'var(--text-secondary)' }}> {step3?.emergencyContact}</span>
          </li>
        </ul>
      </div>
      <div className="font-bold text-xl mb-4 text-center" style={{ color: 'var(--brand-red)' }}>
        총 견적 금액: {totalPrice.toLocaleString()}원
      </div>
      <label className="flex items-center mb-6 text-base gap-2">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="w-5 h-5 rounded-full border-2 mr-2"
          style={{ accentColor: 'var(--brand-red)', borderColor: 'var(--brand-red)' }}
        />
        <span>
          <a
            href="/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-semibold"
            style={{ color: 'var(--brand-red)' }}
          >
            이용 약관
          </a>{' '}
          및{' '}
          <a
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-semibold"
            style={{ color: 'var(--brand-red)' }}
          >
            개인정보 처리방침
          </a>
          에 동의합니다.
        </span>
      </label>
      <ContractRequestStepFooter
        onPrev={onPrev}
        onNext={onSubmit}
        nextLabel="신청 완료"
        nextDisabled={!agreed}
      />
    </div>
  );
}
