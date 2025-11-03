import { useState, useEffect } from 'react';
import Tab from '@/shared/components/Tab';
import { useToast } from '@/shared/contexts/ToastContext';
import { useContractList } from '../hooks/useContractList';
import '../css/my-tutors.css';
import Chip from '@/shared/components/Chip';

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

  console.log('Contract Data:', data);

  return (
    <div className="my-tutors-page">
      <div className="my-tutors-container">
        <h1>나의 튜터</h1>

        <Tab tabs={tabList} selected={activeTab} onSelect={setActiveTab} />

        <div className="tutors-list">
          <div>
            {data &&
              data.map((contract) => (
                <div
                  key={contract.contractNo}
                  className="tutor-card"
                  style={{
                    padding: '16px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    background: '#fff',
                  }}
                >
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '4px',
                        }}
                      >
                        <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '600' }}>
                          {contract.lessonName}
                        </h3>
                        <Chip label={contract.contractStatus.label || ''} />
                      </div>
                      <p style={{ margin: '0', fontSize: '13px', color: '#718096' }}>
                        {contract.place} | {contract.dayOfWeek} {contract.startTime}
                      </p>
                    </div>
                  </div>
                  <div style={{ fontSize: '14px', color: '#4a5568', marginBottom: '8px' }}>
                    시작: {contract.startDt}
                  </div>
                  <div style={{ fontSize: '14px', color: '#4a5568', marginBottom: '8px' }}>
                    레슨: 주 {contract.weekCount}회 | 총 {contract.lessonCount}회
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#ff4757' }}>
                    총 금액: {contract.totalPrice.toLocaleString()}원
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
