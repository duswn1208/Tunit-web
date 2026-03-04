# 체험 레슨 후보 시간 선택 기능 - 프론트엔드 구현 가이드

> **목표:** 백엔드에서 구현된 체험 레슨 후보 시간 선택 기능을 프론트엔드에 적용

---

## 📋 구현 Phase

---

## 🔴 **Phase 1: Types 확장 (1일차)**

### 1.1 Contract 타입 확장

**파일:** `src/domain/contract/types/contract.ts` (수정)

```typescript
// 기존 Contract 인터페이스에 추가
export interface Contract {
  // ... 기존 필드들 ...
  
  // 체험 레슨 관련 추가
  trialCandidates?: CandidateTimeInfo[];
  tutorProposals?: ProposalTimeInfo[];
  selectedCandidateDate?: string; // YYYY-MM-DD
  selectedCandidateTime?: string; // HH:mm
}

// 후보 시간 정보
export interface CandidateTimeInfo {
  id: number;
  priority: number; // 1, 2, 3
  candidateDate: string; // YYYY-MM-DD
  candidateStartTime: string; // HH:mm
  isAvailable: boolean | null; // null: 미확인, true: 가능, false: 불가
}

// 튜터 제안 시간 정보
export interface ProposalTimeInfo {
  id: number;
  proposedDate: string; // YYYY-MM-DD
  proposedStartTime: string; // HH:mm
  isAccepted: boolean | null; // null: 대기, true: 수락, false: 거절
}
```

### 1.2 Booking Types 확장

**파일:** `src/domain/booking/types/types.ts` (수정)

```typescript
// 기존 타입에 추가
export interface TrialCandidateTime {
  priority: number; // 1, 2, 3
  candidateDate: string; // YYYY-MM-DD
  candidateStartTime: string; // HH:mm
}

export interface ContractRequestDto {
  tutorProfileNo: string;
  contractType: ContractType;
  lessonCategory: string;
  place?: string;
  weekCount: number;
  lessonCount: number;
  lessonDtList: string[];
  level?: string;
  memo?: string;
  emergencyContact?: string;
  totalPrice: number;
  
  // 체험 레슨용 추가
  trialCandidates?: TrialCandidateTime[];
}
```

---

## 🟡 **Phase 2: API 함수 추가 (1일차)**

### 2.1 체험 레슨 API 추가

**파일:** `src/domain/contract/api/trialContractApi.ts` (신규)

```typescript
import { api } from '@/shared/lib/api';
import type { Contract } from '../types/contract';

// 체험 레슨 계약 생성 (학생)
export interface TrialContractCreateDto {
  tutorProfileNo: number;
  contractType: 'TRIAL';
  lessonCategory: string;
  place?: string;
  level?: string;
  memo?: string;
  emergencyContact?: string;
  totalPrice: number;
  trialCandidates: Array<{
    priority: number;
    candidateDate: string; // YYYY-MM-DD
    candidateStartTime: string; // HH:mm
  }>;
}

export async function createTrialContract(data: TrialContractCreateDto): Promise<Contract> {
  return api.post('/api/contracts/trial', data);
}

// 튜터가 후보 시간 확정
export interface TrialConfirmDto {
  selectedDate: string; // YYYY-MM-DD
  selectedStartTime: string; // HH:mm
}

export async function confirmTrialContract(
  contractNo: number,
  data: TrialConfirmDto
): Promise<Contract> {
  return api.post(`/api/contracts/${contractNo}/trial/confirm`, data);
}

// 튜터가 거절 (대안 제안 가능)
export interface TrialRejectDto {
  reason: string;
  alternativeTimes?: Array<{
    proposedDate: string; // YYYY-MM-DD
    proposedStartTime: string; // HH:mm
  }>;
}

export async function rejectTrialContract(
  contractNo: number,
  data: TrialRejectDto
): Promise<Contract> {
  return api.post(`/api/contracts/${contractNo}/trial/reject`, data);
}

// 학생이 튜터 제안 시간 수락
export async function acceptTutorProposal(
  contractNo: number,
  proposalId: number
): Promise<Contract> {
  return api.post(`/api/contracts/${contractNo}/trial/accept-proposal/${proposalId}`, {});
}
```

### 2.2 기존 API 수정

**파일:** `src/domain/booking/api/lessonBookingApi.ts` (수정)

```typescript
export interface ContractRequestDto {
  tutorProfileNo: string;
  contractType: ContractType;
  lessonCategory: string;
  place?: string;
  weekCount: number;
  lessonCount: number;
  lessonDtList: string[];
  level?: string;
  memo?: string;
  emergencyContact?: string;
  totalPrice: number;
  
  // 체험 레슨용 추가
  trialCandidates?: Array<{
    priority: number;
    candidateDate: string;
    candidateStartTime: string;
  }>;
}
```

---

## 🟠 **Phase 3: 학생 - 체험 레슨 신청 (2일차)**

### 3.1 후보 시간 선택 컴포넌트 (신규)

