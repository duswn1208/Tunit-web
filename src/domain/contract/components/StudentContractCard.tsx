import Chip from '@/shared/components/Chip';
import Button from '@/shared/components/Button';
import TutorProposalCard from './TutorProposalCard';
import { acceptTutorProposal } from '../api/trialContractApi';
import type { Contract } from '../types/contract';
import {
  CONTRACT_STATUS_TRANSITIONS_STUDENT,
  getStatusLabel,
  type ContractStatusCode,
} from '../types/contract';
import '../css/my-tutors.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '@/shared/contexts/AlertContext';
import { useToast } from '@/shared/contexts/ToastContext';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale/ko';

interface StudentContractCardProps {
  contract: Contract;
  onPaymentRequest?: (contractNo: number, paymentAmount: number) => void;
  onStatusChange?: (contractNo: number, newStatus: ContractStatusCode) => void;
}

export default function StudentContractCard({
  contract,
  onPaymentRequest,
  onStatusChange,
}: StudentContractCardProps) {
  const [paymentAmount, setPaymentAmount] = useState<number>(contract.totalPrice);
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const { showToast } = useToast();

  const handleCardClick = (e: React.MouseEvent) => {
    // 버튼이나 입력 필드 클릭 시에는 이동하지 않음
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('input')) {
      return;
    }
    navigate(`/student/my/lessons?contractNo=${contract.contractNo}`);
  };

  // 튜터 제안 수락 핸들러
  const handleAcceptProposal = async (proposalId: number) => {
    try {
      await acceptTutorProposal(contract.contractNo, proposalId);
      showToast('체험 레슨이 확정되었습니다!');
      window.location.reload();
    } catch (error: any) {
      showToast(error?.message || '제안 수락에 실패했습니다', 'error');
    }
  };

  const formatDisplayDate = (dateStr: string, timeStr?: string) => {
    try {
      const dateObj = timeStr ? new Date(dateStr + 'T' + timeStr) : new Date(dateStr + 'T00:00:00');
      return timeStr 
        ? format(dateObj, 'M월 d일 (E) HH:mm', { locale: ko })
        : format(dateObj, 'M월 d일 (E)', { locale: ko });
    } catch {
      return timeStr ? `${dateStr} ${timeStr}` : dateStr;
    }
  };

  const handlePaymentRequest = () => {
    if (onPaymentRequest) {
      onPaymentRequest(contract.contractNo, paymentAmount);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setPaymentAmount(Number(value));
  };

  const handleStatusChange = (newStatus: ContractStatusCode) => {
    if (onStatusChange) {
      onStatusChange(contract.contractNo, newStatus);
    }
  };

  const handleLessonManage = () => {
    if (contract.contractStatus.code == 'REQUESTED') {
      navigate(`/student/my/lessons?contractNo=${contract.contractNo}&tab=pending&view=calendar`);
      return;
    }
    // 레슨 관리 페이지로 이동 (캘린더 뷰, 예정된 레슨 탭)
    navigate(`/student/my/lessons?contractNo=${contract.contractNo}&tab=upcoming&view=calendar`);
  };

  const handleChangeContractType = () => {
    // 정규/선착순 레슨 등록 페이지로 이동
    showAlert({
      message: '정규/선착순 레슨 등록 페이지로 이동하시겠습니까?',
      customButtons: [
        {
          text: '정규레슨',
          onClick: () => {
            navigate(`/student/contracts/${contract.contractNo}/edit?type=regular`);
          },
          className: 'ui-btn--primary',
        },
        {
          text: '선착순레슨',
          onClick: () => {
            navigate(`/student/contracts/${contract.contractNo}/edit?type=first-come`);
          },
          className: 'ui-btn--outline',
        },
      ],
    });
  };

  // 현재 상태에서 변경 가능한 상태들
  const availableStatuses = CONTRACT_STATUS_TRANSITIONS_STUDENT[contract.contractStatus.code] || [];

  return (
    <div className="tutor-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <div className="tutor-card-header">
        <div className="tutor-card-content">
          <div className="tutor-card-title-row">
            <h3 className="tutor-card-title">{contract.lessonName}</h3>
            <Chip label={contract.contractStatus.label} />
          </div>
          <p className="tutor-card-location">
            {contract.place ?? '지정 장소'} | {contract.dayOfWeek} {contract.startTime}
          </p>
        </div>
      </div>
      <div className="tutor-card-date">
        {contract.startDt} ~ {contract.endDt ?? '진행 중'}
      </div>
      <div className="tutor-card-lessons">
        레슨: 주 {contract.weekCount}회 | 총 {contract.lessonCount}회
      </div>
      <div className="tutor-card-price">
        총 금액:{' '}
        {contract.paidAmount != null && contract.totalPrice !== contract.paidAmount ? (
          <>
            <span className="price-original">{contract.totalPrice.toLocaleString()}원</span>
            <span className="price-paid">{contract.paidAmount.toLocaleString()}원</span>
          </>
        ) : (
          <span>{contract.totalPrice.toLocaleString()}원</span>
        )}
      </div>

      {/* 체험 레슨 대기 중 - 튜터 제안이 있는 경우 */}
      {contract.contractType.code === 'TRIAL' &&
        contract.contractStatus.code === 'REQUESTED' &&
        contract.tutorProposals &&
        contract.tutorProposals.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>
              🎯 튜터가 제안한 시간
            </div>
            {contract.tutorProposals
              .filter((p) => p.isAccepted === null)
              .map((proposal) => (
                <TutorProposalCard
                  key={proposal.id}
                  proposal={proposal}
                  onAccept={handleAcceptProposal}
                />
              ))}
          </div>
        )}

      {/* 체험 레슨 대기 중 - 후보 시간 표시 */}
      {contract.contractType.code === 'TRIAL' &&
        contract.contractStatus.code === 'REQUESTED' &&
        contract.trialCandidates &&
        contract.trialCandidates.length > 0 &&
        (!contract.tutorProposals || contract.tutorProposals.length === 0) && (
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>
              ⏰ 제안한 후보 시간
            </div>
            {contract.trialCandidates.map((candidate) => (
              <div
                key={candidate.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: 6,
                  marginBottom: 6,
                  fontSize: 14,
                }}
              >
                <span>
                  {candidate.priority}순위: {formatDisplayDate(candidate.candidateDate)} {candidate.candidateStartTime}
                </span>
                {candidate.isAvailable === true && (
                  <span style={{ color: '#4caf50', fontSize: 12 }}>✓ 가능</span>
                )}
                {candidate.isAvailable === false && (
                  <span style={{ color: '#f44336', fontSize: 12 }}>✗ 불가</span>
                )}
              </div>
            ))}
            <div style={{ fontSize: 13, color: '#666', marginTop: 8 }}>
              튜터가 확인 중입니다...
            </div>
          </div>
        )}

      {/* 체험 레슨 확정됨 */}
      {contract.contractType.code === 'TRIAL' &&
        contract.contractStatus.code === 'ACTIVE' &&
        contract.selectedCandidateDate && (
          <div style={{ marginTop: 16 }}>
            <div
              style={{
                padding: 16,
                backgroundColor: '#e8f5e9',
                borderRadius: 8,
                border: '1px solid #4caf50',
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 600, color: '#2e7d32', marginBottom: 4 }}>
                ✅ 체험 레슨 확정
              </div>
              <div style={{ fontSize: 15 }}>
                {formatDisplayDate(contract.selectedCandidateDate, contract.selectedCandidateTime)}
              </div>
            </div>
          </div>
        )}

      {contract.contractStatus.code === 'APPROVED' && contract.paymentStatus.code === 'PENDING' && (
        <div className="tutor-card-actions">
          <div className="payment-amount-input">
            <label htmlFor={`payment-${contract.contractNo}`}>결제 금액:</label>
            <input
              id={`payment-${contract.contractNo}`}
              type="text"
              value={paymentAmount.toLocaleString()}
              onChange={handleAmountChange}
              placeholder="결제 금액 입력"
            />
            <span>원</span>
          </div>
          <button className="payment-request-btn" onClick={handlePaymentRequest}>
            결제 완료 및 확인 요청
          </button>
        </div>
      )}

      {/* 상태 변경 버튼들 */}
      {availableStatuses.length > 0 && (
        <div className="tutor-card-actions">
          {availableStatuses.map((status) => (
            <button
              key={status}
              className="status-change-btn"
              onClick={() => handleStatusChange(status)}
            >
              {getStatusLabel(status)}
            </button>
          ))}
          <button className="tutor-card-top-button" onClick={handleLessonManage}>
            레슨 관리
          </button>
          {contract.contractType.code === 'TRIAL' && (
            <button className="tutor-card-top-button" onClick={handleChangeContractType}>
              정규/선착순 레슨 등록
            </button>
          )}
        </div>
      )}
    </div>
  );
}
