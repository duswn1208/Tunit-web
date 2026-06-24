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
import '../css/my-students-stats.css';

export default function MyStudentsPage() {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const baseTabList = [
    getStatusLabel('REQUESTED') + ' 학생',
    getStatusLabel('ACTIVE') + ' 학생',
    '종료된 학생',
  ];

  // 상태별 필터링 기준을 contract.ts 상수로 관리
  const statusMap: Record<string, ContractStatusCode[]> = {
    [baseTabList[0]]: ['REQUESTED', 'APPROVED'],
    [baseTabList[1]]: ['ACTIVE'],
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

  // 통계 계산
  const allContracts = data || [];
  const activeContracts = allContracts.filter(
    (c: Contract) => c.contractStatus.code === 'ACTIVE',
  );
  const pendingContracts = allContracts.filter((c: Contract) =>
    ['REQUESTED', 'APPROVED'].includes(c.contractStatus.code),
  );

  // 탭별 카운트 계산 및 표시 레이블 생성
  const tabList = baseTabList.map((tab) => {
    if (!data) return tab;
    const count = data.filter((c: Contract) =>
      statusMap[tab]?.includes(c.contractStatus.code),
    ).length;
    return count > 0 ? `${tab} (${count})` : tab;
  });

  const activeTab = baseTabList[activeTabIndex];

  return (
    <div className="my-tutors-page">
      <div className="my-tutors-container">
        <Header title="내 학생" />

        <div className="mys-page-header">
          <button className="mys-invite-btn" onClick={() => { /* TODO: 학생 초대 모달 */ }}>
            + 학생 초대
          </button>
        </div>

        <div className="mys-stats-bar">
          <div className="mys-stat-card">
            <span className="mys-stat-value">{allContracts.length}</span>
            <span className="mys-stat-label">전체 학생</span>
          </div>
          <div className="mys-stat-card mys-stat-card--active">
            <span className="mys-stat-value">{activeContracts.length}</span>
            <span className="mys-stat-label">진행중</span>
          </div>
          <div className="mys-stat-card mys-stat-card--pending">
            <span className="mys-stat-value">{pendingContracts.length}</span>
            <span className="mys-stat-label">신청 대기</span>
          </div>
          <div className="mys-stat-card">
            <span className="mys-stat-value">{activeContracts.length}</span>
            <span className="mys-stat-label">고정 레슨</span>
          </div>
        </div>

        <Tab
          tabs={tabList}
          selected={tabList[activeTabIndex]}
          onSelect={(displayTab) => {
            const idx = tabList.indexOf(displayTab);
            setActiveTabIndex(idx >= 0 ? idx : 0);
          }}
        />

        <div className="tutors-list">
          {isLoading ? (
            <div className="tutors-loading" style={{ gridColumn: '1 / -1' }}>
              <div className="tutors-loading-card" />
              <div className="tutors-loading-card" />
            </div>
          ) : (() => {
            const filtered =
              data?.filter((contract: Contract) =>
                statusMap[activeTab]?.includes(contract.contractStatus.code),
              ) ?? [];
            if (filtered.length === 0) {
              return (
                <div className="empty-state">
                  <span className="empty-state-icon"><i className="fas fa-user-graduate" aria-hidden="true"></i></span>
                  <p className="empty-state-text">이 탭에 해당하는 학생이 없습니다</p>
                </div>
              );
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
