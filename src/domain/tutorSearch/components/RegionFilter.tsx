import React from 'react';
import RegionSelector from '../../region/components/RegionSelector';
import { useRegionSelect } from '../../region/hooks/useRegionSelect';

export interface RegionFilterProps {
  initialRegion?: any[];
}

export default function RegionFilter({ initialRegion = [] }: RegionFilterProps) {
  const [sheetOpen, setSheetOpen] = React.useState(false);

  const region = useRegionSelect({ initialSelected: initialRegion });

  const regionLabel =
    region.selectedList.length === 0
      ? '전체 지역'
      : region.selectedList.length === 1
      ? region.selectedList[0].label
      : `${region.selectedList[0].label} 외 ${region.selectedList.length - 1}개`;

  return (
    <div>
      <button
        className={'filter-chip' + (region.selectedList.length ? ' selected' : '')}
        onClick={() => setSheetOpen(true)}
      >
        {regionLabel} ▾
      </button>
      {sheetOpen && (
        <div className="bottom-sheet" onClick={() => setSheetOpen(false)}>
          <div className="bottom-sheet-content" onClick={(e) => e.stopPropagation()}>
            <RegionSelector
              sidos={region.sidos}
              activeSido={region.activeSido}
              setSelectedSido={region.setSelectedSido}
              subregions={region.subregions}
              isSidoSelected={region.isSidoSelected}
              toggleSidoWhole={region.toggleSidoWhole}
              isGugunSelected={region.isGugunSelected}
              toggleGugun={region.toggleGugun}
              loadingSido={region.loadingSido}
              loadingSub={region.loadingSub}
              error={region.error}
              onConfirm={() => setSheetOpen(false)}
              key={sheetOpen ? region.selectedList.map((r) => r.code).join(',') : ''}
            />
          </div>
        </div>
      )}
    </div>
  );
}
