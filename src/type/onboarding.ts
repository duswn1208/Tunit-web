export type Role = 'TUTOR' | 'STUDENT';
export type Category = { code: string; label: string };
export type SubCategory = { code: string; label: string; parentCode: string; parentLabel: string };
export type Region = { code: string; label: string };

export type SelectedRegion = {
  code: string;
  label: string; // 칩에 표시될 라벨(시도 포함): "서울특별시 종로구" / "서울특별시 전체"
  type: 'sido' | 'gugun';
  parentCode?: string;
  parentLabel?: string;
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
export type Step2 = {
  intro: string;
  years: Number;
  hourlyRage: Number;
  unitMinutes: Number;
};
export type Step3 = { mainCode: string; subCodes: Array<string> };
export type Step4 = {};
