import { useQuery } from '@tanstack/react-query';
import { fetchContractList, fetchContractDetail } from '../api/contractApi';

export function useContractList() {
  return useQuery({
    queryKey: ['contracts', 'list'],
    queryFn: fetchContractList,
  });
}

export function useContractDetail(contractNo: number | undefined) {
  return useQuery({
    queryKey: ['contract', contractNo],
    queryFn: () => fetchContractDetail(contractNo!),
    enabled: !!contractNo,
  });
}
