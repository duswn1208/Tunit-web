import Chip from '@/shared/components/Chip';
import type { Contract } from '../types/contract';
import '../css/my-tutors.css';
import { Button } from '@/shared/components';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface StudentContractCardProps {
  contract: Contract;
  onPaymentRequest?: (contractNo: number, paymentAmount: number) => void;
}

export default function StudentContractCard({
  contract,
  onPaymentRequest,
}: StudentContractCardProps) {
  console.log('StudentContractCard contract:', contract);
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
          <Button className="payment-request-btn" onClick={handlePaymentRequest}>
            결제 완료 및 확인 요청
          </Button>
        </div>
      )}
    </div>
  );
}
