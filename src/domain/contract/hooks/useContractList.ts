import { useQuery } from '@tanstack/react-query';
import { fetchContractList } from '../api/contractApi';

export function useContractList() {
  return useQuery({
    queryKey: ['contracts', 'list'],
    queryFn: fetchContractList,
  });
}