**파일:** `src/domain/booking/components/TrialCandidateSelector.tsx` (신규)

```tsx
import { useState } from 'react';
import Header from '@/shared/components/Header';
import Button from '@/shared/components/Button';
import { Calendar } from '@/shared/components/Calendar';
import { formatDate } from '@/shared/lib/dateUtils';

interface TrialCandidate {
  priority: number;
  candidateDate: string;
  candidateStartTime: string;
}

interface TrialCandidateSelectorProps {
  candidates: TrialCandidate[];
  onChange: (candidates: TrialCandidate[]) => void;
}

export default function TrialCandidateSelector({
  candidates,
  onChange,
}: TrialCandidateSelectorProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState('');

  const timeOptions = [
    '09:00', '10:00', '11:00', '12:00', 
    '13:00', '14:00', '15:00', '16:00', 
    '17:00', '18:00', '19:00', '20:00'
  ];

  const handleAddCandidate = () => {
    if (!selectedDate || !selectedTime) return;
    if (candidates.length >= 3) return;

    const newCandidate: TrialCandidate = {
      priority: candidates.length + 1,
      candidateDate: formatDate(selectedDate, 'yyyy-MM-dd'),
      candidateStartTime: selectedTime,
    };

    onChange([...candidates, newCandidate]);
    setSelectedDate(null);
    setSelectedTime('');
  };

  const handleRemoveCandidate = (priority: number) => {
    const updated = candidates
      .filter((c) => c.priority !== priority)
      .map((c, index) => ({ ...c, priority: index + 1 }));
    onChange(updated);
  };

  return (
    <div>
      <Header 
        title="체험 레슨 가능 시간 선택" 
        subtitle="원하시는 체험 레슨 시간을 1~3개 선택해주세요 (우선순위 순)" 
      />

      {/* 선택된 후보 시간 목록 */}
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
                {formatDate(new Date(candidate.candidateDate), 'M월 d일')} {candidate.candidateStartTime}
              </span>
            </div>
            <Button
              variant="outline"
              size="small"
              onClick={() => handleRemoveCandidate(candidate.priority)}
            >
              삭제
            </Button>
          </div>
        ))}
      </div>

      {/* 후보 추가 UI */}
      {candidates.length < 3 && (
        <div style={{ marginBottom: 24 }}>
          <Calendar
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            minDate={new Date()}
          />

          <div style={{ marginTop: 16 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
              시작 시간
            </label>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              style={{
                width: '100%',
                padding: 12,
                borderRadius: 8,
                border: '1px solid #ddd',
                fontSize: 15,
              }}
            >
              <option value="">시간 선택</option>
              {timeOptions.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          <Button
            variant="secondary"
            fullWidth
            onClick={handleAddCandidate}
            disabled={!selectedDate || !selectedTime}
            style={{ marginTop: 16 }}
          >
            {candidates.length === 0 ? '1순위' : `${candidates.length + 1}순위`} 시간 추가
          </Button>
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
          }}
        >
          💡 튜터가 가능한 시간을 확인하고 최종 확정합니다
        </div>
      )}
    </div>
  );
}
```

### 3.2 ContractRequestForm 수정

**파일:** `src/domain/booking/pages/ContractRequestForm.tsx` (수정)

```typescript
// 기존 import에 추가
import TrialCandidateSelector from '../components/TrialCandidateSelector';
import { createTrialContract } from '@/domain/contract/api/trialContractApi';
import { isTrial } from '../types/types';

export default function ContractRequestForm({
  // ... 기존 props
}) {
  // ... 기존 state들
  
  // 체험 레슨용 후보 시간 state 추가
  const [trialCandidates, setTrialCandidates] = useState<
    Array<{
      priority: number;
      candidateDate: string;
      candidateStartTime: string;
    }>
  >([]);

  // Step 2에서 체험 레슨인 경우 후보 시간 선택 UI로 변경
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ContractRequestStep1
            lessonCategory={lessonCategory}
            setLessonCategory={setLessonCategory}
            place={place}
            setPlace={setPlace}
            lessonCategoryOptions={lessonCategoryOptions}
            weekCount={weekCount}
            setWeekCount={setWeekCount}
            contractType={contractType}
            onNext={handleNext}
            onFirst={onFirst}
          />
        );
      case 2:
        // 체험 레슨인 경우 후보 시간 선택
        if (isTrial(contractType)) {
          return (
            <div>
              <TrialCandidateSelector
                candidates={trialCandidates}
                onChange={setTrialCandidates}
              />
              <ContractRequestStepFooter
                onPrev={handlePrev}
                onNext={handleNext}
                nextDisabled={trialCandidates.length === 0}
                nextLabel="다음"
                prevLabel="이전"
              />
            </div>
          );
        }
        
        // 기존 날짜 선택 UI
        return (
          <ContractRequestStep2
            // ... 기존 props
          />
        );
      case 3:
        return (
          <ContractRequestStep3
            level={level}
            setLevel={setLevel}
            memo={memo}
            setMemo={setMemo}
            emergencyContact={emergencyContact}
            setEmergencyContact={setEmergencyContact}
            onPrev={handlePrev}
            onSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  const handleSubmit = async () => {
    try {
      // 체험 레슨인 경우
      if (isTrial(contractType)) {
        await createTrialContract({
          tutorProfileNo: Number(tutorProfileNo),
          contractType: 'TRIAL',
          lessonCategory: lessonCategory?.value || '',
          place,
          level,
          memo,
          emergencyContact,
          totalPrice: pricePerLesson,
          trialCandidates: trialCandidates,
        });
        
        showToast('체험 레슨이 신청되었습니다. 튜터의 확인을 기다려주세요.');
        navigate('/student/contracts');
        return;
      }
      
      // 기존 정규/선착순 레슨 처리
      // ...
    } catch (error) {
      showToast('계약 신청에 실패했습니다.', 'error');
    }
  };

  return (
    <OnboardingLayout
      step={currentStep}
      total={total}
      title={title}
      subtitle={subtitle}
    >
      {renderStep()}
    </OnboardingLayout>
  );
}
```

