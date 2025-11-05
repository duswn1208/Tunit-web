import Chip from '@/shared/components/Chip';
import type { Contract, ContractStatusCode } from '../types/contract';
import { CONTRACT_STATUS_TRANSITIONS_STUDENT } from '../types/contract';
import '../css/my-tutors.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

  const handleCardClick = (e: React.MouseEvent) => {
    // 버튼이나 입력 필드 클릭 시에는 이동하지 않음
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('input')) {
      return;
    }
    navigate(`/student/my/lessons?contractNo=${contract.contractNo}`);
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

  const handleLessonBooking = () => {
    navigate(`/student/my/lessons?contractNo=${contract.contractNo}`);
  };

  // 현재 상태에서 변경 가능한 상태들
  const availableStatuses = CONTRACT_STATUS_TRANSITIONS_STUDENT[contract.contractStatus.code] || [];

  // 상태 레이블 매핑
  const statusLabels: Record<ContractStatusCode, string> = {
    REQUESTED: '요청',
    APPROVED: '승인',
    ACTIVE: '진행중',
    CANCELLED: '취소',
    TERMINATED: '중단',
    END: '종료',
  };

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
              {statusLabels[status]}
            </button>
          ))}
          {/* 진행중일 때 레슨예약 버튼 추가 */}
          {contract.contractStatus.code === 'ACTIVE' && (
            <button className="status-change-btn" onClick={handleLessonBooking}>
              레슨 예약
            </button>
          )}
        </div>
      )}
    </div>
  );
}
