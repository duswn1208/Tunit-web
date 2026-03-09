import { useState, useEffect } from 'react';
import Tab from '@/shared/components/Tab';
import { useToast } from '@/shared/contexts/ToastContext';
import Header from '@/shared/components/Header';
import TutorContractCard from '../components/TutorContractCard';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/shared/lib/api';
import type { Contract, ContractStatusCode, PaymentStatusCode } from '../types/contract';
import { getStatusLabel } from '../types/contract';
import '../css/my-tutors.css';

export default function MyStudentsPage() {
  const [activeTab, setActiveTab] = useState(getStatusLabel('REQUESTED') + ' 학생');
  const tabList = [
    getStatusLabel('REQUESTED') + ' 학생',
    getStatusLabel('ACTIVE') + ' 학생',
    '종료된 학생',
  ];

  // 상태별 필터링 기준을 contract.ts 상수로 관리
  const statusMap: Record<string, ContractStatusCode[]> = {
    [getStatusLabel('REQUESTED') + ' 학생']: ['REQUESTED', 'APPROVED'],
    [getStatusLabel('ACTIVE') + ' 학생']: ['ACTIVE'],
    '종료된 학생': ['CANCELLED', 'TERMINATED', 'END'],
  };
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  // 튜터의 계약 목록 조회
  const { data, isLoading, error } = useQuery({
    queryKey: ['contracts', 'tutor'],
    queryFn: async () => {
      return api.get<Contract[]>('/api/contracts/tutor');
    },
  });

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

  // 결제 상태 변경 mutation
  const updatePaymentStatus = useMutation({
    mutationFn: async ({
      contractNo,
      newPaymentStatus,
    }: {
      contractNo: number;
      newPaymentStatus: PaymentStatusCode;
    }) => {
      return api.post(`/api/contracts/pay/${contractNo}/status`, {
        paymentStatus: newPaymentStatus,
      });
    },
    onSuccess: () => {
      showToast('결제 확인이 완료되었습니다.', 'success');
      queryClient.invalidateQueries({ queryKey: ['contracts', 'tutor'] });
    },
    onError: () => {
      showToast('결제 확인에 실패했습니다.', 'error');
    },
  });

  const handleStatusChange = (contractNo: number, newStatus: ContractStatusCode) => {
    updateContractStatus.mutate({ contractNo, newStatus });
  };

  const handlePaymentConfirm = (contractNo: number, newPaymentStatus: PaymentStatusCode) => {
    updatePaymentStatus.mutate({ contractNo, newPaymentStatus });
  };

  useEffect(() => {
    if (error) {
      showToast('계약 정보를 불러오는 중에 오류가 발생했습니다.', 'error');
    }
  }, [error, showToast]);

  useEffect(() => {
    if (!isLoading && data && data.length === 0) {
      showToast('관리중인 학생이 없습니다.', 'info');
    }
  }, [data, isLoading, showToast]);

  return (
    <div className="my-tutors-page">
      <div className="my-tutors-container">
        <Header title="내 학생" />

        <Tab tabs={tabList} selected={activeTab} onSelect={setActiveTab} />

        <div className="tutors-list">
          {(() => {
            console.log('MyStudentsPage data:', data); // 데이터 확인용 로그
            const filtered =
              data?.filter((contract: Contract) =>
                statusMap[activeTab]?.includes(contract.contractStatus.code),
              ) ?? [];
            if (!isLoading && filtered.length === 0) {
              return <p className="empty-message">학생이 없습니다</p>;
            }
            return filtered.map((contract: Contract) => (
              <TutorContractCard
                key={contract.contractNo}
                contract={contract}
                onStatusChange={handleStatusChange}
                onPaymentConfirm={handlePaymentConfirm}
              />
            ));
          })()}
        </div>
      </div>
    </div>
  );
}
