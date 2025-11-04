import { useState, useEffect } from 'react';
import Tab from '@/shared/components/Tab';
import { useToast } from '@/shared/contexts/ToastContext';
import { useContractList } from '../hooks/useContractList';
import '../css/my-tutors.css';
import Header from '@/shared/components/Header';
import ContractCard from '../components/ContractCard';

export default function MyTutorsPage() {
  const [activeTab, setActiveTab] = useState('연결된 튜터');
  const tabList = ['연결된 튜터', '종료된 튜터'];
  const { data, isLoading, error } = useContractList();
  const { showToast } = useToast();

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
    if (!data) {
      showToast('연결된 튜터가 없습니다.', 'info');
    }
  }, [data, showToast]);

  return (
    <div className="my-tutors-page">
      <div className="my-tutors-container">
        <Header title="내 튜터" />

        <Tab tabs={tabList} selected={activeTab} onSelect={setActiveTab} />

        <div className="tutors-list">
          <div>
            {data &&
              (data as any).map((contract: any) => (
                <ContractCard key={contract.contractNo} contract={contract} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
