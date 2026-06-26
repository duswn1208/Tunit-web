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

/* 섹션 아이콘 (보라색 단색 SVG) */
function CalendarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}
function ClipboardIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="2" width="8" height="4" rx="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M9 12h6M9 16h4" />
    </svg>
  );
}
function PersonIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M5 21a7 7 0 0 1 14 0" />
    </svg>
  );
}
function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  );
}

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <span
        className="flex items-center justify-center"
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: 'var(--color-primary-bg)',
          color: 'var(--color-primary)',
          flexShrink: 0,
        }}
      >
        {icon}
      </span>
      <span className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>
        {title}
      </span>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline">
      <span style={{ color: 'var(--text-tertiary)', width: 72, flexShrink: 0 }}>{label}</span>
      <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{value}</span>
    </div>
  );
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

  const trial = isTrial(step1?.contractType);
  const categoryLabel = step1?.lessonCategory?.label || '-';
  const typeLabel = trial
    ? `${categoryLabel} (체험)`
    : `${getContractTypeLabel(step1?.contractType)} · ${categoryLabel}`;

  const renderWhen = () => {
    if (trial) {
      if (!step2?.trialCandidates?.length) {
        return <div style={{ color: 'var(--text-primary)' }}>-</div>;
      }
      return (
        <div className="space-y-2">
          {step2.trialCandidates.map((c: any) => (
            <div
              key={c.priority}
              className="flex items-baseline gap-2"
              style={{ color: 'var(--text-primary)' }}
            >
              <span style={{ color: 'var(--text-tertiary)', fontSize: '0.9em' }}>
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
      return <div style={{ color: 'var(--text-primary)' }}>-</div>;
    }
    return (
      <div className="space-y-2" style={{ color: 'var(--text-primary)' }}>
        {step2.lessonDtList.map((dt: string) => (
          <div key={dt} style={{ fontFamily: NUM_FONT }}>
            {toKoreanDateTime(dt)}
          </div>
        ))}
      </div>
    );
  };

  const placeNotice = [step1?.place, '튜터에 의해 변경될 수 있어요'].filter(Boolean).join(' · ');

  return (
    <div className="max-w-lg mx-auto p-4">
      <div className="bg-white rounded-2xl shadow-md mb-5">
        <div style={{ padding: '32px 28px 28px' }}>
          <div
            className="font-bold text-center mb-8"
            style={{ color: 'var(--text-primary)', fontSize: '1.6rem', lineHeight: 1.35, letterSpacing: '-0.01em' }}
          >
            신청 내용을
            <br />
            확인해주세요
          </div>

          {/* 섹션 1: 언제 어디서 */}
          <section>
            <SectionHeader icon={<CalendarIcon />} title="언제 어디서 할까요?" />
            <div style={{ paddingLeft: 46 }}>
              {renderWhen()}
              <div className="mt-2" style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
                {placeNotice}
              </div>
            </div>
          </section>

          <div className="my-6" style={{ borderTop: '1px solid var(--border-light)' }} />

          {/* 섹션 2: 레슨 정보 */}
          <section>
            <SectionHeader icon={<ClipboardIcon />} title="이런 레슨을 신청했어요" />
            <div className="space-y-2.5" style={{ paddingLeft: 46 }}>
              <InfoRow label="유형" value={typeLabel} />
              {!trial && (
                <InfoRow
                  label="패키지"
                  value={
                    <span style={{ fontFamily: NUM_FONT }}>
                      주 {step1?.weekCount || '-'}회 / 총 {step1?.lessonCount || '-'}회
                    </span>
                  }
                />
              )}
            </div>
            {isFirstcome(step1?.contractType) && (
              <div
                className="text-sm mt-3"
                style={{ color: 'var(--text-tertiary)', paddingLeft: 46 }}
              >
                선착순 신청은 매주 일요일부터 다음주 레슨을 신청할 수 있습니다.
              </div>
            )}
          </section>

          <div className="my-6" style={{ borderTop: '1px solid var(--border-light)' }} />

          {/* 섹션 3: 튜터에게 전달할 정보 */}
          <section>
            <SectionHeader icon={<PersonIcon />} title="튜터에게 미리 알려드릴게요" />
            <div className="space-y-2.5" style={{ paddingLeft: 46 }}>
              <InfoRow label="실력" value={step3?.level || '-'} />
              <InfoRow label="요청" value={step3?.memo || '-'} />
              <InfoRow
                label="연락처"
                value={<span style={{ fontFamily: NUM_FONT }}>{step3?.emergencyContact || '-'}</span>}
              />
            </div>
          </section>

          <div className="my-6" style={{ borderTop: '1px solid var(--border-light)' }} />

          {/* 섹션 4: 결제 금액 */}
          <section>
            <div className="flex items-baseline justify-between">
              <span className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>
                결제 금액{' '}
                <span className="font-normal text-sm" style={{ color: 'var(--text-tertiary)' }}>
                  참고용
                </span>
              </span>
              <span
                className="font-bold"
                style={{ color: 'var(--color-primary)', fontFamily: NUM_FONT, fontSize: '1.6rem' }}
              >
                {totalPrice.toLocaleString()}
                <span className="text-base font-semibold" style={{ marginLeft: 2 }}>
                  원
                </span>
              </span>
            </div>
            <div
              className="mt-3 flex items-start gap-2 text-xs leading-relaxed"
              style={{
                color: 'var(--text-tertiary)',
                background: 'var(--bg-gray)',
                borderRadius: 8,
                padding: '12px 14px',
              }}
            >
              <span style={{ marginTop: 1, flexShrink: 0 }}>
                <InfoIcon />
              </span>
              <span>
                실제 결제는 튜터 확정 후 진행돼요. 본 서비스는 결제 기능을 제공하지 않으니, 튜터의
                자체 결제 서비스를 이용하시거나 튜터에게 직접 문의해 주세요.
              </span>
            </div>
          </section>
        </div>
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
        nextFlex={2}
      />
    </div>
  );
}
