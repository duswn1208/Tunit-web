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

const NUM_FONT =
  '-apple-system, "SF Pro Display", "SF Pro Text", BlinkMacSystemFont, system-ui, sans-serif';

export default function ContractRequestStep4({
  step1,
  step2,
  step3,
  onPrev,
  onSubmit,
  totalPrice,
}: ContractRequestStep4Props) {
  const [agreed, setAgreed] = useState(false);

  const trial = isTrial(step1?.contractType);
  const categoryLabel = step1?.lessonCategory?.label || '-';
  const typeLabel = trial
    ? `${categoryLabel} (체험)`
    : `${getContractTypeLabel(step1?.contractType)} · ${categoryLabel}`;

  const renderWhen = () => {
    if (trial) {
      if (!step2?.trialCandidates?.length) {
        return <span style={{ color: 'var(--text-primary)' }}>-</span>;
      }
      return (
        <div className="space-y-1.5">
          {step2.trialCandidates.map((c: any) => (
            <div
              key={c.priority}
              className="flex items-baseline gap-2"
              style={{ color: 'var(--text-primary)' }}
            >
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9em' }}>
                {c.priority}순위
              </span>
              <span style={{ fontFamily: NUM_FONT }}>
                {new Date(c.candidateDate + 'T00:00:00').toLocaleDateString('ko-KR', {
                  month: 'long',
                  day: 'numeric',
                  weekday: 'short',
                })}{' '}
                {c.candidateStartTime}
              </span>
            </div>
          ))}
        </div>
      );
    }
    if (!step2?.lessonDtList?.length) {
      return <span style={{ color: 'var(--text-primary)' }}>-</span>;
    }
    return (
      <div className="flex flex-wrap gap-x-2 gap-y-1" style={{ color: 'var(--text-primary)' }}>
        {step2.lessonDtList.map((dt: string, idx: number) => (
          <span key={dt} style={{ fontFamily: NUM_FONT }}>
            {toKoreanDateTime(dt)}
            {idx < step2.lessonDtList.length - 1 ? ',' : ''}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <div
        className="font-semibold text-xl mb-6"
        style={{ color: 'var(--text-primary)', letterSpacing: '-0.01em' }}
      >
        신청 내용을 확인해주세요
      </div>

      <div className="bg-white rounded-2xl shadow-md mb-5" style={{ padding: '32px 28px' }}>
        {/* 섹션 1: 언제 어디서 */}
        <section>
          <div
            className="font-semibold text-base mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            언제 어디서 할까요?
          </div>
          <div className="flex items-start gap-3 mb-3">
            <span role="img" aria-label="calendar" style={{ marginTop: 2 }}>
              🗓️
            </span>
            <div className="flex-1">{renderWhen()}</div>
          </div>
          <div className="flex items-start gap-3">
            <span role="img" aria-label="pin" style={{ marginTop: 2 }}>
              📍
            </span>
            <div className="flex-1" style={{ color: 'var(--text-primary)' }}>
              {step1?.place || '-'}
              <span style={{ color: 'var(--text-muted)', fontSize: '0.88em' }}>
                {' '}
                (튜터에 의해 변경될 수 있어요)
              </span>
            </div>
          </div>
        </section>

        <div
          className="my-6"
          style={{ borderTop: '1px solid var(--border-light)' }}
        />

        {/* 섹션 2: 레슨 정보 */}
        <section>
          <div
            className="font-semibold text-base mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            이런 레슨을 신청했어요
          </div>
          <ul className="list-none space-y-2.5">
            <li>
              <span style={{ color: 'var(--text-muted)' }}>유형 </span>
              <span style={{ color: 'var(--text-primary)' }}>{typeLabel}</span>
            </li>
            {!trial && (
              <li>
                <span style={{ color: 'var(--text-muted)' }}>패키지 </span>
                <span style={{ color: 'var(--text-primary)', fontFamily: NUM_FONT }}>
                  주 {step1?.weekCount || '-'}회 / 총 {step1?.lessonCount || '-'}회
                </span>
              </li>
            )}
          </ul>
          {isFirstcome(step1?.contractType) && (
            <div className="text-sm mt-3" style={{ color: 'var(--text-muted)' }}>
              선착순 신청은 매주 일요일부터 다음주 레슨을 신청할 수 있습니다.
            </div>
          )}
        </section>

        <div
          className="my-6"
          style={{ borderTop: '1px solid var(--border-light)' }}
        />

        {/* 섹션 3: 튜터에게 전달할 정보 */}
        <section>
          <div
            className="font-semibold text-base mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            튜터에게 미리 알려드릴게요
          </div>
          <ul className="list-none space-y-2.5">
            <li>
              <span style={{ color: 'var(--text-muted)' }}>실력 </span>
              <span style={{ color: 'var(--text-primary)' }}>{step3?.level || '-'}</span>
            </li>
            <li>
              <span style={{ color: 'var(--text-muted)' }}>요청 </span>
              <span style={{ color: 'var(--text-primary)' }}>{step3?.memo || '-'}</span>
            </li>
            <li>
              <span style={{ color: 'var(--text-muted)' }}>비상 연락처 </span>
              <span style={{ color: 'var(--text-primary)', fontFamily: NUM_FONT }}>
                {step3?.emergencyContact || '-'}
              </span>
            </li>
          </ul>
        </section>

        <div
          className="my-6"
          style={{ borderTop: '1px solid var(--border-light)' }}
        />

        {/* 섹션 4: 결제 금액 */}
        <section>
          <div className="flex items-baseline justify-between">
            <span style={{ color: 'var(--text-muted)' }}>결제 금액 (참고용)</span>
            <span
              className="font-bold text-xl"
              style={{ color: 'var(--text-primary)', fontFamily: NUM_FONT }}
            >
              {totalPrice.toLocaleString()}
              <span className="text-base font-semibold" style={{ marginLeft: 2 }}>
                원
              </span>
            </span>
          </div>
          <div
            className="mt-3 text-xs leading-relaxed"
            style={{
              color: 'var(--text-muted)',
              background: 'var(--bg-gray)',
              borderRadius: 8,
              padding: '10px 12px',
            }}
          >
            실제 결제는 튜터 확정 후 진행돼요. 본 서비스는 결제 기능을 제공하지 않으니, 튜터의 자체
            결제 서비스를 이용하시거나 튜터에게 직접 문의해 주세요.
          </div>
        </section>
      </div>

      <label className="flex items-center mb-6 text-sm gap-2">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="w-5 h-5 rounded-full border-2 mr-2"
          style={{ accentColor: 'var(--brand-red)', borderColor: 'var(--brand-red)' }}
        />
        <span style={{ color: 'var(--text-secondary)' }}>
          <a
            href="/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
            style={{ color: 'var(--text-primary)' }}
          >
            이용 약관
          </a>{' '}
          및{' '}
          <a
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
            style={{ color: 'var(--text-primary)' }}
          >
            개인정보 처리방침
          </a>
          에 동의합니다.
        </span>
      </label>

      <ContractRequestStepFooter
        onPrev={onPrev}
        onNext={onSubmit}
        nextLabel="신청 완료하기"
        nextDisabled={!agreed}
      />
    </div>
  );
}
