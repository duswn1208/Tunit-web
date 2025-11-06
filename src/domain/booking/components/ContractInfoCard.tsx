import type { Contract } from '@/domain/contract/types/contract';
import './css/lesson-booking.css';

interface ContractInfoCardProps {
  contract: Contract;
}

export default function ContractInfoCard({ contract }: ContractInfoCardProps) {
  return (
    <div className="contract-info-card">
      <h3 className="contract-info-title">계약 정보</h3>
      <div className="contract-info-content">
        <div className="contract-info-row">
          <span className="contract-info-label">레슨 카테고리</span>
          <span className="contract-info-value">{contract.lessonName}</span>
        </div>
        <div className="contract-info-row">
          <span className="contract-info-label">계약 타입</span>
          <span className="contract-info-value">{contract.contractType.label}</span>
        </div>
        <div className="contract-info-row">
          <span className="contract-info-label">정규 스케줄</span>
          <span className="contract-info-value">
            {contract.dayOfWeek} {contract.startTime}
          </span>
        </div>
        <div className="contract-info-row">
          <span className="contract-info-label">장소</span>
          <span className="contract-info-value">{contract.place ?? '지정 장소'}</span>
        </div>
        <div className="contract-info-row">
          <span className="contract-info-label">진행 상황</span>
          <span className="contract-info-value">
            주 {contract.weekCount}회 | 총 {contract.lessonCount}회
          </span>
        </div>
        <div className="contract-info-row">
          <span className="contract-info-label">계약 기간</span>
          <span className="contract-info-value">
            {contract.startDt} ~ {contract.endDt ?? '진행 중'}
          </span>
        </div>
      </div>
    </div>
  );
}
