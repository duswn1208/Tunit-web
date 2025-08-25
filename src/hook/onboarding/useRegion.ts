import { useEffect, useRef, useState, useMemo } from 'react';
import { REGION_SIDO_ORDER } from '../../type/onboarding';
import type { Region, SelectedRegion } from '../../type/onboarding';
import { getSidos, getSubregions } from '../../lib/onboarding';

export function useOnboardingRegion() {
  const [sidos, setSidos] = useState<Region[]>([]);
  const [activeSido, setActiveSido] = useState<Region | null>(null);
  const [subregions, setSubregions] = useState<Region[]>([]);

  const [selectedMap, setSelectedMap] = useState<Map<string, SelectedRegion>>(() => {
    const m = new Map<string, SelectedRegion>();
    (initialSelected ?? []).forEach((s) => m.set(s.code, s));
    return m;
  });

  const selectedList = Array.from(selectedMap.values());
  const subCache = useRef<Map<string, Region[]>>(new Map());

  useEffect(() => {
    const list = getSidos<Region[]>();
    setSidos(dedupeAndSortSidos(list));
    if (!activeSido && list.length) setActiveSido(list[0]);
  });

  useEffect(() => {
    if (!activeSido) return;
    const cached = subCache.current.get(activeSido.code);
    if (cached) {
      setSubregions(cached);
      return;
    }
    const subRegionList = getSubregions<Region[]>(activeSido.code);
    subCache.current.set(activeSido.code, subRegionList);
    setSubregions(subRegionList);
  }, [activeSido]);

  const isSidoSelected = (code: string) => selectedMap.get(code)?.type === 'sido';
  const isGugunSelected = (code: string) => selectedMap.get(code)?.type === 'gugun';

  // 시/도 전체 토글(칩 라벨: "서울특별시 전체")
  const toggleSidoWhole = (sido: Region) => {
    setSelectedMap((prev) => {
      const next = new Map(prev);
      if (isSidoSelected(sido.code)) {
        next.delete(sido.code);
        return next;
      }
      for (const [k, v] of next) {
        if (v.type === 'gugun' && v.parentCode === sido.code) next.delete(k);
      }
      next.set(sido.code, {
        code: sido.code,
        label: `${sido.label} 전체`,
        type: 'sido',
      });
      return next;
    });
  };

  /** 직할시/도 구표기 → 최신 표기 매핑 & 우선순위 정리 */
  function dedupeAndSortSidos(list: Region[]): Region[] {
    const normalize = (label: string) =>
      label
        .replace(/직할시$/, '광역시')
        .replace(/^강원도$/, '강원특별자치도')
        .replace(/^제주도$/, '제주특별자치도')
        .replace(/^전라북도$/, '전북특별자치도');

    const priority = (label: string) => (/특별자치/.test(label) ? 3 : /광역시/.test(label) ? 2 : 1);

    const map = new Map<string, Region>();
    for (const r of list) {
      const key = normalize(r.label);
      const current = map.get(key);
      // 최신 명칭 쪽을 남김
      if (!current || priority(r.label) > priority(current.label)) {
        map.set(key, { code: r.code, label: key });
      }
    }

    const arr = Array.from(map.values());
    arr.sort((a, b) => {
      const ai = REGION_SIDO_ORDER.indexOf(a.label);
      const bi = REGION_SIDO_ORDER.indexOf(b.label);
      if (ai !== -1 && bi !== -1) return ai - bi;
      if (ai !== -1) return -1;
      if (bi !== -1) return 1;
      return a.label.localeCompare(b.label, 'ko');
    });
    return arr;
  }

  /** 시도 접두사가 앞에 붙어온 경우 제거 */
  function stripParentPrefix(parent: string, child: string) {
    const withSpace = parent + ' ';
    if (child.startsWith(withSpace)) return child.slice(withSpace.length);
    return child;
  }

  // 구/군 토글(칩 라벨: "서울특별시 종로구")
  const toggleGugun = (g: Region) => {
    if (!activeSido) return;
    setSelectedMap((prev) => {
      const next = new Map(prev);
      if (isSidoSelected(activeSido.code)) next.delete(activeSido.code);
      if (isGugunSelected(g.code)) next.delete(g.code);
      else
        next.set(g.code, {
          code: g.code,
          label: `${activeSido.label} ${stripParentPrefix(activeSido.label, g.label)}`,
          type: 'gugun',
          parentCode: activeSido.code,
          parentLabel: activeSido.label,
        });
      return next;
    });
  };

  const removeChip = (code: string) =>
    setSelectedMap((prev) => {
      const n = new Map(prev);
      n.delete(code);
      return n;
    });

  return {
    sidos,
    activeSido,
    setActiveSido,
    subregions,
    selectedMap,
    selectedList,
    subCache,
    removeChip,
    toggleGugun,
    stripParentPrefix,
    toggleSidoWhole,
    isSidoSelected,
    isGugunSelected,
  };
}
