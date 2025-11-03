// Contract Type 정의
export type ContractType = 'REGULAR' | 'FIRSTCOME' | 'TRIAL';

export const CONTRACT_TYPES = {
  REGULAR: 'REGULAR',
  FIRSTCOME: 'FIRSTCOME',
  TRIAL: 'TRIAL',
} as const;

// 타입 가드 함수들
export const isRegular = (type: ContractType): type is 'REGULAR' => type === 'REGULAR';
export const isFirstcome = (type: ContractType): type is 'FIRSTCOME' => type === 'FIRSTCOME';
export const isTrial = (type: ContractType): type is 'TRIAL' => type === 'TRIAL';

// string을 ContractType으로 변환
export function toContractType(type: string): ContractType {
  const upper = type.toUpperCase();
  if (['REGULAR', 'FIRSTCOME', 'TRIAL'].includes(upper)) {
    return upper as ContractType;
  }
  return 'REGULAR'; // 기본값
}

// ContractType 라벨 변환
export function getContractTypeLabel(type: ContractType): string {
  switch (type) {
    case 'REGULAR':
      return '정기 레슨';
    case 'FIRSTCOME':
      return '선착순 신청';
    case 'TRIAL':
      return '체험 레슨';
    default:
      return '';
  }
}

export function getContractTypeLessonCount(type: ContractType, weekCount: number): number {
  switch (type) {
    case 'REGULAR':
      return weekCount * 4; // 한 달 기준
    case 'FIRSTCOME':
    case 'TRIAL':
      return 1;
    default:
      return 0;
  }
}
