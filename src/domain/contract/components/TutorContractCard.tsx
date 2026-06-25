import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale/ko';
import Chip from '@/shared/components/Chip';
import Modal from '@/shared/components/Modal';
import { toAmPmFormat } from '@/domain/dayTime/lib/timeUtils';
import { useToast } from '@/shared/contexts/ToastContext';
import { useAlert } from '@/shared/contexts/AlertContext';
import TrialCandidateList from './TrialCandidateList';
import PaymentStatusAlert from './PaymentStatusAlert';
import { confirmTrialContract, rejectTrialContract } from '../api/trialContractApi';
import type { Contract, ContractStatusCode, PaymentStatusCode } from '../types/contract';
import { CONTRACT_STATUS_TRANSITIONS, getStatusLabel } from '../types/contract';
import { UnwrittenLessonLogList } from '@/domain/lesson/components/UnwrittenLessonLogList';
import '../css/my-tutors.css';
import '../css/my-students-stats.css';

const ACCENT_COLORS = ['#4F59D6', '#6B4EFF', '#0075FF', '#00B386', '#FF6B35', '#F7A300', '#F04452'];
function getAvatarColor(name: string): string {
  return ACCENT_COLORS[name.charCodeAt(0) % ACCENT_COLORS.length];
}

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

  const { showToast } = useToast();
  const { showAlert } = useAlert();

  const displayPrice = contract.totalPrice || 0;

  // 체험 레슨 모달 상태
  const [showTrialModal, setShowTrialModal] = useState(false);

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
      showAlert({
        title: '확정할 수 없어요',
        message: error?.message || '체험 레슨 확정에 실패했습니다.',
      });
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
      showAlert({
        title: alternatives && alternatives.length > 0 ? '대안 제안에 실패했어요' : '거절에 실패했어요',
        message: error?.message || '처리 중 오류가 발생했습니다.',
      });
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

  const displayPaymentStatus = contract.paymentStatus?.code;

  const isTrial =
    contract.contractType?.code === 'TRIAL' ||
    (contract.contractType as unknown as string) === 'TRIAL';
  const isTrialPendingSelection =
    isTrial && !contract.selectedCandidateDate && (contract.trialCandidates?.length ?? 0) > 0;
  const isEnded = ['CANCELLED', 'TERMINATED', 'END'].includes(contract.contractStatus.code);
  const placeText = contract.place?.trim() ? contract.place : '장소 미정';
  const levelText = contract.level?.trim() ? contract.level : null;
  const emergencyText = contract.emergencyContact?.trim() ? contract.emergencyContact : '-';

  // 아바타 색상
  const avatarColor = getAvatarColor(contract.studentName);
  const avatarName = contract.studentName.slice(0, 2);

  // 진행률 도트 (총 레슨 수 기준, 최대 10개 표시)
  const totalDots = Math.min(contract.lessonCount || 0, 10);
  const filledDots = Math.min(contract.currentLessonCount || 0, totalDots);

  const cardClassName = [
    'tutor-card',
    isTrial ? 'contract-card--trial' : '',
    isEnded ? 'contract-card--ended' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cardClassName} onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <div className="tutor-card-header">
        {/* 컬러 아바타 */}
        <div
          className="contract-card-avatar"
          style={{ background: avatarColor + '22', color: avatarColor }}
        >
          {avatarName}
        </div>

        <div className="tutor-card-content">
          <div className="tutor-card-title-row">
            <h3 className="tutor-card-title">
              {contract.studentName} 학생
            </h3>
            <Chip label={contract.contractStatus.label} />
          </div>
          <p className="tutor-card-location">
            {contract.lessonName}
            {levelText && (
              <span
                style={{
                  marginLeft: 6,
                  fontSize: 11,
                  fontWeight: 600,
                  padding: '2px 6px',
                  borderRadius: 4,
                  background: avatarColor + '22',
                  color: avatarColor,
                }}
              >
                {levelText}
              </span>
            )}
          </p>
          <p className="tutor-card-location" style={{ marginTop: 2 }}>
            {placeText}
          </p>
        </div>

        {/* 수강료 */}
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <span className="contract-card-price-amount">
            {displayPrice.toLocaleString()}원
          </span>
        </div>
      </div>

      {/* 컴팩트 정보 */}
      <div className="contract-card-meta">
        <span className="contract-card-meta__item">
          📍 {placeText}
        </span>
        {!isTrial && contract.scheduleList.length > 0 && (
          <span className="contract-card-meta__item">
            📅 매주{' '}
            {contract.scheduleList
              .map((s) => `${s.dayOfWeek}요일 ${toAmPmFormat(s.startTime)}`)
              .join(', ')}
          </span>
        )}
        {!isTrial && contract.lessonCount > 0 && (
          <span className="contract-card-meta__item">
            이번달 {contract.currentLessonCount}/{contract.lessonCount}회
          </span>
        )}
      </div>

      {/* 진행률 도트 (ACTIVE이고 레슨 횟수 있을 때만) */}
      {contract.contractStatus.code === 'ACTIVE' && totalDots > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: 12, color: 'var(--text-tertiary)', flexShrink: 0 }}>
            {contract.currentLessonCount}/{contract.lessonCount}회
          </span>
          <div className="progress-dots">
            {Array.from({ length: totalDots }).map((_, i) => (
              <div
                key={i}
                className={`progress-dot${i < filledDots ? ' progress-dot--filled' : ''}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* 체험 레슨 CTA (ACTIVE 상태이고 날짜가 확정된 체험 레슨) */}
      {isTrial && contract.contractStatus.code === 'ACTIVE' && (
        <div style={{ marginBottom: 8 }}>
          <button
            className="trial-cta-btn"
            onClick={(e) => {
              e.stopPropagation();
              // TODO: 정식 등록 제안 모달
            }}
          >
            정식 등록 제안 →
          </button>
        </div>
      )}

      {/* 결제 상태 알림 */}
      {displayPaymentStatus && (
        <PaymentStatusAlert paymentStatus={displayPaymentStatus} onConfirm={handlePaymentConfirm} />
      )}

      {/* 체험 레슨 후보 시간 - 날짜 선택 전(REQUESTED/APPROVED 모두) 인라인 노출 */}
      {isTrialPendingSelection && (
        <div className="trial-candidates-inline">
          <div className="trial-candidates-title">
            학생이 제안한 시간 (최대 3개) — 확정할 시간을 선택해주세요
          </div>
          <div className="trial-candidates-list">
            {contract.trialCandidates!.map((c) => {
              const unavailable = c.isAvailable === false;
              return (
                <div
                  key={c.id}
                  className={`trial-candidate-row${unavailable ? ' is-unavailable' : ''}`}
                >
                  <div className="trial-candidate-info">
                    <span className="trial-candidate-priority">{c.priority}순위</span>
                    <span className="trial-candidate-datetime">
                      {formatDisplayDate(c.candidateDate)} {c.candidateStartTime}
                    </span>
                    {unavailable && (
                      <span className="trial-candidate-badge trial-candidate-badge--no">
                        불가
                      </span>
                    )}
                    {c.isAvailable === true && (
                      <span className="trial-candidate-badge trial-candidate-badge--ok">
                        가능
                      </span>
                    )}
                  </div>
                  <button
                    className="trial-candidate-confirm-btn"
                    disabled={unavailable}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (unavailable) {
                        showAlert({
                          title: '확정할 수 없어요',
                          message:
                            '이 시간은 튜터님의 가능 시간대를 벗어나 확정할 수 없어요. 다른 후보를 선택하거나 대안 시간을 제안해주세요.',
                        });
                        return;
                      }
                      handleTrialConfirm(c.candidateDate, c.candidateStartTime);
                    }}
                  >
                    이 시간 확정
                  </button>
                </div>
              );
            })}
          </div>
          <button
            className="trial-candidate-reject-btn"
            onClick={(e) => {
              e.stopPropagation();
              setShowTrialModal(true);
            }}
          >
            거절 / 대안 시간 제안하기
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

      {contract.contractStatus.code === 'ACTIVE' && (
        <UnwrittenLessonLogList
          contractNo={contract.contractNo}
          studentName={contract.studentName}
          lessonName={contract.lessonName}
        />
      )}

      {(() => {
        // 체험레슨이 날짜 미선택 상태면 승인/진행중 전이를 숨기고 CANCEL만 노출
        const transitions = isTrialPendingSelection
          ? availableTransitions.filter((s) => s === 'CANCELLED')
          : availableTransitions;
        if (transitions.length === 0) return null;

        const isPendingStatus =
          contract.contractStatus.code === 'REQUESTED' ||
          contract.contractStatus.code === 'APPROVED';

        return (
          <div className="tutor-card-actions">
            {transitions.map((status) => {
              const isAccept = status === 'ACTIVE' || status === 'APPROVED';
              const isReject = status === 'CANCELLED' || status === 'TERMINATED';
              const btnStyle: React.CSSProperties =
                isPendingStatus && isAccept
                  ? {
                      background: 'var(--color-primary)',
                      color: '#fff',
                      border: '1px solid var(--color-primary)',
                      fontWeight: 700,
                    }
                  : isPendingStatus && isReject
                    ? {
                        background: '#fff',
                        color: '#F04452',
                        border: '1px solid #F04452',
                      }
                    : {};
              return (
                <button
                  key={status}
                  className="status-change-btn"
                  style={btnStyle}
                  onClick={() => handleStatusChange(status)}
                >
                  {getStatusLabel(status)}
                </button>
              );
            })}
          </div>
        );
      })()}
    </div>
  );
}
