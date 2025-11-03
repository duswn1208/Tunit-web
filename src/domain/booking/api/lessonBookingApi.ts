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
}

export async function requestContract(data: ContractRequestDto) {
  return await api.post('/api/contracts', data);
}