---

## 🟢 **Phase 3: 학생 - 튜터 제안 확인/수락 (2일차)**

### 3.1 튜터 제안 시간 확인 컴포넌트

**파일:** `src/domain/contract/components/TutorProposalCard.tsx` (신규)

```tsx
import Button from '@/shared/components/Button';
import { formatDate } from '@/shared/lib/dateUtils';
import type { ProposalTimeInfo } from '../types/contract';

interface TutorProposalCardProps {
  proposal: ProposalTimeInfo;
  onAccept: (proposalId: number) => void;
}

export default function TutorProposalCard({ proposal, onAccept }: TutorProposalCardProps) {
  const dateObj = new Date(proposal.proposedDate + 'T' + proposal.proposedStartTime);

  return (
    <div
      style={{
        padding: 16,
        backgroundColor: '#fff3e0',
        borderRadius: 8,
        border: '1px solid #ffb74d',
        marginBottom: 12,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>
            {formatDate(dateObj, 'M월 d일 (E) a h:mm')}
          </div>
          <div style={{ fontSize: 13, color: '#666' }}>
            튜터가 제안한 시간입니다
          </div>
        </div>
        <Button
          variant="primary"
          size="small"
          onClick={() => onAccept(proposal.id)}
        >
          수락
        </Button>
      </div>
    </div>
  );
}
```

### 3.2 StudentContractCard 수정

**파일:** `src/domain/contract/components/StudentContractCard.tsx` (수정)

```tsx
// import 추가
import TutorProposalCard from './TutorProposalCard';
import { acceptTutorProposal } from '../api/trialContractApi';
import { useToast } from '@/shared/contexts/ToastContext';

export default function StudentContractCard({
  contract,
  onPaymentRequest,
  onStatusChange,
}: StudentContractCardProps) {
  const { showToast } = useToast();
  
  // ... 기존 코드 ...

  // 튜터 제안 수락 핸들러
  const handleAcceptProposal = async (proposalId: number) => {
    try {
      await acceptTutorProposal(contract.contractNo, proposalId);
      showToast('체험 레슨이 확정되었습니다!');
      window.location.reload(); // 또는 상태 업데이트
    } catch (error: any) {
      showToast(error?.message || '제안 수락에 실패했습니다', 'error');
    }
  };

  return (
    <div className="tutor-card" onClick={handleCardClick}>
      {/* ... 기존 카드 헤더 ... */}

      {/* 체험 레슨 대기 중 - 튜터 제안이 있는 경우 */}
      {contract.contractType.code === 'TRIAL' && 
       contract.contractStatus.code === 'REQUESTED' &&
       contract.tutorProposals && 
       contract.tutorProposals.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>
            🎯 튜터가 제안한 시간
          </div>
          {contract.tutorProposals
            .filter(p => p.isAccepted === null)
            .map((proposal) => (
              <TutorProposalCard
                key={proposal.id}
                proposal={proposal}
                onAccept={handleAcceptProposal}
              />
            ))}
        </div>
      )}

      {/* 체험 레슨 대기 중 - 후보 시간 표시 */}
      {contract.contractType.code === 'TRIAL' && 
       contract.contractStatus.code === 'REQUESTED' &&
       contract.trialCandidates && 
       contract.trialCandidates.length > 0 &&
       (!contract.tutorProposals || contract.tutorProposals.length === 0) && (
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>
            ⏰ 제안한 후보 시간
          </div>
          {contract.trialCandidates.map((candidate) => (
            <div
              key={candidate.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                backgroundColor: '#f5f5f5',
                borderRadius: 6,
                marginBottom: 6,
                fontSize: 14,
              }}
            >
              <span>
                {candidate.priority}순위: {formatDate(new Date(candidate.candidateDate), 'M월 d일')} {candidate.candidateStartTime}
              </span>
              {candidate.isAvailable === true && (
                <span style={{ color: '#4caf50', fontSize: 12 }}>✓ 가능</span>
              )}
              {candidate.isAvailable === false && (
                <span style={{ color: '#f44336', fontSize: 12 }}>✗ 불가</span>
              )}
            </div>
          ))}
          <div style={{ fontSize: 13, color: '#666', marginTop: 8 }}>
            튜터가 확인 중입니다...
          </div>
        </div>
      )}

      {/* 체험 레슨 확정됨 */}
      {contract.contractType.code === 'TRIAL' && 
       contract.contractStatus.code === 'ACTIVE' &&
       contract.selectedCandidateDate && (
        <div style={{ marginTop: 16 }}>
          <div
            style={{
              padding: 16,
              backgroundColor: '#e8f5e9',
              borderRadius: 8,
              border: '1px solid #4caf50',
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 600, color: '#2e7d32', marginBottom: 4 }}>
              ✅ 체험 레슨 확정
            </div>
            <div style={{ fontSize: 15 }}>
              {formatDate(new Date(contract.selectedCandidateDate), 'M월 d일 (E)')} {contract.selectedCandidateTime}
            </div>
          </div>
        </div>
      )}

      {/* ... 기존 버튼들 ... */}
    </div>
  );
}
```

