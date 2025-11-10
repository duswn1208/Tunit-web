import type { Contract } from '@/domain/contract/types/contract';
import './css/lesson-booking.css';
import { getDayLabel } from '@/shared/constants/date';
import { toAmPmFormat } from '@/domain/dayTime/lib/timeUtils';
import { isRegular } from '../types/types';
import { useState } from 'react';
import Header from '@/shared/components/Header';

interface ContractInfoCardProps {
  contract: Contract;
}

export default function ContractInfoCard({ contract }: ContractInfoCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="contract-info-card">
      <div
        className="contract-info-header"
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <h3 className="contract-info-title" style={{ margin: 0, flexShrink: 0 }}>
          레슨 정보
        </h3>
        <span
          className="contract-info-value"
          style={{ flex: 1, textAlign: 'right', marginLeft: '12px' }}
        >
          {contract.lessonName} {contract.currentLessonCount} / {contract.lessonCount} 회차
        </span>
        <button
          className="contract-toggle-btn"
          style={{
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            transition: 'transform 0.3s ease',
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            flexShrink: 0,
          }}
        >
          ▼
        </button>
      </div>

      {isExpanded && (
        <div className="contract-info-content">
          {isRegular(contract.contractType.code) && (
            <div className="contract-info-row">
              <span className="contract-info-label">정규 스케줄</span>
              <span className="contract-info-value">
                {`매주 ${getDayLabel(contract.dayOfWeekNum)}요일`}{' '}
                {toAmPmFormat(contract.startTime)}
              </span>
            </div>
          )}
          <div className="contract-info-row">
            <span className="contract-info-label">장소</span>
            <span className="contract-info-value">{contract.place ?? '지정 장소'}</span>
          </div>
          <div className="contract-info-row">
            <span className="contract-info-label">진행 상황</span>
            <span className="contract-info-value">
              {contract.currentLessonCount} / {contract.lessonCount}회
            </span>
          </div>
          <div className="contract-info-row">
            <span className="contract-info-label">계약 기간</span>
            <span className="contract-info-value">
              {contract.startDt} ~ {contract.endDt ?? '진행 중'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
