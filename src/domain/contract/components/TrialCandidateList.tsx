import { useState } from 'react';
import Button from '@/shared/components/Button';
import AlternativeTimeSelector from './AlternativeTimeSelector';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale/ko';
import type { CandidateTimeInfo } from '../types/contract';

interface TrialCandidateListProps {
  candidates: CandidateTimeInfo[];
  onConfirm: (date: string, time: string) => void;
  onReject: (reason: string, alternatives?: Array<{ proposedDate: string; proposedStartTime: string }>) => void;
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
    <div style={{ padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>
          학생이 제안한 후보 시간
        </h3>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: 24,
            cursor: 'pointer',
            padding: 0,
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ×
        </button>
      </div>

      {/* 후보 시간 목록 */}
      <div style={{ marginBottom: 24 }}>
        {candidates
          .sort((a, b) => a.priority - b.priority)
          .map((candidate) => (
            <div
              key={candidate.id}
              onClick={() => setSelectedCandidate(candidate)}
              style={{
                padding: 16,
                backgroundColor: selectedCandidate?.id === candidate.id ? '#e3f2fd' : '#f8f9fa',
                border: selectedCandidate?.id === candidate.id ? '2px solid #1976d2' : '1px solid #ddd',
                borderRadius: 8,
                marginBottom: 12,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 13, color: '#666', marginBottom: 4 }}>
                    {candidate.priority}순위
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 500 }}>
                    {formatDisplayDate(candidate.candidateDate, candidate.candidateStartTime)}
                  </div>
                </div>

                {candidate.isAvailable === true && (
                  <span
                    style={{
                      padding: '4px 12px',
                      backgroundColor: '#4caf50',
                      color: 'white',
                      borderRadius: 12,
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    가능
                  </span>
                )}
                {candidate.isAvailable === false && (
                  <span
                    style={{
                      padding: '4px 12px',
                      backgroundColor: '#f44336',
                      color: 'white',
                      borderRadius: 12,
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    불가
                  </span>
                )}
              </div>
            </div>
          ))}
      </div>

      {/* 액션 버튼 */}
      {!showRejectForm && (
        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          <Button
            className="ui-btn--primary"
            onClick={handleConfirm}
            disabled={!selectedCandidate || selectedCandidate.isAvailable === false}
            style={{ flex: 1 }}
          >
            이 시간으로 확정
          </Button>
          <Button
            className="ui-btn--outlined"
            onClick={() => setShowRejectForm(true)}
            style={{ flex: 1 }}
          >
            거절/대안 제안
          </Button>
        </div>
      )}

      {/* 거절 폼 */}
      {showRejectForm && (
        <div
          style={{
            padding: 16,
            backgroundColor: '#fff3e0',
            borderRadius: 8,
            border: '1px solid #ffb74d',
          }}
        >
          <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>
            거절 사유 및 대안 제안
          </h4>

          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="거절 사유를 입력해주세요"
            style={{
              width: '100%',
              minHeight: 80,
              padding: 12,
              borderRadius: 8,
              border: '1px solid #ddd',
              fontSize: 14,
              marginBottom: 16,
              resize: 'vertical',
            }}
          />

          <AlternativeTimeSelector
            alternatives={alternativeTimes}
            onChange={setAlternativeTimes}
          />

          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
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
            <Button
              className="ui-btn--primary"
              onClick={handleReject}
              style={{ flex: 1 }}
            >
              제출
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
