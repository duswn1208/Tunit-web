import { api } from '@/shared/lib/api';
import type { ContractListResponse } from '../types/contract';

// 학생의 계약 목록 조회
export async function fetchContractList(): Promise<ContractListResponse> {
  return api.get<ContractListResponse>('/api/students/my/contracts');
}

// 계약 상세 조회
export async function fetchContractDetail(contractNo: number) {
  return api.get(`/api/contracts/${contractNo}`);
}

// 계약 종료
export async function endContract(contractNo: number) {
  return api.post(`/api/contracts/${contractNo}/end`, {});
}
