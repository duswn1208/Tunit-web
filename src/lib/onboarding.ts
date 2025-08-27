import type {
  Region,
  Step1,
  Step2,
  Step3,
  SelectedRegion,
  RegionPayload,
  TutorOnboardingPayload,
  Category,
  SubCategory,
} from '../type/onboarding';
import { REGION_SIDO_ORDER } from '../type/onboarding';
import { load } from '../lib/utils';
import { api } from '../lib/api';

// 레슨 api 호출
const MAIN_CATEGORIES_URL = '/api/lessons/categories';
const SUB_CATEGORIES_URL = (mainCode: string) =>
  `/api/lessons/categories/${encodeURIComponent(mainCode)}/subcategories`;
// 지역 api 호출
const GET_SIDO = '/api/regions';
const GET_SUB_GUGUN = (sidoCode: string) =>
  `/api/regions/${encodeURIComponent(sidoCode)}/subregions`;

// const SAVE_TUTOR_INFO = '/api/onboarding/tutor';

export function loadStep1<T extends Step1 = Step1>() {
  return load<T>('onboarding.step1');
}
export function loadStep2<T extends Step2 = Step2>() {
  return load<T>('onboarding.step2.tutor');
}

export function loadStep3<T extends Step3 = Step3>() {
  return load<T>('onboarding.step3.tutor');
}

export async function saveTutorOnboardingNow(
  selectedRegions: SelectedRegion[],
  opts?: {
    endpoint?: string; // 기본: "/api/onboarding/tutor"
    signal?: AbortSignal; // 필요 시 취소
  }
): Promise<void> {
  // 1) 스텝 로드 (없으면 에러)
  const step2 = load<Step2>('onboarding.step2.tutor');
  const step3 = load<Step3>('onboarding.step3.tutor');
  if (!step2) throw new Error('step2 데이터가 없습니다. (onboarding.step2.tutor)');
  if (!step3) throw new Error('step3 데이터가 없습니다. (onboarding.step3.tutor)');

  // 2) 지역 변환
  const regions = toRegionPayload(selectedRegions);

  // 3) 페이로드 조립
  const payload: TutorOnboardingPayload = {
    profile: step2,
    lesson: step3,
    regions,
  };
  await api<void>(opts?.endpoint ?? '/api/tutor/join', {
    method: 'POST',
    credentials: 'include',
    signal: opts?.signal,
    body: JSON.stringify(payload),
  });

  // 5) 성공 시 로컬 정리(원하면 주석 해제)
  // localStorage.removeItem("onboarding.step2.tutor");
  // localStorage.removeItem("onboarding.step3.tutor");
}

export function getMainLessonCategory<T extends Category = Category>() {
  return api<T[]>(MAIN_CATEGORIES_URL);
}

export function getSubLessonCategory<T extends SubCategory = SubCategory>(mainCode: string) {
  return api<T[]>(SUB_CATEGORIES_URL(mainCode));
}

export function getSidos<T extends Region = Region>() {
  return api<T[]>(GET_SIDO);
}

export function getSubregions<T extends Region = Region>(sidoCode: string) {
  return api<T[]>(GET_SUB_GUGUN(sidoCode));
}

export function dedupeAndSortSidos(list: Region[]): Region[] {
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
    const cur = map.get(key);
    if (!cur || priority(r.label) > priority(cur.label)) {
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

export function toRegionPayload(selected: SelectedRegion[]): RegionPayload[] {
  // 시/도 기준으로 그룹핑
  const bySido = new Map<string, { all: boolean; guguns: Set<string> }>();

  for (const s of selected) {
    if (s.type === 'sido') {
      // 시/도 전체 선택 규칙: all=true, 구군은 비움(팀 합의에 따라 조정 가능)
      bySido.set(s.code, { all: true, guguns: new Set() });
      continue;
    }
    const sido = s.parentCode!;
    if (!bySido.has(sido)) bySido.set(sido, { all: false, guguns: new Set() });
    if (!bySido.get(sido)!.all) bySido.get(sido)!.guguns.add(s.code);
  }

  return Array.from(bySido.entries()).map(([sidoCode, { all, guguns }]) => ({
    sidoCode,
    gugunCodes: all ? [] : Array.from(guguns),
  }));
}
