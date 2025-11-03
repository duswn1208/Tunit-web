import type { ContractType } from '@/domain/booking/types/types';

// 계약 상태
export type ContractStatus = 'ACTIVE' | 'ENDED' | 'CANCELED';

// 계약 정보
export interface Contract {
  contractNo: number;
  tutorProfileNo: number;
  tutorName: string;
  tutorPhoto?: string;
  lessonCategory: string;
  contractType: ContractType;
  status: ContractStatus;
  startDate: string;
  endDate?: string;
  totalLessons: number;
  completedLessons: number;
  pricePerLesson: number;
  totalPrice: number;
}

// 계약 목록 응답
export interface ContractListResponse {
  activeContracts: Contract[];
  endedContracts: Contract[];
}
