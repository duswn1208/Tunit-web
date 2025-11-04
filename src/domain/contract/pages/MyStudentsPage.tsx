import { useState, useEffect } from 'react';
import Tab from '@/shared/components/Tab';
import { useToast } from '@/shared/contexts/ToastContext';
import Header from '@/shared/components/Header';
import TutorContractCard from '../components/TutorContractCard';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/shared/lib/api';
import type { Contract, ContractStatusCode } from '../types/contract';
import '../css/my-tutors.css';

export default function MyStudentsPage() {
  const [activeTab, setActiveTab] = useState('진행중인 학생');
  const tabList = ['요청온 학생', '진행중인 학생', '종료된 학생'];
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  // 튜터의 계약 목록 조회
  const { data, isLoading, error } = useQuery({
    queryKey: ['contracts', 'tutor'],
    queryFn: async () => {
      return api.get<Contract[]>('/api/contracts/tutor');
    },
  });

  //진행중 버튼 클릭했을 때 결제완료가 아니라 상태만 변경되는 중 TODO

  // 계약 상태 변경 mutation
  const updateContractStatus = useMutation({
    mutationFn: async ({
      contractNo,
      newStatus,
    }: {
      contractNo: number;
      newStatus: ContractStatusCode;
    }) => {
      return api.put(`/api/contracts/${contractNo}/status/tutor`, { contractStatus: newStatus });
    },
    onSuccess: () => {
      showToast('계약 상태가 변경되었습니다.', 'success');
      queryClient.invalidateQueries({ queryKey: ['contracts', 'tutor'] });
    },
    onError: () => {
      showToast('계약 상태 변경에 실패했습니다.', 'error');
    },
  });

  const handleStatusChange = (contractNo: number, newStatus: ContractStatusCode) => {
    updateContractStatus.mutate({ contractNo, newStatus });
  };

  useEffect(() => {
    if (isLoading) {
      showToast('계약 정보를 불러오는 중입니다...', 'info');
    }
  }, [isLoading, showToast]);

  useEffect(() => {
    if (error) {
      showToast('계약 정보를 불러오는 중에 오류가 발생했습니다.', 'error');
    }
  }, [error, showToast]);

  useEffect(() => {
    if (!data || data.length === 0) {
      showToast('관리중인 학생이 없습니다.', 'info');
    }
  }, [data, showToast]);

  console.log('Tutor Contract Data:', data);

  return (
    <div className="my-tutors-page">
      <div className="my-tutors-container">
        <Header title="내 학생" />

        <Tab tabs={tabList} selected={activeTab} onSelect={setActiveTab} />

        <div className="tutors-list">
          <div>
            {data &&
              (data as any).map((contract: any) => (
                <TutorContractCard
                  key={contract.contractNo}
                  contract={contract}
                  onStatusChange={handleStatusChange}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
