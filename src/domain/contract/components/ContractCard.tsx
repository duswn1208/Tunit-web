import Chip from '@/shared/components/Chip';
import type { Contract } from '../types/contract';
import '../css/my-tutors.css';

interface ContractCardProps {
  contract: Contract;
}

export default function ContractCard({ contract }: ContractCardProps) {
  console.log('ContractCard contract:', contract);
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
      <div className="tutor-card-price">총 금액: {contract.totalPrice.toLocaleString()}원</div>
    </div>
  );
}
