// 레슨 예약 요청 API
import { api } from '@/shared/lib/api';
import type { ContractType } from '../types/types';

export interface ContractRequestDto {
  tutorProfileNo: string;
  contractType: ContractType;
  lessonCategory: string;
  place?: string;
  weekCount: number;
  lessonCount: number;
  lessonDtList: string[];
  level?: string;
  memo?: string;
  emergencyContact?: string;
  totalPrice: number;
  
  // 체험 레슨용 추가
  trialCandidates?: Array<{
    priority: number;
    candidateDate: string;
    candidateStartTime: string;
  }>;
}

export async function requestContract(data: ContractRequestDto) {
  return await api.post('/api/contracts', data);
}

export async function updateContract(
  contractNo: number,
  data: Omit<ContractRequestDto, 'tutorProfileNo' | 'contractType' | 'lessonCount'>
) {
  return await api.put(`/api/contracts/${contractNo}`, data);
}

// 단일 레슨 예약 (FIRSTCOME 계약용)
export interface LessonBookingDto {
  contractNo: number;
  lessonDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  memo?: string;
}

export async function bookLesson(data: LessonBookingDto) {
  return await api.post('/api/lessons/reserve', data);
}

// 레슨 날짜/시간 변경
export interface LessonRescheduleDto {
  lessonReservationNo: number;
  lessonDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  memo?: string;
}

export async function rescheduleLesson(data: LessonRescheduleDto) {
  return await api.post(`/api/lessons/reschedule/${data.lessonReservationNo}`, {
    lessonDate: data.lessonDate,
    startTime: data.startTime,
    endTime: data.endTime,
    memo: data.memo,
  });
}
