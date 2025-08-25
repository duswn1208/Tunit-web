import React, { useEffect, useMemo, useRef, useState } from 'react';
import { X, Check } from 'lucide-react';
import '../css/multi-level-selector/mls-base.css';
import '../css/multi-level-selector/mls-container.css';
import '../css/multi-level-selector/mls-list.css';
import '../css/multi-level-selector/mls-button.css';
import '../css/multi-level-selector/mls-region.css';

type Region = { code: string; label: string };

type SelectedRegion = {
  code: string;
  label: string; // 칩에 표시될 라벨(시도 포함): "서울특별시 종로구" / "서울특별시 전체"
  type: 'sido' | 'gugun';
  parentCode?: string;
  parentLabel?: string;
};

interface Props {
  onSubmit: (selected: SelectedRegion[]) => void;
  initialSelected?: SelectedRegion[];
  apiBase?: string;
  className?: string;
}

/** 시도 정렬 우선순위 */
const SIDO_ORDER = [
  '서울특별시',
  '경기도',
  '인천광역시',
  '부산광역시',
  '대구광역시',
  '광주광역시',
  '대전광역시',
  '울산광역시',
  '세종특별자치시',
  '강원특별자치도',
  '충청북도',
  '충청남도',
  '전북특별자치도',
  '전라남도',
  '경상북도',
  '경상남도',
  '제주특별자치도',
];

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
    const ai = SIDO_ORDER.indexOf(a.label);
    const bi = SIDO_ORDER.indexOf(b.label);
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

const api = (base?: string) => {
  const prefix = base ?? '';
  return {
    async getSidos(signal?: AbortSignal): Promise<Region[]> {
      const res = await fetch(`${prefix}/api/regions`, { signal });
      if (!res.ok) throw new Error('시/도 목록을 가져오지 못했습니다.');
      const raw = (await res.json()) as Region[];
      return dedupeAndSortSidos(raw);
    },
    async getSubregions(sidoCode: string, signal?: AbortSignal): Promise<Region[]> {
      const res = await fetch(`${prefix}/api/regions/${encodeURIComponent(sidoCode)}/subregions`, {
        signal,
      });
      if (!res.ok) throw new Error('구/군 목록을 가져오지 못했습니다.');
      return res.json();
    },
  };
};

export default function ONboardingRegion({ onSubmit, initialSelected, apiBase, className }: Props) {
  const client = useMemo(() => api(apiBase), [apiBase]);

  const [sidos, setSidos] = useState<Region[]>([]);
  const [activeSido, setActiveSido] = useState<Region | null>(null);
  const [subregions, setSubregions] = useState<Region[]>([]);
  const [loadingLeft, setLoadingLeft] = useState(true);
  const [loadingRight, setLoadingRight] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedMap, setSelectedMap] = useState<Map<string, SelectedRegion>>(() => {
    const m = new Map<string, SelectedRegion>();
    (initialSelected ?? []).forEach((s) => m.set(s.code, s));
    return m;
  });
  const selectedList = Array.from(selectedMap.values());

  const subCache = useRef<Map<string, Region[]>>(new Map());

  useEffect(() => {
    const ac = new AbortController();
    setLoadingLeft(true);
    setError(null);
    client
      .getSidos(ac.signal)
      .then((list) => {
        setSidos(list);
        if (!activeSido && list.length) setActiveSido(list[0]);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoadingLeft(false));
    return () => ac.abort();
  }, [client]);

  useEffect(() => {
    if (!activeSido) return;
    const ac = new AbortController();
    setError(null);
    const cached = subCache.current.get(activeSido.code);
    if (cached) {
      setSubregions(cached);
      return;
    }
    setLoadingRight(true);
    client
      .getSubregions(activeSido.code, ac.signal)
      .then((list) => {
        subCache.current.set(activeSido.code, list);
        setSubregions(list);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoadingRight(false));
    return () => ac.abort();
  }, [client, activeSido]);

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

  const handleSubmit = () => onSubmit(selectedList);

  return (
    <div className="mls-card">
      <div className="mls-header">
        <h2 className="text-xl" style={{ fontWeight: 700 }}>
          편한 지역이 어디예요?
        </h2>
        <div className="mls-sub">(중복선택 가능)</div>
      </div>

      {/* Chips */}
      <div className="mls-chips">
        {selectedList.length === 0 ? (
          <span className="mls-region-empty" style={{ fontSize: 13 }}>
            오른쪽에서 구/군을 선택하면 이곳에 표시돼요
          </span>
        ) : (
          selectedList.map((s) => (
            <span key={s.code} className="mls-chip">
              {s.label}
              <button aria-label="remove" onClick={() => removeChip(s.code)}>
                <X size={14} />
              </button>
            </span>
          ))
        )}
      </div>

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
        <button className="mls-button" disabled={selectedList.length === 0} onClick={handleSubmit}>
          다음
        </button>
      </div>
    </div>
  );
}
