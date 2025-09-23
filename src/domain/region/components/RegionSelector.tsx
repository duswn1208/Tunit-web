import React from 'react';
import TwoColumnSelector from '../../../components/TwoColumnSelector';

export interface RegionSelectorProps {
  sidos: Array<{ code: string; label: string }>;
  activeSido: { code: string; label: string } | null;
  setSelectedSido: (sido: { code: string; label: string }) => void;
  subregions: Array<{ code: string; label: string }>;
  isSidoSelected: (code: string) => boolean;
  toggleSidoWhole: (sido: { code: string; label: string }) => void;
  isGugunSelected: (code: string) => boolean;
  toggleGugun: (gugun: { code: string; label: string }) => void;
  loadingSido?: boolean;
  loadingSub?: boolean;
  error?: string | null;
  onClose?: () => void;
  onConfirm?: () => void;
}

export default function RegionSelector(props: RegionSelectorProps) {
  const {
    sidos,
    activeSido,
    setSelectedSido,
    subregions,
    isSidoSelected,
    toggleSidoWhole,
    isGugunSelected,
    toggleGugun,
    loadingSido,
    loadingSub,
    error,
    onClose,
    onConfirm,
  } = props;

  // 시/도명 접두사 제거 함수
  function stripParentPrefix(parent: string, child: string) {
    const withSpace = parent + ' ';
    return child.startsWith(withSpace) ? child.slice(withSpace.length) : child;
  }

  // 항상 '시도 전체' 항목을 구군 리스트 맨 위에 추가, 구군 label에서 시도명 제거
  const rightOptionsMap = React.useMemo(() => {
    const map: Record<string, { code: string; label: string }[]> = {};
    sidos.forEach((sido) => {
      let list = sido.code === activeSido?.code ? subregions : [];
      if (sido.code === activeSido?.code) {
        list = [
          { code: `${sido.code}`, label: `${sido.label} 전체` },
          ...subregions.map((g) => ({
            code: g.code,
            label: stripParentPrefix(sido.label, g.label),
          })),
        ];
      }
      map[sido.code] = list;
    });
    return map;
  }, [sidos, activeSido, subregions]);

  // 선택된 항목: 전체만 선택 or 구군만 선택
  const selectedRight = React.useMemo(() => {
    if (!activeSido) return [];
    if (isSidoSelected(String(activeSido.code))) {
      return [String(activeSido.code)];
    }
    return subregions.filter((g) => isGugunSelected(String(g.code))).map((g) => String(g.code));
  }, [activeSido, isSidoSelected, subregions, isGugunSelected]);

  // 토글: 전체 클릭 시 구군 선택 해제, 구군 클릭 시 전체 해제
  const handleToggleRight = (code: string, label: string) => {
    if (!activeSido) return;
    if (code === `${activeSido.code}`) {
      if (isSidoSelected(activeSido.code)) {
        toggleSidoWhole(activeSido);
      } else {
        if (subregions.some((g) => isGugunSelected(g.code))) {
          subregions.forEach((g) => {
            if (isGugunSelected(g.code)) toggleGugun(g);
          });
        }
        if (!isSidoSelected(activeSido.code)) {
          toggleSidoWhole(activeSido);
        }
      }
    } else {
      if (isSidoSelected(activeSido.code)) {
        toggleSidoWhole(activeSido);
      }
      const gugun = { code, label };
      toggleGugun(gugun);
    }
  };

  return (
    <TwoColumnSelector
      leftOptions={sidos}
      rightOptionsMap={rightOptionsMap}
      leftTitle="시/도"
      rightTitle="구/군"
      selectedLeft={activeSido ? activeSido.code : null}
      setSelectedLeft={(code) => {
        const sido = sidos.find((s) => s.code === code);
        if (sido) setSelectedSido(sido);
      }}
      selectedRight={selectedRight}
      toggleRight={handleToggleRight}
      loading={loadingSido || loadingSub}
      error={error}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
}
