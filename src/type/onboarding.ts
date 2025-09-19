import type { SelectedRegion } from '../domain/region/types/regions';

export type Role = 'TUTOR' | 'STUDENT';
export type Category = { code: string; label: string };
export type SubCategory = { code: string; label: string; parentCode: string; parentLabel: string };

export type UseOnboardingRegionOptions = {
  initialSelected?: SelectedRegion[]; // ★ 훅 인자로 받기
  defaultSidoCode?: string; // ★ 기본 선택할 시/도 코드(선택)
};

export type Step1 = {
  role: Role;
  nickname: string;
};
export type Step2 = {
  introduce: string;
  careerYears: Number;
  pricePerHour: Number;
  durationMin: 30 | 60 | 90;
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
