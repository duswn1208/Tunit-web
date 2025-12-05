import type { DayOfWeek } from '@/shared/constants/date';

// 계약 상태 코드
export type ContractStatusCode =
  | 'REQUESTED'
  | 'APPROVED'
  | 'ACTIVE'
  | 'CANCELLED'
  | 'TERMINATED'
  | 'END';

// 계약 상태별 전환 가능한 상태 맵 (튜터용)
export const CONTRACT_STATUS_TRANSITIONS: Record<ContractStatusCode, ContractStatusCode[]> = {
  REQUESTED: ['APPROVED', 'ACTIVE', 'CANCELLED'],
  APPROVED: ['ACTIVE', 'TERMINATED', 'END', 'CANCELLED'],
  ACTIVE: ['TERMINATED', 'END'],
  CANCELLED: [],
  TERMINATED: ['ACTIVE', 'END'],
  END: [],
};

// 계약 상태별 전환 가능한 상태 맵 (학생용)
export const CONTRACT_STATUS_TRANSITIONS_STUDENT: Record<ContractStatusCode, ContractStatusCode[]> =
  {
    REQUESTED: ['CANCELLED'],
    APPROVED: ['CANCELLED'],
    ACTIVE: ['TERMINATED', 'END'],
    CANCELLED: [],
    TERMINATED: ['ACTIVE', 'END'],
    END: [],
  };
// 상태 코드에 따른 한글 라벨
export const getStatusLabel = (statusCode: ContractStatusCode): string => {
  const labels: Record<ContractStatusCode, string> = {
    REQUESTED: '요청',
    APPROVED: '승인 및  결제요청',
    ACTIVE: '진행중',
    CANCELLED: '취소',
    TERMINATED: '중단',
    END: '종료',
  };
  return labels[statusCode];
};
// 계약 상태
export type ContractStatus = {
  code: ContractStatusCode;
  label: string;
};

// 계약 타입 코드
export type ContractTypeCode = 'REGULAR' | 'FIRSTCOME' | 'TRIAL';

// 계약 타입
export type ContractType = {
  code: ContractTypeCode;
  label: string;
};

// 결제 상태 코드
export type PaymentStatusCode =
  | 'PENDING'
  | 'CONFIRMING'
  | 'PAID'
  | 'FAILED'
  | 'PARTIAL_REFUNDED'
  | 'REFUNDED';

// 결제 상태
export type PaymentStatus = {
  code: PaymentStatusCode;
  label: string;
};

// 계약 소스 코드
export type ContractSourceCode = 'STUDENT_REQUEST' | 'TUTOR_OFFER' | 'ADMIN_MATCH';

// 계약 소스
export type ContractSource = {
  code: ContractSourceCode;
  label: string;
};

// 계약 정보 (실제 서버 DTO)
export interface Contract {
  contractNo: number;
  tutorProfileNo: number;
  studentNo: number;
  studentName: string;
  startDt: string;
  endDt?: string;
  contractStatus: ContractStatus;
  createdAt: string;
  updatedAt: string;
  contractType: ContractType;
  lessonSubCategory: {
    label: string;
    code: string;
  };
  lessonCount: number;
  weekCount: number;
  lessonName: string;
  level: string;
  place: string;
  emergencyContact: string;
  dayOfWeekNum: DayOfWeek;
  startTime: string;
  endTime: string;
  memo?: string;
  source: ContractSource;
  totalPrice: number;
  paymentStatus: PaymentStatus;
  paidAmount: number;
  paymentDt?: string;
  fixedLessonNo?: number;
  currentLessonCount: number;
  reservable: boolean;
}
