import { Check } from 'lucide-react';

import { OnboardingLayout } from '../../components/onboarding';
import { ChipList } from '../../components/ui';

import { useOnboardingRegion } from '../../hook/onboarding/useRegion';

import '../../css/multi-level-selector/mls-base.css';
import '../../css/multi-level-selector/mls-container.css';
import '../../css/multi-level-selector/mls-list.css';
import '../../css/multi-level-selector/mls-button.css';
import '../../css/multi-level-selector/mls-region.css';

export default function OnboardingRegion() {
  const {
    sidos,
    activeSido,
    setActiveSido,
    subregions,
    selectedList,
    removeChip,
    toggleGugun,
    stripParentPrefix,
    toggleSidoWhole,
    isSidoSelected,
    isGugunSelected,
  } = useOnboardingRegion();

  const handleSubmit = () => {};

  return (
    <OnboardingLayout
      step={4}
      total={4}
      subtitle="시/도를 선택한 뒤, 구/군을 여러 개 선택하세요. (중복 선택 가능)"
      bodyClassName="mls-body"
    >
      <div className="mls-card">
        <div className="mls-header">
          <h2 className="text-xl" style={{ fontWeight: 700 }}>
            편한 지역이 어디예요?
          </h2>
          <div className="mls-sub">(중복선택 가능)</div>
        </div>

        {/* Chips */}
        <ChipList
          items={selectedList} // 예: { code, label }[] 가 아니어도 됨
          getCode={(it) => it.code} // ★ 필요 시 형식 맞게 수정: it.gugunCode 등
          getLabel={(it) => it.label} // ★ 필요 시: stripParentPrefix(...) 적용 가능
          onRemove={(code) => removeChip(code)}
        />

        {/* Body: 2-컬럼 */}
        <div className="mls-body">
          <div className="mls-two-col">
            <div className="mls-left">
              <ul className="mls-list" role="listbox" aria-label="시/도">
                {sidos.map((s) => (
                  <li
                    key={s.code}
                    className={`mls-item ${activeSido?.code === s.code ? 'active' : ''}`}
                    onClick={() => setActiveSido(s)}
                    role="option"
                  >
                    {s.label}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mls-right">
              <ul className="mls-list" role="listbox" aria-label="구/군">
                {activeSido && (
                  <li
                    key="__all__"
                    className={`mls-item ${isSidoSelected(activeSido.code) ? 'selected' : ''}`}
                    onClick={() => toggleSidoWhole(activeSido)}
                    role="option"
                  >
                    <span>{activeSido.label} 전체</span>
                  </li>
                )}
                {subregions.map((g) => {
                  const selected = isGugunSelected(g.code);
                  return (
                    <li
                      key={g.code}
                      className={`mls-item ${selected ? 'selected' : ''}`}
                      onClick={() => toggleGugun(g)}
                      role="option"
                    >
                      <span>{stripParentPrefix(activeSido!.label, g.label)}</span>
                      {selected && <Check size={16} />}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

        <div className="mls-footer">
          <button
            className="mls-button"
            disabled={selectedList.length === 0}
            onClick={handleSubmit}
          >
            다음
          </button>
        </div>
      </div>
    </OnboardingLayout>
  );
}
