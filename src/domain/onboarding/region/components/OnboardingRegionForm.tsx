import Header from '../../../../components/Header';
import RegionChipList from '../../../region/components/RegionChipList';
import RegionSelector from '../../../region/components/RegionSelector';
import type useOnboardingRegion from '../hooks/useRegion';

type OnboardingRegionFormProps = {
  regionForm: ReturnType<typeof useOnboardingRegion>;
};

export default function OnboardingRegionForm({ regionForm }: OnboardingRegionFormProps) {
  const {
    selectedList,
    removeChip,
    sidos,
    activeSido,
    setSelectedSido,
    subregions,
    isSidoSelected,
    toggleSidoWhole,
    isGugunSelected,
    toggleGugun,
    stripParentPrefix,
  } = regionForm;

  return (
    <div>
      <Header title="편한 지역이 어디예요?" subtitle="(중복선택 가능)" />
      <RegionChipList
        items={selectedList}
        getCode={(it) => it.code}
        getLabel={(it) => it.label}
        onRemove={removeChip}
      />
      <RegionSelector
        sidos={sidos}
        activeSido={activeSido}
        setSelectedSido={setSelectedSido}
        subregions={subregions}
        isSidoSelected={isSidoSelected}
        toggleSidoWhole={toggleSidoWhole}
        isGugunSelected={isGugunSelected}
        toggleGugun={toggleGugun}
        stripParentPrefix={stripParentPrefix}
      />
    </div>
  );
}
