import { ChipList } from '../../components/ui';
import { OnboardingLayout, NextButton } from '../..//components/onboarding';
import { useOnboardingLesson } from '../../hook/onboarding/useLesson';

import '../../css/ui/ui-tokens.css';
import '../../css/ui/ui-card.css';
import '../../css/ui/ui-button.css';

import '../../css/multi-level-selector/mls-base.css';
import '../../css/multi-level-selector/mls-container.css';
import '../../css/multi-level-selector/mls-grid.css';
import '../../css/multi-level-selector/mls-button.css';
import '../../css/multi-level-selector/mls-lesson.css';

export default function OnboardingLesson() {
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
    window.location.href = '/onboarding/tutor/region';
  };

  return (
    <OnboardingLayout
      step={3}
      total={4}
      subtitle="대분류를 고른 뒤, 원하는 소분류를 여러 개 선택하세요."
      footer={<NextButton onClick={goNext} label="저장 / 다음 →" />}
    >
      {/* 칩: 레슨 페이지는 레드 칩으로 쓰고 싶으면 .mls-lesson로 변수 override */}
      <ChipList
        items={chipList}
        onRemove={removeChip}
        className="mls-lesson"
        emptyText={
          <span style={{ fontSize: 13, color: '#232426ff' }}>
            소분류를 선택하면 이곳에 표시돼요
          </span>
        }
      />

      {/* Body (mls 컨테이너: mls-body + 섹션 패딩) */}
      <div className="mls-body">
        {/* 대분류 */}
        <div style={{ padding: '16px 20px 8px' }}>
          <div style={{ fontSize: 14, fontWeight: 700, margin: '0 0 8px 2px' }}>대분류</div>
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
            <div style={{ opacity: 0.7, padding: '6px 2px' }}>대분류가 없습니다.</div>
          )}
        </div>

        {/* 소분류 */}
        <div style={{ padding: '0 20px 16px' }}>
          <div style={{ fontSize: 14, fontWeight: 700, margin: '8px 0 8px 2px' }}>소분류</div>
          {!mainCode ? (
            <div className="mls-sub" style={{ padding: '6px 2px' }}>
              먼저 대분류를 선택하세요.
            </div>
          ) : loadingSub ? (
            <div style={{ padding: '6px 2px' }}>소분류 불러오는 중…</div>
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
            <div style={{ opacity: 0.7, padding: '6px 2px' }}>소분류가 없습니다.</div>
          )}
        </div>
      </div>
    </OnboardingLayout>
  );
}
