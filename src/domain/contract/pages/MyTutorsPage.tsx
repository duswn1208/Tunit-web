import { useState, useEffect } from 'react';
import Tab from '@/shared/components/Tab';
import { useToast } from '@/shared/contexts/ToastContext';
import { useContractList } from '../hooks/useContractList';
import '../css/my-tutors.css';
import Header from '@/shared/components/Header';
import StudentContractCard from '../components/StudentContractCard';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/shared/lib/api';

export default function MyTutorsPage() {
  const [activeTab, setActiveTab] = useState('연결된 튜터');
  const tabList = ['연결된 튜터', '종료된 튜터'];
  const { data, isLoading, error } = useContractList();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  // 결제 완료 알림 mutation
  const notifyPayment = useMutation({
    mutationFn: async ({
      contractNo,
      paymentAmount,
    }: {
      contractNo: number;
      paymentAmount: number;
    }) => {
      return api.post(`/api/contracts/pay/${contractNo}/status`, {
        contractNo: contractNo,
        paymentAmount: paymentAmount,
        paymentMethod: 'BANK_TRANSFER',
        paymentStatus: 'CONFIRMING',
        proofUrl: '',
      });
    },
    onSuccess: () => {
      showToast('결제 완료를 튜터에게 알렸습니다.', 'success');
      queryClient.invalidateQueries({ queryKey: ['contracts', 'list'] });
    },
    onError: () => {
      showToast('알림 전송에 실패했습니다.', 'error');
    },
  });

  const handlePaymentRequest = (contractNo: number, paymentAmount: number) => {
    notifyPayment.mutate({ contractNo, paymentAmount });
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
    if (!isLoading && !data) {
      showToast('연결된 튜터가 없습니다.', 'info');
    }
  }, [isLoading, data, showToast]);

  return (
    <div className="my-tutors-page">
      <div className="my-tutors-container">
        <Header title="내 튜터" />

        <Tab tabs={tabList} selected={activeTab} onSelect={setActiveTab} />

        <div className="tutors-list">
          {data &&
            (data as any).map((contract: any) => (
              <StudentContractCard
                key={contract.contractNo}
                contract={contract}
                onPaymentRequest={handlePaymentRequest}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
