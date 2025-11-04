import type { DayOfWeek } from '@/shared/constants/date';

// 계약 상태
export type ContractStatus = {
  code: 'REQUESTED' | 'APPROVED' | 'ACTIVE' | 'TERMINATED' | 'END';
  label: string;
};

// 계약 타입
export type ContractType = {
  code: 'REGULAR' | 'FIRSTCOME' | 'TRIAL';
  label: string;
};

// 결제 상태
export type PaymentStatus = {
  code: 'PENDING' | 'PAID' | 'PARTIAL' | 'REFUNDED';
  label: string;
};

// 계약 소스
export type ContractSource = {
  code: 'STUDENT_REQUEST' | 'TUTOR_OFFER' | 'ADMIN_MATCH';
  label: string;
};

// 계약 정보 (실제 서버 DTO)
export interface Contract {
  contractNo: number;
  tutorProfileNo: number;
  studentNo: number;
  startDt: string;
  endDt?: string;
  contractStatus: ContractStatus;
  createdAt: string;
  updatedAt: string;
  contractType: ContractType;
  lessonSubCategory: {
    lessonSubCategoryNo: number;
    lessonCategory: {
      label: string;
      code: string;
    };
  };
  lessonCount: number;
  weekCount: number;
  lessonName: string;
  level: string;
  place: string;
  emergencyContact: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  memo?: string;
  source: ContractSource;
  totalPrice: number;
  paymentStatus: PaymentStatus;
  paidAmount: number;
  paymentDt?: string;
  canceledAt?: string;
  cancelReason?: string;
  refundAmount: number;
  fixedLessonNo?: number;
}