---

## 🔵 **Phase 4: 튜터 - 후보 확인/선택 (3일차)**

### 4.1 후보 시간 확인 컴포넌트

**파일:** `src/domain/contract/components/TrialCandidateList.tsx` (신규)

```tsx
import { useState } from 'react';
import Button from '@/shared/components/Button';
import { formatDate } from '@/shared/lib/dateUtils';
import type { CandidateTimeInfo } from '../types/contract';

interface TrialCandidateListProps {
  candidates: CandidateTimeInfo[];
  onConfirm: (date: string, time: string) => void;
  onReject: (reason: string, alternatives?: Array<{ proposedDate: string; proposedStartTime: string }>) => void;
}

export default function TrialCandidateList({
  candidates,
  onConfirm,
  onReject,
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

  return (
    <div style={{ padding: 16 }}>
      <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>
        학생이 제안한 후보 시간
      </h3>

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
                    {formatDate(new Date(candidate.candidateDate), 'M월 d일 (E)')} {candidate.candidateStartTime}
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
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <Button
          variant="primary"
          fullWidth
          onClick={handleConfirm}
          disabled={!selectedCandidate || selectedCandidate.isAvailable === false}
        >
          이 시간으로 확정
        </Button>
        <Button
          variant="outline"
          fullWidth
          onClick={() => setShowRejectForm(true)}
        >
          거절/대안 제안
        </Button>
      </div>

      {/* 거절 및 대안 제안 폼 */}
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
              marginBottom: 12,
            }}
          />

          <div style={{ fontSize: 13, color: '#666', marginBottom: 8 }}>
            💡 대안 시간을 제안할 수 있습니다 (선택사항)
          </div>

          {/* 대안 시간 입력 UI (간단 버전) */}
          {/* TODO: TrialCandidateSelector와 유사한 UI로 구현 */}

          <div style={{ display: 'flex', gap: 8 }}>
            <Button
              variant="secondary"
              fullWidth
              onClick={() => setShowRejectForm(false)}
            >
              취소
            </Button>
            <Button
              variant="primary"
              fullWidth
              onClick={handleReject}
            >
              제출
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
```

### 4.2 TutorContractCard 수정

**파일:** `src/domain/contract/components/TutorContractCard.tsx` (수정)

```tsx
// import 추가
import TrialCandidateList from './TrialCandidateList';
import { confirmTrialContract, rejectTrialContract } from '../api/trialContractApi';
import { useToast } from '@/shared/contexts/ToastContext';
import { useState } from 'react';

export default function TutorContractCard({
  contract,
  onStatusChange,
  onPaymentConfirm,
}: TutorContractCardProps) {
  const { showToast } = useToast();
  const [showTrialModal, setShowTrialModal] = useState(false);

  // 체험 레슨 확정 핸들러
  const handleTrialConfirm = async (date: string, time: string) => {
    try {
      await confirmTrialContract(contract.contractNo, {
        selectedDate: date,
        selectedStartTime: time,
      });
      showToast('체험 레슨이 확정되었습니다!');
      window.location.reload();
    } catch (error: any) {
      showToast(error?.message || '확정에 실패했습니다', 'error');
    }
  };

  // 체험 레슨 거절 핸들러
  const handleTrialReject = async (
    reason: string,
    alternatives?: Array<{ proposedDate: string; proposedStartTime: string }>
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
      window.location.reload();
    } catch (error: any) {
      showToast(error?.message || '처리에 실패했습니다', 'error');
    }
  };

  return (
    <div className="tutor-card" onClick={handleCardClick}>
      {/* ... 기존 카드 헤더 ... */}

      {/* 체험 레슨 대기 중 - 후보 확인 버튼 */}
      {contract.contractType.code === 'TRIAL' && 
       contract.contractStatus.code === 'REQUESTED' &&
       contract.trialCandidates && 
       contract.trialCandidates.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <Button
            variant="primary"
            fullWidth
            onClick={(e) => {
              e.stopPropagation();
              setShowTrialModal(true);
            }}
          >
            체험 레슨 후보 시간 확인하기
          </Button>
        </div>
      )}

      {/* 체험 레슨 확정됨 */}
      {contract.contractType.code === 'TRIAL' && 
       contract.contractStatus.code === 'ACTIVE' &&
       contract.selectedCandidateDate && (
        <div
          style={{
            marginTop: 16,
            padding: 16,
            backgroundColor: '#e8f5e9',
            borderRadius: 8,
            border: '1px solid #4caf50',
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 600, color: '#2e7d32', marginBottom: 4 }}>
            ✅ 체험 레슨 확정
          </div>
          <div style={{ fontSize: 15 }}>
            {formatDate(new Date(contract.selectedCandidateDate), 'M월 d일 (E)')} {contract.selectedCandidateTime}
          </div>
        </div>
      )}

      {/* 모달 */}
      {showTrialModal && (
        <Modal onClose={() => setShowTrialModal(false)}>
          <TrialCandidateList
            candidates={contract.trialCandidates || []}
            onConfirm={handleTrialConfirm}
            onReject={handleTrialReject}
          />
        </Modal>
      )}

      {/* ... 기존 버튼들 ... */}
    </div>
  );
}
```

