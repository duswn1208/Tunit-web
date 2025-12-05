import Chip from '@/shared/components/Chip';
import type { Contract, ContractStatusCode, PaymentStatusCode } from '../types/contract';
import { CONTRACT_STATUS_TRANSITIONS, getStatusLabel } from '../types/contract';
import '../css/my-tutors.css';
import { useNavigate } from 'react-router-dom';
import PaymentStatusAlert from './PaymentStatusAlert';
import { useState } from 'react';
import { toAmPmFormat } from '@/domain/dayTime/lib/timeUtils';
import { getDayLabel } from '@/shared/constants/date';
import { isFirstcome } from '@/domain/booking/types/types';

interface TutorContractCardProps {
  contract: Contract;
  onStatusChange?: (contractNo: number, newStatus: ContractStatusCode) => void;
  onPaymentConfirm?: (contractNo: number, newPaymentStatus: PaymentStatusCode) => void;
}

export default function TutorContractCard({
  contract,
  onStatusChange,
  onPaymentConfirm,
}: TutorContractCardProps) {
  console.log('TutorContractCard contract:', contract);
  const navigate = useNavigate();

  // 개발 환경에서만 사용 - 결제 상태 테스트용
  const [devPaymentStatus, setDevPaymentStatus] = useState<PaymentStatusCode | null>(null);
  const isDev = import.meta.env.DEV;

  const availableTransitions = CONTRACT_STATUS_TRANSITIONS[contract.contractStatus.code];

  const handleCardClick = (e: React.MouseEvent) => {
    // 버튼 클릭 시에는 이동하지 않음
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    navigate(`/tutor/my/lessons?contractNo=${contract.contractNo}`);
  };

  const handleStatusChange = (newStatus: ContractStatusCode) => {
    if (onStatusChange) {
      onStatusChange(contract.contractNo, newStatus);
    }
  };

  const handlePaymentConfirm = () => {
    if (onPaymentConfirm) {
      onPaymentConfirm(contract.contractNo, 'PAID');
    }
  };

  // 개발 환경에서 표시할 실제 결제 상태
  const displayPaymentStatus = devPaymentStatus || contract.paymentStatus?.code;

  return (
    <div className="tutor-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <div className="tutor-card-header">
        <div className="tutor-card-content">
          <div className="tutor-card-title-row">
            <h3 className="tutor-card-title">
              {contract.studentName} 학생, {contract.lessonName}
            </h3>
            <Chip label={contract.contractStatus.label} />
          </div>
          <p className="tutor-card-location">{contract.place ?? '지정 장소'}</p>
        </div>
      </div>
      <div className="tutor-card-date">
        {contract.startDt} ~ {contract.endDt ?? '진행 중'} |{' '}
        {!isFirstcome(contract.contractStatus.code) &&
          `매주 ${getDayLabel(contract.dayOfWeekNum)}요일 `}
        {toAmPmFormat(contract.startTime)}
      </div>
      <div className="tutor-card-lessons">
        레슨: 주 {contract.weekCount}회 | 총 {contract.lessonCount}회
      </div>
      <div className="tutor-card-info">
        <div>레벨: {contract.level}</div>
        <div>비상연락처: {contract.emergencyContact}</div>
      </div>
      {contract.memo && (
        <div className="tutor-card-memo">
          <strong>메모:</strong> {contract.memo}
        </div>
      )}
      <div className="tutor-card-price">총 금액: {contract.totalPrice.toLocaleString()}원</div>

      {/* 결제 상태 알림 */}
      {displayPaymentStatus && (
        <PaymentStatusAlert paymentStatus={displayPaymentStatus} onConfirm={handlePaymentConfirm} />
      )}
      {/* 개발 환경 전용 - 결제 상태 테스트 버튼
      {isDev && (
        <div
          style={{
            padding: '8px',
            background: '#f0f0f0',
            borderRadius: '4px',
            marginTop: '12px',
            marginBottom: '12px',
            display: 'flex',
            gap: '4px',
            flexWrap: 'wrap',
          }}
        >
          <small style={{ width: '100%', marginBottom: '4px', fontWeight: 'bold' }}>
            [DEV] 결제 상태 테스트:
          </small>
          {(
            [
              'REQUESTED',
              'CONFIRMING',
              'PAID',
              'PARTIAL',
              'REJECTED',
              'REFUNDED',
            ] as PaymentStatusCode[]
          ).map((status) => (
            <button
              key={status}
              onClick={(e) => {
                e.stopPropagation();
                setDevPaymentStatus(status);
              }}
              style={{
                padding: '4px 8px',
                fontSize: '11px',
                border: '1px solid #ccc',
                background: devPaymentStatus === status ? '#4CAF50' : 'white',
                color: devPaymentStatus === status ? 'white' : 'black',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              {status}
            </button>
          ))}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDevPaymentStatus(null);
            }}
            style={{
              padding: '4px 8px',
              fontSize: '11px',
              border: '1px solid #f44336',
              background: 'white',
              color: '#f44336',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            초기화
          </button>
        </div>
      )} */}

      {availableTransitions.length > 0 && (
        <div className="tutor-card-actions">
          {availableTransitions.map((status) => (
            <button
              key={status}
              className="status-change-btn"
              onClick={() => handleStatusChange(status)}
            >
              {getStatusLabel(status)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
