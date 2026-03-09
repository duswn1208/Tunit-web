import Chip from '@/shared/components/Chip';
import Modal from '@/shared/components/Modal';
import TrialCandidateList from './TrialCandidateList';
import { confirmTrialContract, rejectTrialContract } from '../api/trialContractApi';
import type { Contract, ContractStatusCode, PaymentStatusCode } from '../types/contract';
import { CONTRACT_STATUS_TRANSITIONS, getStatusLabel } from '../types/contract';
import '../css/my-tutors.css';
import { useNavigate } from 'react-router-dom';
import PaymentStatusAlert from './PaymentStatusAlert';
import { useState } from 'react';
import { updateContractAmount } from '../api/updateContractAmount';
import { toAmPmFormat } from '@/domain/dayTime/lib/timeUtils';
import { isFirstcome } from '@/domain/booking/types/types';
import { useToast } from '@/shared/contexts/ToastContext';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale/ko';

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
  const navigate = useNavigate();

  // 개발 환경에서만 사용 - 결제 상태 테스트용
  const [devPaymentStatus, setDevPaymentStatus] = useState<PaymentStatusCode | null>(null);
  const { showToast } = useToast();

  // 총 금액 수정 상태
  const [editPrice, setEditPrice] = useState(false);
  const [priceInput, setPriceInput] = useState(contract.totalPrice || 0);
  const [displayPrice, setDisplayPrice] = useState(contract.totalPrice || 0);

  // 체험 레슨 모달 상태
  const [showTrialModal, setShowTrialModal] = useState(false);

  const handlePriceSave = async () => {
    try {
      await updateContractAmount(contract.contractNo, priceInput);
      setDisplayPrice(priceInput);
      setEditPrice(false);
      showToast('총 금액이 성공적으로 변경되었습니다.');
    } catch (e: any) {
      showToast(e?.message || '총 금액 변경에 실패했습니다.', 'error');
    }
  };
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

  // 체험 레슨 확정 핸들러
  const handleTrialConfirm = async (date: string, time: string) => {
    try {
      await confirmTrialContract(contract.contractNo, {
        selectedDate: date,
        selectedStartTime: time,
      });
      showToast('체험 레슨이 확정되었습니다!');
      setShowTrialModal(false);
      window.location.reload();
    } catch (error: any) {
      showToast(error?.message || '확정에 실패했습니다', 'error');
    }
  };

  // 체험 레슨 거절 핸들러
  const handleTrialReject = async (
    reason: string,
    alternatives?: Array<{ proposedDate: string; proposedStartTime: string }>,
  ) => {
    try {
      await rejectTrialContract(contract.contractNo, {
        reason,
        alternativeTimes: alternatives,
      });

      if (alternatives && alternatives.length > 0) {
        showToast('대안 시간이 제안되었습니다');
      } else {
        showToast('체험 레슨이 거절되었습니다');
      }
      setShowTrialModal(false);
      window.location.reload();
    } catch (error: any) {
      showToast(error?.message || '처리에 실패했습니다', 'error');
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

      {/* 날짜 / 스케줄 */}
      <div className="tutor-card-section">
        <div className="tutor-card-info-row">
          <span className="info-label">기간</span>
          <span className="info-value">
            {contract.startDt} ~ {contract.endDt ?? '진행 중'}
          </span>
        </div>
        {!isFirstcome(contract.contractStatus.code) && contract.scheduleList.length > 0 && (
          <div className="tutor-card-info-row">
            <span className="info-label">스케줄</span>
            <span className="info-value">
              매주{' '}
              {contract.scheduleList
                .map((schedule) => `${schedule.dayOfWeek}요일 ${toAmPmFormat(schedule.startTime)}`)
                .join(', ')}
            </span>
          </div>
        )}
      </div>

      {/* 레슨 횟수 / 레벨 / 비상연락처 */}
      <div className="tutor-card-section">
        <div className="tutor-card-info-row">
          <span className="info-label">레슨 횟수</span>
          <span className="info-value">
            주 {contract.weekCount}회 · 총 {contract.lessonCount}회
          </span>
        </div>
        <div className="tutor-card-info-row">
          <span className="info-label">레벨</span>
          <span className="info-value">{contract.level}</span>
        </div>
        <div className="tutor-card-info-row">
          <span className="info-label">비상연락처</span>
          <span className="info-value">{contract.emergencyContact}</span>
        </div>
      </div>

      {/* 메모 */}
      {contract.memo && (
        <div className="tutor-card-memo">
          <strong>메모:</strong> {contract.memo}
        </div>
      )}

      {/* 총 금액 */}
      <div className="tutor-card-price">
        <span>총 금액:</span>
        {displayPaymentStatus === 'PENDING' && editPrice ? (
          <>
            <input
              type="number"
              className="price-edit-input"
              value={priceInput}
              min={0}
              onChange={(e) => setPriceInput(Number(e.target.value))}
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="price-save-btn"
              onClick={(e) => {
                e.stopPropagation();
                handlePriceSave();
              }}
            >
              저장
            </button>
            <button
              className="price-cancel-btn"
              onClick={(e) => {
                e.stopPropagation();
                setEditPrice(false);
                setPriceInput(displayPrice);
              }}
            >
              취소
            </button>
          </>
        ) : (
          <>
            <span>{displayPrice.toLocaleString()}원</span>
            {displayPaymentStatus === 'PENDING' && (
              <button
                className="price-edit-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditPrice(true);
                }}
              >
                수정
              </button>
            )}
          </>
        )}
      </div>

      {/* 결제 상태 알림 */}
      {displayPaymentStatus && (
        <PaymentStatusAlert paymentStatus={displayPaymentStatus} onConfirm={handlePaymentConfirm} />
      )}

      {/* 체험 레슨 대기 중 - 후보 확인 버튼 */}
      {contract.contractType.code === 'TRIAL' &&
        contract.contractStatus.code === 'REQUESTED' &&
        contract.trialCandidates &&
        contract.trialCandidates.length > 0 && (
          <div className="trial-candidate-btn-wrap">
            <button
              className="ui-btn ui-btn--primary"
              style={{ width: '100%' }}
              onClick={(e) => {
                e.stopPropagation();
                setShowTrialModal(true);
              }}
            >
              체험 레슨 후보 시간 확인하기
            </button>
          </div>
        )}

      {/* 체험 레슨 확정됨 */}
      {contract.contractType.code === 'TRIAL' &&
        contract.contractStatus.code === 'ACTIVE' &&
        contract.selectedCandidateDate && (
          <div className="trial-confirmed-box">
            <div className="trial-confirmed-title">✅ 체험 레슨 확정</div>
            <div className="trial-confirmed-date">
              {formatDisplayDate(contract.selectedCandidateDate, contract.selectedCandidateTime)}
            </div>
          </div>
        )}

      {/* 모달 */}
      {showTrialModal && contract.trialCandidates && (
        <Modal open={showTrialModal} onClose={() => setShowTrialModal(false)}>
          <TrialCandidateList
            candidates={contract.trialCandidates}
            onConfirm={handleTrialConfirm}
            onReject={handleTrialReject}
            onClose={() => setShowTrialModal(false)}
          />
        </Modal>
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