---

## 🟣 **Phase 5: 대안 시간 제안 UI (4일차)**

### 5.1 대안 시간 입력 컴포넌트

**파일:** `src/domain/contract/components/AlternativeTimeSelector.tsx` (신규)

```tsx
import { useState } from 'react';
import Button from '@/shared/components/Button';
import { Calendar } from '@/shared/components/Calendar';
import { formatDate } from '@/shared/lib/dateUtils';

interface AlternativeTime {
  proposedDate: string;
  proposedStartTime: string;
}

interface AlternativeTimeSelectorProps {
  alternatives: AlternativeTime[];
  onChange: (alternatives: AlternativeTime[]) => void;
}

export default function AlternativeTimeSelector({
  alternatives,
  onChange,
}: AlternativeTimeSelectorProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState('');

  const timeOptions = [
    '09:00', '10:00', '11:00', '12:00', 
    '13:00', '14:00', '15:00', '16:00', 
    '17:00', '18:00', '19:00', '20:00'
  ];

  const handleAdd = () => {
    if (!selectedDate || !selectedTime) return;
    if (alternatives.length >= 5) return;

    const newAlt: AlternativeTime = {
      proposedDate: formatDate(selectedDate, 'yyyy-MM-dd'),
      proposedStartTime: selectedTime,
    };

    onChange([...alternatives, newAlt]);
    setSelectedDate(null);
    setSelectedTime('');
  };

  const handleRemove = (index: number) => {
    onChange(alternatives.filter((_, i) => i !== index));
  };

  return (
    <div>
      <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>
        대안 시간 제안 (선택사항, 최대 5개)
      </h4>

      {/* 선택된 대안 시간 목록 */}
      {alternatives.map((alt, index) => (
        <div
          key={index}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 12px',
            backgroundColor: '#f5f5f5',
            borderRadius: 6,
            marginBottom: 8,
            fontSize: 14,
          }}
        >
          <span>
            {formatDate(new Date(alt.proposedDate), 'M월 d일')} {alt.proposedStartTime}
          </span>
          <Button
            variant="text"
            size="small"
            onClick={() => handleRemove(index)}
          >
            삭제
          </Button>
        </div>
      ))}

      {/* 대안 시간 추가 UI */}
      {alternatives.length < 5 && (
        <div style={{ marginTop: 16 }}>
          <Calendar
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            minDate={new Date()}
          />

          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            style={{
              width: '100%',
              padding: 12,
              borderRadius: 8,
              border: '1px solid #ddd',
              fontSize: 14,
              marginTop: 12,
            }}
          >
            <option value="">시간 선택</option>
            {timeOptions.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>

          <Button
            variant="secondary"
            fullWidth
            onClick={handleAdd}
            disabled={!selectedDate || !selectedTime}
            style={{ marginTop: 12 }}
          >
            대안 시간 추가
          </Button>
        </div>
      )}
    </div>
  );
}
```

### 5.2 TrialCandidateList 수정 (거절 폼 통합)

**파일:** `src/domain/contract/components/TrialCandidateList.tsx` (수정)

