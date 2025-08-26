export type Role = 'TUTOR' | 'STUDENT';
export type Category = { code: string; label: string };
export type SubCategory = { code: string; label: string; parentCode: string; parentLabel: string };
export type Region = { code: string; label: string };

export type SelectedRegion = Region & {
  type: 'sido' | 'gugun';
  parentCode?: string;
  parentLabel?: string;
};

export type UseOnboardingRegionOptions = {
  initialSelected?: SelectedRegion[]; // ★ 훅 인자로 받기
  defaultSidoCode?: string; // ★ 기본 선택할 시/도 코드(선택)
};

export const REGION_SIDO_ORDER = [
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

export type Step1 = {
  role: Role;
  nickname: string;
};
export type Step2 = Step1 & {
  intro: string;
  years: Number;
  hourlyRate: Number;
  unitMinutes: 30 | 60 | 90;
};
export type Step3 = { mainCode: string; subCodes: Array<string> };

export type RegionPayload = {
  sidoCode: string;
  gugunCodes: string[]; // 시/도 전체 선택이면 팀 규칙에 따라 [] 혹은 전체 나열
};

export type TutorOnboardingPayload = {
  profile: Step2;
  lesson: Step3;
  regions: RegionPayload[];
};
