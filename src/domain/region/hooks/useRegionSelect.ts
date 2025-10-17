import { useEffect, useMemo, useRef, useState } from 'react';
import type { Region, SelectedRegion } from '../types/regions';
import { getSidos, getSubregions } from '../lib/regionApi';

export interface UseRegionSelectOptions {
  initialSelected?: SelectedRegion[];
  defaultSidoCode?: string;
}

export function useRegionSelect(opts: UseRegionSelectOptions = {}) {
  const { initialSelected, defaultSidoCode } = opts;

  const [sidos, setSidos] = useState<Region[]>([]);
  const [selectedSido, setSelectedSido] = useState<Region | null>(null);
  const [subregions, setSubregions] = useState<Region[]>([]);

  const [loadingSido, setLoadingSido] = useState<boolean>(true);
  const [loadingSub, setLoadingSub] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 구/군 캐시: sidoCode -> Region[]
  const subCache = useRef<Map<string, Region[]>>(new Map());

  // 선택된 항목 map
  const [selectedMap, setSelectedMap] = useState<Map<string, SelectedRegion>>(() => {
    const m = new Map<string, SelectedRegion>();
    (initialSelected ?? []).forEach((s) => m.set(String(s.code), s));
    return m;
  });
  const selectedList = useMemo(() => Array.from(selectedMap.values()), [selectedMap]);

  // Sido 목록 로딩
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoadingSido(true);
        setError(null);
        const list = await getSidos();
        if (!alive) return;
        setSidos(list);

        if (!selectedSido && list.length) {
          const pre = defaultSidoCode
            ? list.find((s) => s.code === defaultSidoCode) ?? list[0]
            : list[0];
          setSelectedSido(pre);
        }
      } catch (e: any) {
        if (alive) setError(e?.message ?? '시/도 목록을 불러오지 못했습니다.');
      } finally {
        if (alive) setLoadingSido(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [defaultSidoCode]);

  // 시/도 목록과 initialSelected가 모두 준비된 후, selectedSido를 자동 세팅
  useEffect(() => {
    if (!sidos.length || !initialSelected?.length) return;
    const first = initialSelected.find((s) => s.type === 'sido') || initialSelected[0];
    const sidoCode = first.type === 'sido' ? first.code : first.parentCode;
    const match = sidos.find((s) => String(s.code) === String(sidoCode));
    if (match) setSelectedSido(match);
  }, [sidos, initialSelected]);

  // activeSido 변경 시 subregions 로딩
  useEffect(() => {
    if (!selectedSido) {
      setSubregions([]);
      return;
    }
    const cacheHit = subCache.current.get(selectedSido.code);
    if (cacheHit) {
      setSubregions(cacheHit);
      return;
    }
    let alive = true;
    const controller = new AbortController();
    (async () => {
      try {
        setLoadingSub(true);
        setError(null);
        const list = await getSubregions(selectedSido.code);
        if (!alive) return;
        subCache.current.set(selectedSido.code, list);
        setSubregions(list);
      } catch (e: any) {
        if (alive) setError(e?.message ?? '구/군 목록을 불러오지 못했습니다.');
      } finally {
        if (alive) setLoadingSub(false);
      }
    })();
    return () => {
      alive = false;
      controller.abort();
    };
  }, [selectedSido]);

  // 선택 상태 조회
  const isSidoSelected = (code: string | number) => {
    const result = selectedMap.get(String(code))?.type === 'sido';
    return result;
  };
  const isGugunSelected = (code: string | number) => {
    const result = selectedMap.get(String(code))?.type === 'gugun';
    return result;
  };

  // 시/도 전체 토글
  const toggleSidoWhole = (sido: Region) => {
    setSelectedMap((prev) => {
      const next = new Map(prev);
      if (isSidoSelected(sido.code)) {
        next.delete(String(sido.code));
        return next;
      }
      for (const [k, v] of next) {
        if (v.type === 'gugun' && v.parentCode === String(sido.code)) next.delete(k);
      }
      next.set(String(sido.code), {
        code: String(sido.code),
        label: `${sido.label} 전체`,
        type: 'sido',
        parentCode: String(sido.code),
        parentLabel: sido.label,
      });
      return next;
    });
  };

  // 시도 접두사 제거
  const stripParentPrefix = (parent: string, child: string) => {
    const withSpace = parent + ' ';
    return child.startsWith(withSpace) ? child.slice(withSpace.length) : child;
  };

  // 구/군 토글
  const toggleGugun = (g: Region) => {
    if (!selectedSido) return;
    // Region 타입 검증
    if (!g.label && !g.code) {
      return;
    }
    setSelectedMap((prev) => {
      const next = new Map(prev);
      if (isSidoSelected(selectedSido.code)) next.delete(String(selectedSido.code));
      if (isGugunSelected(g.code)) {
        next.delete(String(g.code));
      } else {
        next.set(String(g.code), {
          code: String(g.code),
          label: stripParentPrefix(selectedSido.label, g.label),
          type: 'gugun',
          parentCode: String(selectedSido.code),
          parentLabel: selectedSido.label,
        });
      }
      return next;
    });
  };

  const removeChip = (code: string) => {
    setSelectedMap((prev) => {
      const n = new Map(prev);
      n.delete(code);
      return n;
    });
  };

  return {
    sidos,
    subregions,
    activeSido: selectedSido,
    selectedMap,
    selectedList,
    loadingSido,
    loadingSub,
    error,
    setSelectedSido,
    toggleSidoWhole,
    toggleGugun,
    removeChip,
    stripParentPrefix,
    isSidoSelected,
    isGugunSelected,
    subCache,
  };
}
