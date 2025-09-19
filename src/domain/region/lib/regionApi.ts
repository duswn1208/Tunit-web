import { api } from '../../../lib/api';
import { REGION_SIDO_ORDER, type Region } from '../types/regions';

const GET_SIDO = '/api/regions';
const GET_SUB_GUGUN = (sidoCode: string) =>
  `/api/regions/${encodeURIComponent(sidoCode)}/subregions`;

export function getSidos<T extends Region = Region>() {
  return api<T[]>(GET_SIDO).then((list) => {
    // 시/도 목록을 REGION_SIDO_ORDER 순서로 정렬
    return dedupeAndSortSidos(list);
  });
}

export function getSubregions<T extends Region = Region>(sidoCode: string) {
  return api<T[]>(GET_SUB_GUGUN(sidoCode));
}

function dedupeAndSortSidos(list: Region[]) {
  // label 기준 중복 제거 및 우선순위 정렬
  const map = new Map<string, Region>();
  for (const r of list) {
    const key = r.label;
    if (!map.has(key)) map.set(key, r);
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
