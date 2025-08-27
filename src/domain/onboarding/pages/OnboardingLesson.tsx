import { useNavigate } from 'react-router-dom';

import { ChipList } from '../../../components';
import OnboardingLayout from '../common/components/OnboardingLayout';
import { useOnboardingLesson } from '../lesson/hooks/useLesson';
import OnboardingNextButton from '../common/components/OnboardingNextButton';

export default function OnboardingLesson() {
  const navigate = useNavigate();
  const {
    mains,
    mainCode,
    subs,
    selectedSubs,
    loadingMain,
    loadingSub,
    chipList,
    canSubmit,
    selectMain,
    removeChip,
    toggleSub,
  } = useOnboardingLesson();

  const goNext = () => {
    if (!canSubmit) return;
    localStorage.setItem(
      'onboarding.step3.tutor',
      JSON.stringify({ mainCode, subCodes: Array.from(selectedSubs) })
    );
    navigate('/onboarding/tutor/region');
  };

  return (
    <OnboardingLayout
      step={3}
      total={4}
      subtitle="레슨 유형을 고른 뒤, 상세 레슨을 여러 개 선택하세요."
      footer={<OnboardingNextButton addClass="ui-btn--full" onClick={goNext} />}
    >
      <div className="mls-header">
        <h2 className="text-xl" style={{ fontWeight: 700 }}>
          가르칠 레슨 유형을 선택해주세요
        </h2>
        <div className="mls-sub">(중복선택 가능)</div>
      </div>
      <ChipList
        items={chipList}
        onRemove={removeChip}
        emptyText={
          <span style={{ fontSize: 13, color: '#6b7280' }}>
            상세 레슨을 선택하면 이곳에 표시돼요
          </span>
        }
      />

      {/* Body (mls 컨테이너: mls-body + 섹션 패딩) */}
      <div className="mls-body">
        {/* 대분류 */}
        <div style={{ padding: '16px 20px 8px' }}>
          <div style={{ fontSize: 14, fontWeight: 700, margin: '0 0 8px 2px' }}>레슨 유형</div>
          {loadingMain ? (
            <div style={{ padding: '6px 2px' }}>대분류 불러오는 중…</div>
          ) : mains.length ? (
            <div className="mls-grid">
              {mains.map((m) => {
                const active = mainCode === m.code;
                return (
                  <div
                    key={m.code}
                    className={`mls-card-item ${active ? 'active' : ''}`}
                    role="button"
                    tabIndex={0}
                    onClick={() => selectMain(m.code)}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && selectMain(m.code)}
                  >
                    <span style={{ fontWeight: 700, color: '#000' }}>{m.label}</span>
                    <span className="mls-check" />
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ opacity: 0.7, padding: '6px 2px' }}>레슨 유형이 없습니다.</div>
          )}
        </div>

        {/* 소분류 */}
        <div style={{ padding: '0 20px 16px' }}>
          <div style={{ fontSize: 14, fontWeight: 700, margin: '8px 0 8px 2px' }}>상세 레슨</div>
          {!mainCode ? (
            <div className="mls-sub" style={{ padding: '6px 2px' }}>
              먼저 레슨 유형을 선택하세요.
            </div>
          ) : loadingSub ? (
            <div style={{ padding: '6px 2px' }}>상세 레슨 불러오는 중…</div>
          ) : subs.length ? (
            <div className="mls-grid">
              {subs.map((s) => {
                const code = String(s.code);
                const active = selectedSubs.has(code);
                return (
                  <div
                    key={s.code}
                    className={`mls-card-item ${active ? 'active' : ''}`}
                    role="button"
                    tabIndex={0}
                    onClick={() => toggleSub(code)}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleSub(code)}
                  >
                    <span style={{ fontWeight: 700, color: '#000' }}>{s.label}</span>
                    <span className="mls-check" />
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ opacity: 0.7, padding: '6px 2px' }}>상세 레슨이 없습니다.</div>
          )}
        </div>
      </div>
    </OnboardingLayout>
  );
}