```tsx
// AlternativeTimeSelector import 추가
import AlternativeTimeSelector from './AlternativeTimeSelector';

export default function TrialCandidateList({
  candidates,
  onConfirm,
  onReject,
}: TrialCandidateListProps) {
  // ... 기존 state ...
  
  return (
    <div style={{ padding: 16 }}>
      {/* ... 기존 후보 시간 목록 ... */}

      {/* 거절 및 대안 제안 폼 */}
      {showRejectForm && (
        <div
          style={{
            marginTop: 24,
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
            }}
          />

          <AlternativeTimeSelector
            alternatives={alternativeTimes}
            onChange={setAlternativeTimes}
          />

          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <Button
              variant="secondary"
              fullWidth
              onClick={() => setShowRejectForm(false)}
            >
              취소
            </Button>
            <Button
              variant="primary"
              fullWidth
              onClick={handleReject}
            >
              제출
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## 📊 **데이터 플로우**

### 시나리오 1: 후보 중 선택
```
학생 (ContractRequestForm)
  → 후보 3개 선택 (TrialCandidateSelector)
  → POST /api/contracts/trial
  ↓
학생 카드 (StudentContractCard)
  → "튜터 확인 중..." 표시
  → 후보 시간 목록 표시 (가능/불가 상태)
  ↓
튜터 카드 (TutorContractCard)
  → "체험 레슨 후보 시간 확인하기" 버튼
  → 클릭 시 모달 (TrialCandidateList)
  → 후보 중 하나 선택 → POST /api/contracts/{id}/trial/confirm
  ↓
학생 카드
  → "✅ 체험 레슨 확정" 표시
  → 확정된 날짜/시간 표시
```

### 시나리오 2: 대안 제안 → 수락
```
학생
  → 후보 3개 제안
  ↓
튜터
  → 거절 + 대안 2개 제안 (AlternativeTimeSelector)
  → POST /api/contracts/{id}/trial/reject
  ↓
학생 카드
  → "🎯 튜터가 제안한 시간" 섹션 표시
  → TutorProposalCard 목록
  → "수락" 버튼 클릭 → POST /api/contracts/{id}/trial/accept-proposal/{proposalId}
  ↓
양쪽 카드
  → "✅ 체험 레슨 확정" 표시
