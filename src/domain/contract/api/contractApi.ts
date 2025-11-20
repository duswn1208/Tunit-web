import { api } from '@/shared/lib/api';
import type { Contract } from '../types/contract';

// 학생의 계약 목록 조회
export async function fetchContractList(): Promise<Contract[]> {
  return api.get<Contract[]>('/api/contracts/student');
}

// 계약 상세 조회
export async function fetchContractDetail(contractNo: number): Promise<Contract> {
  return api.get<Contract>(`/api/contracts/${contractNo}`);
}

// 계약 수정 (타입 변경 포함)
export async function updateContract(contractNo: number, data: Partial<Contract>) {
  return api.put(`/api/contracts/${contractNo}`, data);
}

// 계약 종료
export async function endContract(contractNo: number) {
  return api.post(`/api/contracts/${contractNo}/end`, {});
}

// 후기 작성
export async function submitReview(data: {
  lessonReservationNo: number;
  rating: number;
  content: string;
}) {
  console.log('Submitting review:', data);
  return api.post(`/api/reviews`, data);
}
