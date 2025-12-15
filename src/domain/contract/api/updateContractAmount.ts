import { api } from '@/shared/lib/api';

// 총 금액 변경
export async function updateContractAmount(contractNo: number, newTotalAmount: number) {
  return api.post(`/api/contracts/${contractNo}/amount`, newTotalAmount);
}