```

---

## 📁 **최종 파일 목록**

### 신규 생성
```
✅ src/domain/contract/api/trialContractApi.ts
✅ src/domain/booking/components/TrialCandidateSelector.tsx
✅ src/domain/contract/components/TrialCandidateList.tsx
✅ src/domain/contract/components/TutorProposalCard.tsx
✅ src/domain/contract/components/AlternativeTimeSelector.tsx
```

### 수정
```
✏️ src/domain/contract/types/contract.ts (타입 추가)
✏️ src/domain/booking/types/types.ts (타입 추가)
✏️ src/domain/booking/api/lessonBookingApi.ts (DTO 확장)
✏️ src/domain/booking/pages/ContractRequestForm.tsx (체험 레슨 플로우)
✏️ src/domain/contract/components/StudentContractCard.tsx (체험 레슨 UI)
✏️ src/domain/contract/components/TutorContractCard.tsx (체험 레슨 UI)
```

---

## ✅ **Phase별 체크리스트**

### **Phase 1: Types (Day 1)**
- [ ] `contract.ts` 타입 확장 (CandidateTimeInfo, ProposalTimeInfo)
- [ ] `types.ts` 타입 확장 (TrialCandidateTime)
- [ ] `trialContractApi.ts` API 함수 작성

### **Phase 2: 학생 신청 UI (Day 2)**
- [ ] `TrialCandidateSelector.tsx` 컴포넌트 작성
- [ ] `ContractRequestForm.tsx` 수정 (체험 레슨 플로우 추가)
- [ ] 후보 시간 1~3개 선택 UI
- [ ] API 연동 (POST /api/contracts/trial)

### **Phase 3: 학생 제안 확인 UI (Day 2)**
- [ ] `TutorProposalCard.tsx` 컴포넌트 작성
- [ ] `StudentContractCard.tsx` 수정
- [ ] 후보 시간 상태 표시 (가능/불가)
- [ ] 튜터 제안 시간 표시 및 수락 버튼
- [ ] API 연동 (POST /api/contracts/{id}/trial/accept-proposal/{proposalId})

### **Phase 4: 튜터 확인/선택 UI (Day 3)**
- [ ] `TrialCandidateList.tsx` 컴포넌트 작성
- [ ] `TutorContractCard.tsx` 수정
- [ ] 후보 시간 목록 표시
- [ ] 선택 및 확정 버튼
- [ ] API 연동 (POST /api/contracts/{id}/trial/confirm)

### **Phase 5: 튜터 거절/대안 제안 UI (Day 4)**
- [ ] `AlternativeTimeSelector.tsx` 컴포넌트 작성
- [ ] `TrialCandidateList.tsx`에 거절 폼 통합
- [ ] 거절 사유 입력
- [ ] 대안 시간 선택 (최대 5개)
- [ ] API 연동 (POST /api/contracts/{id}/trial/reject)

### **Phase 6: 테스트 및 최적화 (Day 5)**
- [ ] 전체 플로우 테스트
- [ ] 에러 핸들링 개선
- [ ] 로딩 상태 추가
- [ ] 반응형 UI 확인
- [ ] 알림 연동 확인

---

## 🎨 **UI/UX 가이드**

### 색상 코드
```typescript
const TRIAL_COLORS = {
  pending: '#fff3e0',      // 대기 중 (주황)
  available: '#e8f5e9',    // 가능 (초록)
  unavailable: '#ffebee',  // 불가 (빨강)
  confirmed: '#e3f2fd',    // 확정 (파랑)
};
```

### 우선순위 표시
- 1순위: 🥇 (금메달)
- 2순위: 🥈 (은메달)
- 3순위: 🥉 (동메달)

### 상태 아이콘
- ⏰ 후보 시간 대기
- ✅ 확정 완료
- 🎯 튜터 제안
- ✗ 불가능
- ✓ 가능

---

## 🚨 **주의사항**

### 1. 기존 레슨 타입과 분리
- REGULAR, FIRSTCOME은 기존 날짜 선택 UI 유지
- TRIAL만 후보 시간 선택 UI로 분기

### 2. 날짜/시간 포맷
- 백엔드: `yyyy-MM-dd`, `HH:mm`
- 프론트: `LocalDateTime` 조합 사용하지 말고 별도 필드 사용

### 3. 상태 관리
- 후보 추가/삭제 시 priority 재정렬 필요
- 최대 개수 제한 (후보 3개, 대안 5개)

### 4. 에러 처리
- "후보 시간 없음" → 최소 1개 선택 유도
- "과거 시간" → 달력에서 과거 날짜 비활성화
- "중복 시간" → 추가 시 중복 체크

---

## 📱 **화면별 상태 표시**

### 학생 화면 (StudentContractCard)

| 상태 | 표시 내용 |
|------|----------|
| REQUESTED + 후보만 있음 | "⏰ 제안한 후보 시간" 목록 + "튜터 확인 중" |
| REQUESTED + 튜터 제안 있음 | "🎯 튜터가 제안한 시간" + 수락 버튼 |
| ACTIVE + 확정됨 | "✅ 체험 레슨 확정" + 확정 날짜/시간 |
| CANCELLED | "취소됨" |

### 튜터 화면 (TutorContractCard)

| 상태 | 표시 내용 |
|------|----------|
| REQUESTED + 후보 있음 | "체험 레슨 후보 시간 확인하기" 버튼 |
| REQUESTED + 대안 제안함 | "대안 시간 제안 완료" + "학생 응답 대기" |
| ACTIVE + 확정됨 | "✅ 체험 레슨 확정" + 확정 날짜/시간 |

---

## 🔄 **API 호출 타이밍**

### 학생
1. **계약 생성 시:** `POST /api/contracts/trial` (후보 3개 함께 전송)
2. **튜터 제안 수락 시:** `POST /api/contracts/{id}/trial/accept-proposal/{proposalId}`
3. **계약 상세 조회:** `GET /api/contracts/{id}` (후보/제안 상태 확인)

### 튜터
1. **후보 확정 시:** `POST /api/contracts/{id}/trial/confirm`
2. **거절/대안 제안 시:** `POST /api/contracts/{id}/trial/reject`
3. **계약 목록 조회:** `GET /api/contracts/tutor` (체험 레슨 필터링)

---

## 🎯 **우선순위 구현 순서**

1. **Day 1:** Types & API 함수 (Phase 1)
2. **Day 2:** 학생 신청 UI (Phase 2, 3)
   - TrialCandidateSelector
   - ContractRequestForm 수정
   - StudentContractCard 수정
3. **Day 3:** 튜터 확인/선택 UI (Phase 4)
   - TrialCandidateList
   - TutorContractCard 수정
4. **Day 4:** 대안 제안 UI (Phase 5)
   - AlternativeTimeSelector
   - TrialCandidateList 거절 폼 통합
5. **Day 5:** 통합 테스트 및 버그 수정

---

## 🧪 **테스트 시나리오**

### 시나리오 1: 정상 플로우
```
1. 학생: 체험 레슨 신청 (후보 3개 선택)
2. 튜터: 후보 목록 확인
3. 튜터: 1순위 시간 선택 및 확정
4. 학생: 확정된 시간 확인
```

### 시나리오 2: 대안 제안 플로우
```
1. 학생: 체험 레슨 신청 (후보 3개 선택)
2. 튜터: 모두 불가 → 대안 2개 제안
3. 학생: 튜터 제안 시간 확인
4. 학생: 제안 중 하나 수락
5. 튜터/학생: 확정된 시간 확인
```

### 시나리오 3: 완전 거절
```
1. 학생: 체험 레슨 신청
2. 튜터: 거절 (대안 없이)
3. 학생: 취소된 계약 확인
```

---

## 💡 **구현 팁**

### 1. 컴포넌트 재사용
- `TrialCandidateSelector` ← 학생이 후보 선택
- `AlternativeTimeSelector` ← 튜터가 대안 제안
- 거의 동일한 UI이므로 공통 컴포넌트로 추출 가능

### 2. 날짜 포맷 유틸
```typescript
// 날짜 포맷팅
formatDate(new Date(candidateDate), 'M월 d일 (E)') // "2월 23일 (일)"

