import { api } from '@/shared/lib/api';
import type { Contract } from '../types/contract';

// 체험 레슨 계약 생성 (학생)
export interface TrialContractCreateDto {
  tutorProfileNo: number;
  contractType: 'TRIAL';
  lessonCategory: string;
  place?: string;
  level?: string;
  memo?: string;
  emergencyContact?: string;
  totalPrice: number;
  trialCandidates: Array<{
    priority: number;
    candidateDate: string; // YYYY-MM-DD
    candidateStartTime: string; // HH:mm
  }>;
}

export async function createTrialContract(data: TrialContractCreateDto): Promise<Contract> {
  return api.post('/api/contracts/trial', data);
}

// 튜터가 후보 시간 확정
export interface TrialConfirmDto {
  selectedDate: string; // YYYY-MM-DD
  selectedStartTime: string; // HH:mm
}

export async function confirmTrialContract(
  contractNo: number,
  data: TrialConfirmDto
): Promise<Contract> {
  return api.post(`/api/contracts/${contractNo}/trial/confirm`, data);
}

// 튜터가 거절 (대안 제안 가능)
export interface TrialRejectDto {
  reason: string;
  alternativeTimes?: Array<{
    proposedDate: string; // YYYY-MM-DD
    proposedStartTime: string; // HH:mm
  }>;
}

export async function rejectTrialContract(
  contractNo: number,
  data: TrialRejectDto
): Promise<Contract> {
  return api.post(`/api/contracts/${contractNo}/trial/reject`, data);
}

// 학생이 튜터 제안 시간 수락
export async function acceptTutorProposal(
  contractNo: number,
  proposalId: number
): Promise<Contract> {
  return api.post(`/api/contracts/${contractNo}/trial/accept-proposal/${proposalId}`, {});
}
