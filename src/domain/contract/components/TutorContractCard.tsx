import Chip from '@/shared/components/Chip';
import type { Contract, ContractStatusCode } from '../types/contract';
import { CONTRACT_STATUS_TRANSITIONS } from '../types/contract';
import '../css/my-tutors.css';

interface TutorContractCardProps {
  contract: Contract;
  onStatusChange?: (contractNo: number, newStatus: ContractStatusCode) => void;
}

// 상태 코드에 따른 한글 라벨
const getStatusLabel = (statusCode: ContractStatusCode): string => {
  const labels: Record<ContractStatusCode, string> = {
    REQUESTED: '요청',
    APPROVED: '승인 및  결제요청',
    ACTIVE: '진행중',
    CANCELLED: '취소',
    TERMINATED: '중단',
    END: '종료',
  };
  return labels[statusCode];
};

export default function TutorContractCard({ contract, onStatusChange }: TutorContractCardProps) {
  console.log('TutorContractCard contract:', contract);

  const availableTransitions = CONTRACT_STATUS_TRANSITIONS[contract.contractStatus.code];

  const handleStatusChange = (newStatus: ContractStatusCode) => {
    if (onStatusChange) {
      onStatusChange(contract.contractNo, newStatus);
    }
  };

  return (
    <div className="tutor-card">
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