// 시간 포맷팅
formatTime(candidateStartTime) // "14:00" → "오후 2:00"
```

### 3. 상태 업데이트
```typescript
// 계약 상태 변경 시 자동 리로드
window.location.reload();

// 또는 React Query 사용 시
queryClient.invalidateQueries(['contracts', contractNo]);
```

### 4. 로딩 상태
```typescript
const [isLoading, setIsLoading] = useState(false);

const handleConfirm = async () => {
  setIsLoading(true);
  try {
    await confirmTrialContract(...);
  } finally {
    setIsLoading(false);
  }
};
```

---

## 🎨 **디자인 참고**

### 후보 시간 카드
```
┌─────────────────────────────────┐
│ 1순위                    [삭제]  │
│ 2월 23일 (일) 14:00              │
└─────────────────────────────────┘
```

### 튜터 제안 카드
```
┌─────────────────────────────────┐
│ 🎯 튜터가 제안한 시간            │
│                                  │
│ ┌─────────────────────────────┐ │
│ │ 2월 25일 (화) 10:00  [수락] │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ 2월 26일 (수) 11:00  [수락] │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

### 확정 완료 카드
```
┌─────────────────────────────────┐
│ ✅ 체험 레슨 확정                │
│ 2월 25일 (화) 오후 2:00          │
└─────────────────────────────────┘
```

---

## 🔗 **기존 코드 활용**

### 이미 구현된 컴포넌트 재사용
- `Calendar` - 날짜 선택
- `Button` - 액션 버튼
- `Header` - 섹션 헤더
- `Chip` - 상태 표시
- `Modal` - 모달 (후보 확인 시)

### 이미 구현된 유틸 재사용
- `formatDate` - 날짜 포맷
- `toAmPmFormat` - 시간 포맷
- `api.post/get` - API 호출

---

## 📝 **다음 단계**

1. **Phase 1** 먼저 진행 (Types & API) ← 가장 중요!
2. **Phase 2** 학생 UI (신청)
3. **Phase 3** 학생 UI (제안 확인/수락)
4. **Phase 4** 튜터 UI (확인/선택)
5. **Phase 5** 튜터 UI (거절/대안)
6. **Phase 6** 통합 테스트

---

## 🚀 **Quick Start**

```bash
# 1. Types 확장
# contract.ts, types.ts 수정

# 2. API 추가
# trialContractApi.ts 생성

# 3. 컴포넌트 생성 (우선순위 순)
# TrialCandidateSelector.tsx (학생 신청)
# TutorProposalCard.tsx (학생이 튜터 제안 확인)
# TrialCandidateList.tsx (튜터 후보 확인)
# AlternativeTimeSelector.tsx (튜터 대안 제안)

# 4. 기존 컴포넌트 수정
# ContractRequestForm.tsx
# StudentContractCard.tsx
# TutorContractCard.tsx
```

---

## 🔍 **참고사항**

### Backend API Summary
| Method | Endpoint | 호출자 | 설명 |
|--------|----------|--------|------|
| POST | `/api/contracts/trial` | 학생 | 체험 레슨 생성 (후보 1~3개) |
| POST | `/api/contracts/{id}/trial/confirm` | 튜터 | 후보 중 하나 선택하여 확정 |
| POST | `/api/contracts/{id}/trial/reject` | 튜터 | 거절 또는 대안 제안 |
| POST | `/api/contracts/{id}/trial/accept-proposal/{proposalId}` | 학생 | 튜터 제안 시간 수락 |

### Request/Response 예시

**학생 - 체험 레슨 신청**
```json
POST /api/contracts/trial
{
  "tutorProfileNo": 1,
  "contractType": "TRIAL",
  "lessonCategory": "ENGLISH",
  "place": "강남역 스터디카페",
  "level": "초급",
  "totalPrice": 50000,
  "trialCandidates": [
    {
      "priority": 1,
      "candidateDate": "2026-02-25",
      "candidateStartTime": "14:00"
    },
    {
      "priority": 2,
      "candidateDate": "2026-02-26",
      "candidateStartTime": "15:00"
    },
    {
      "priority": 3,
      "candidateDate": "2026-02-27",
      "candidateStartTime": "16:00"
    }
  ]
}
```

**튜터 - 후보 확정**
```json
POST /api/contracts/1/trial/confirm
{
  "selectedDate": "2026-02-25",
  "selectedStartTime": "14:00"
}
```

**튜터 - 대안 제안**
```json
POST /api/contracts/1/trial/reject
{
  "reason": "제안하신 시간이 어렵지만 다른 시간은 가능합니다",
  "alternativeTimes": [
    {
      "proposedDate": "2026-03-01",
      "proposedStartTime": "10:00"
    },
    {
      "proposedDate": "2026-03-02",
      "proposedStartTime": "11:00"
    }
  ]
}
```

**학생 - 튜터 제안 수락**
```json
POST /api/contracts/1/trial/accept-proposal/5
{}
```

---

**Last Updated:** 2026-02-23
