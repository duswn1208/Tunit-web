import Header from '../../../../components/Header';
import RegionChipList from './RegionChipList';
import SidoList from './SidoList';
import GugunList from './GugunList';
import type { useOnboardingRegion } from '../hooks/useRegion';

type OnboardingRegionFormProps = {
  regionForm: ReturnType<typeof useOnboardingRegion>;
};

export default function OnboardingRegionForm({ regionForm }: OnboardingRegionFormProps) {
  const {
    sidos,
    activeSido,
    setSelectedSido,
    subregions,
    selectedList,
    removeChip,
    toggleGugun,
    stripParentPrefix,
    toggleSidoWhole,
    isSidoSelected,
    isGugunSelected,
  } = regionForm;

  return (
    <>
      <Header title="편한 지역이 어디예요?" subtitle="(중복선택 가능)" />
      <RegionChipList
        items={selectedList}
        getCode={(it) => it.code}
        getLabel={(it) => it.label}
        onRemove={removeChip}
      />
      <div className="mls-body">
        <div className="mls-two-col">
          <div className="mls-left">
            <SidoList sidos={sidos} activeSido={activeSido} setSelectedSido={setSelectedSido} />
          </div>
          <div className="mls-right">
            <GugunList
              activeSido={activeSido}
              subregions={subregions}
              isSidoSelected={isSidoSelected}
              toggleSidoWhole={toggleSidoWhole}
              isGugunSelected={isGugunSelected}
              toggleGugun={toggleGugun}
              stripParentPrefix={stripParentPrefix}
            />
          </div>
        </div>
      </div>
    </>
  );
}
