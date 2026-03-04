import { useState } from 'react';
import Header from '@/shared/components/Header';
import Button from '@/shared/components/Button';
import LessonCalendarPicker from '@/domain/lesson/components/LessonCalendarPicker';
import ContractRequestStepFooter from './ContractRequestStepFooter';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale/ko';

interface TrialCandidate {
  priority: number;
  candidateDate: string;
  candidateStartTime: string;
}

interface TrialCandidateSelectorProps {
  tutorProfileNo: string;
  candidates: TrialCandidate[];
  onChange: (candidates: TrialCandidate[]) => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function TrialCandidateSelector({
  tutorProfileNo,
  candidates,
  onChange,
  onPrev,
  onNext,
}: TrialCandidateSelectorProps) {
  const [tempDate, setTempDate] = useState('');
  const [tempTime, setTempTime] = useState('');
  const [lastSelectedDate, setLastSelectedDate] = useState(''); // 마지막 선택된 날짜 추적

  const handleAddCandidate = (date: string, time: string) => {
    if (!date || !time) return;
    if (candidates.length >= 3) return;

    // 중복 체크
    if (candidates.some((c) => c.candidateDate === date && c.candidateStartTime === time)) {
      alert('이미 선택한 시간입니다.');
      return;
    }

    const newCandidate: TrialCandidate = {
      priority: candidates.length + 1,
      candidateDate: date,
      candidateStartTime: time,
    };

    onChange([...candidates, newCandidate]);
    // 날짜는 유지하고 시간만 초기화
    // setTempDate(''); // 제거: 날짜 유지
    setTempTime('');
    setLastSelectedDate(date); // 마지막 선택 날짜 기록
  };

  const handleRemoveCandidate = (priority: number) => {
    const updated = candidates
      .filter((c) => c.priority !== priority)
      .map((c, index) => ({ ...c, priority: index + 1 }));
    onChange(updated);
  };

  const formatDisplayDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr + 'T00:00:00');
      return format(date, 'M월 d일 (E)', { locale: ko });
    } catch {
      return dateStr;
    }
  };

  return (
    <div>
      <Header
        title="체험 레슨 가능 시간 선택"
        subtitle="원하시는 체험 레슨 시간을 1~3개 선택해주세요 (우선순위 순)"
      />

      {/* 후보 추가 UI - LessonCalendarPicker 사용 */}
      {candidates.length < 3 && (
        <div style={{ marginBottom: 24 }}>
          <LessonCalendarPicker
            tutorProfileNo={Number(tutorProfileNo)}
            startDate={new Date().toISOString().split('T')[0]}
            endDate={(() => {
              const today = new Date();
              const monthEnd = new Date(today.getFullYear(), today.getMonth() + 2, 0);
              return monthEnd.toISOString().split('T')[0];
            })()}
            date={tempDate}
            time={tempTime}
            onChange={(date, time) => {
              // 날짜가 변경된 경우 (이전 날짜와 다른 경우)
              if (date !== tempDate) {
                setTempDate(date);
                setTempTime(''); // 새 날짜 선택 시 시간 반드시 초기화
                return;
              }
              // 같은 날짜에서 시간 선택한 경우만 등록
              // (날짜만 바뀌고 time이 이전 값으로 들어오는 경우 방지)
              if (date && time && date === lastSelectedDate && time !== tempTime) {
                // 같은 날짜의 다른 시간 선택
                handleAddCandidate(date, time);
              } else if (date && time && date !== lastSelectedDate) {
                // 다른 날짜의 시간 선택
                handleAddCandidate(date, time);
              }
            }}
            size="small"
            disabledSlots={candidates.map((c) => ({
              date: c.candidateDate,
              time: c.candidateStartTime,
            }))}
          />
        </div>
      )}

      {/* 선택된 후보 시간 목록 */}
      {candidates.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          {candidates.map((candidate) => (
            <div
              key={candidate.priority}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                backgroundColor: '#f8f9fa',
                borderRadius: 8,
                marginBottom: 8,
              }}
            >
              <div>
                <span style={{ fontWeight: 600, marginRight: 8 }}>
                  {candidate.priority}순위
                </span>
                <span>
                  {formatDisplayDate(candidate.candidateDate)} {candidate.candidateStartTime}
                </span>
              </div>
              <Button
                className="ui-btn--outlined"
                size="sm"
                onClick={() => handleRemoveCandidate(candidate.priority)}
              >
                삭제
              </Button>
            </div>
          ))}
        </div>
      )}

      {candidates.length > 0 && (
        <div
          style={{
            padding: 12,
            backgroundColor: '#e3f2fd',
            borderRadius: 8,
            fontSize: 13,
            color: '#1976d2',
            marginBottom: 24,
          }}
        >
          💡 튜터가 가능한 시간을 확인하고 최종 확정합니다
        </div>
      )}

      <ContractRequestStepFooter
        onPrev={onPrev}
        onNext={onNext}
        nextDisabled={candidates.length === 0}
        nextLabel="다음"
        prevLabel="이전"
      />
    </div>
  );
}
