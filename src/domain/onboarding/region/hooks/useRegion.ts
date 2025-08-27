import { useEffect, useMemo, useRef, useState } from 'react';
import type { Region, SelectedRegion } from '../../../../type/onboarding';
import { getSidos, getSubregions, dedupeAndSortSidos } from '../../../../lib/onboarding';

type UseOnboardingRegionOptions = {
  initialSelected?: SelectedRegion[];
  defaultSidoCode?: string;
};

export function useOnboardingRegion(opts: UseOnboardingRegionOptions = {}) {
  const { initialSelected, defaultSidoCode } = opts;

  const [sidos, setSidos] = useState<Region[]>([]);
  const [selectedSido, setSelectedSido] = useState<Region | null>(null);
  const [subregions, setSubregions] = useState<Region[]>([]);

  const [loadingSido, setLoadingSido] = useState<boolean>(true);
  const [loadingSub, setLoadingSub] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 이미 선택했던 시/도에 대한 구/군 캐시: sidoCode -> Region[]
  const subCache = useRef<Map<string, Region[]>>(new Map());

  // 선택된 항목들을 map으로 (중복 방지와 토글에 유리)
  const [selectedMap, setSelectedMap] = useState<Map<string, SelectedRegion>>(() => {
    const m = new Map<string, SelectedRegion>();
    (initialSelected ?? []).forEach((s) => m.set(s.code, s));
    return m;
  });

  // initialSelected가 “마운트 후” 변경될 수 있다면 동기화
  useEffect(() => {
    if (!initialSelected) return;
    setSelectedMap(() => {
      const m = new Map<string, SelectedRegion>();
      initialSelected.forEach((s) => m.set(s.code, s));
      return m;
    });
  }, [initialSelected]);

  // 칩/전송용 파생값
  const selectedList = useMemo(() => Array.from(selectedMap.values()), [selectedMap]);

  // Sido 목록 로딩 (마운트 1회)
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoadingSido(true);
        setError(null);
        const list = await getSidos();
        if (!alive) return;

        const cooked = dedupeAndSortSidos(list);
        setSidos(cooked);

        // 기본 선택
        if (!selectedSido && cooked.length) {
          const pre = defaultSidoCode
            ? cooked.find((s) => s.code === defaultSidoCode) ?? cooked[0]
            : cooked[0];
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultSidoCode]); // getSidos는 안정적이라 가정. 필요시 useCallback으로 감싸고 의존성 추가

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
      // 해당 시/도의 구/군이 이미 선택되어 있으면 제거
      for (const [k, v] of next) {
        if (v.type === 'gugun' && v.parentCode === sido.code) next.delete(k);
      }
      next.set(sido.code, {
        code: sido.code,
        label: `${sido.label} 전체`,
        type: 'sido',
        parentCode: sido.code, // (선택) 백엔드 페이로드에서 일관성 원하면 채워두기
        parentLabel: sido.label, // (선택)
      });
      return next;
    });
  };

  // 시도 접두사가 붙은 하위 표기 제거
  const stripParentPrefix = (parent: string, child: string) => {
    const withSpace = parent + ' ';
    return child.startsWith(withSpace) ? child.slice(withSpace.length) : child;
  };

  // 구/군 토글(칩 라벨: "서울특별시 종로구")
  const toggleGugun = (g: Region) => {
    if (!selectedSido) return;
    setSelectedMap((prev) => {
      const next = new Map(prev);
      if (isSidoSelected(selectedSido.code)) next.delete(selectedSido.code);
      if (isGugunSelected(g.code)) {
        next.delete(g.code);
      } else {
        next.set(g.code, {
          code: g.code,
          label: `${selectedSido.label} ${stripParentPrefix(selectedSido.label, g.label)}`,
          type: 'gugun',
          parentCode: selectedSido.code,
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
    // data
    sidos,
    subregions,
    activeSido: selectedSido,
    selectedMap,
    selectedList,

    // ui states
    loadingSido,
    loadingSub,
    error,

    // actions
    setSelectedSido: setSelectedSido,
    toggleSidoWhole,
    toggleGugun,
    removeChip,

    // utils
    stripParentPrefix,
    isSidoSelected,
    isGugunSelected,

    // cache (필요하면 노출)
    subCache,
  };
}
