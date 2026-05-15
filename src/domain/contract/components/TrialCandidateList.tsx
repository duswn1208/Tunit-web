import { useState } from 'react';
import Button from '@/shared/components/Button';
import AlternativeTimeSelector from './AlternativeTimeSelector';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale/ko';
import type { CandidateTimeInfo } from '../types/contract';
import './css/trial-candidate-list.css';

interface TrialCandidateListProps {
  candidates: CandidateTimeInfo[];
  onConfirm: (date: string, time: string) => void;
  onReject: (
    reason: string,
    alternatives?: Array<{ proposedDate: string; proposedStartTime: string }>,
  ) => void;
  onClose: () => void;
}

export default function TrialCandidateList({
  candidates,
  onConfirm,
  onReject,
  onClose,
}: TrialCandidateListProps) {
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateTimeInfo | null>(null);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [alternativeTimes, setAlternativeTimes] = useState<
    Array<{ proposedDate: string; proposedStartTime: string }>
  >([]);

  const handleConfirm = () => {
    if (!selectedCandidate) return;
    onConfirm(selectedCandidate.candidateDate, selectedCandidate.candidateStartTime);
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      alert('거절 사유를 입력해주세요');
      return;
    }
    onReject(rejectReason, alternativeTimes.length > 0 ? alternativeTimes : undefined);
  };

  const formatDisplayDate = (dateStr: string, timeStr: string) => {
    try {
      const dateObj = new Date(dateStr + 'T' + timeStr);
      return format(dateObj, 'M월 d일 (E) HH:mm', { locale: ko });
    } catch {
      return `${dateStr} ${timeStr}`;
    }
  };

  return (
    <div className="trial-modal">
      <div className="trial-modal-header">
        <h3 className="trial-modal-title">학생이 제안한 후보 시간</h3>
        <button type="button" className="trial-modal-close" onClick={onClose} aria-label="닫기">
          ×
        </button>
      </div>

      {!showRejectForm && (
        <>
          <p className="trial-modal-helper">확정할 시간을 선택해주세요</p>
          <div className="trial-modal-candidates">
            {candidates
              .slice()
              .sort((a, b) => a.priority - b.priority)
              .map((candidate) => {
                const isSelected = selectedCandidate?.id === candidate.id;
                const isUnavailable = candidate.isAvailable === false;
                return (
                  <button
                    type="button"
                    key={candidate.id}
                    onClick={() => !isUnavailable && setSelectedCandidate(candidate)}
                    disabled={isUnavailable}
                    className={`trial-modal-candidate${isSelected ? ' is-selected' : ''}${
                      isUnavailable ? ' is-unavailable' : ''
                    }`}
                  >
                    <div className="trial-modal-candidate-main">
                      <span className="trial-modal-priority">{candidate.priority}순위</span>
                      <span className="trial-modal-datetime">
                        {formatDisplayDate(candidate.candidateDate, candidate.candidateStartTime)}
                      </span>
                    </div>
                    {candidate.isAvailable === true && (
                      <span className="trial-modal-badge trial-modal-badge--ok">가능</span>
                    )}
                    {candidate.isAvailable === false && (
                      <span className="trial-modal-badge trial-modal-badge--no">불가</span>
                    )}
                  </button>
                );
              })}
          </div>

          <div className="trial-modal-actions">
            <Button
              className="ui-btn--outlined"
              onClick={() => setShowRejectForm(true)}
              style={{ flex: 1 }}
            >
              거절 / 대안 제안
            </Button>
            <Button
              className="ui-btn--primary"
              onClick={handleConfirm}
              disabled={!selectedCandidate || selectedCandidate.isAvailable === false}
              style={{ flex: 1 }}
            >
              이 시간으로 확정
            </Button>
          </div>
        </>
      )}

      {showRejectForm && (
        <div className="trial-modal-reject">
          <h4 className="trial-modal-reject-title">거절 사유와 대안 시간을 알려주세요</h4>

          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="거절 사유를 입력해주세요"
            className="trial-modal-textarea"
          />

          <AlternativeTimeSelector
            alternatives={alternativeTimes}
            onChange={setAlternativeTimes}
          />

          <div className="trial-modal-actions">
            <Button
              className="ui-btn--outlined"
              onClick={() => {
                setShowRejectForm(false);
                setRejectReason('');
                setAlternativeTimes([]);
              }}
              style={{ flex: 1 }}
            >
              취소
            </Button>
            <Button className="ui-btn--primary" onClick={handleReject} style={{ flex: 1 }}>
              제출
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
