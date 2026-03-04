# 체험 레슨 후보 시간 선택 기능 - 구현 완료 ✅

**구현 일자:** 2026-02-25
**빌드 상태:** ✅ 성공 (3.44초)

---

## 📦 구현된 Phase 목록

### ✅ Phase 1: Types & API (완료)
**파일:**
- `src/domain/contract/types/contract.ts` - CandidateTimeInfo, ProposalTimeInfo 타입 추가
- `src/domain/booking/types/types.ts` - TrialCandidateTime 타입 추가
- `src/domain/booking/api/lessonBookingApi.ts` - ContractRequestDto에 trialCandidates 추가
- `src/domain/contract/api/trialContractApi.ts` ⭐ **신규 생성**

**API 함수 (4개):**
1. `createTrialContract()` - 학생이 체험 레슨 신청 (후보 1~3개)
2. `confirmTrialContract()` - 튜터가 후보 중 하나 확정
3. `rejectTrialContract()` - 튜터가 거절 또는 대안 제안
4. `acceptTutorProposal()` - 학생이 튜터 제안 시간 수락

---

### ✅ Phase 2: 학생 신청 UI (완료)
**파일:**
- `src/domain/booking/components/TrialCandidateSelector.tsx` ⭐ **신규 생성**
- `src/domain/booking/pages/ContractRequestForm.tsx` - 수정

**기능:**
- 학생이 체험 레슨 가능 시간 1~3개 선택
- 간단한 달력 UI로 날짜 선택
- 시간 드롭다운 (09:00~20:00)
- 우선순위 관리 (1순위, 2순위, 3순위)
- 중복 체크 및 삭제 기능
- ContractRequestForm Step 2에서 체험 레슨 분기 처리

---

### ✅ Phase 3: 학생 제안 확인/수락 UI (완료)
**파일:**
- `src/domain/contract/components/TutorProposalCard.tsx` ⭐ **신규 생성**
- `src/domain/contract/components/StudentContractCard.tsx` - 수정

**기능:**
- 튜터 제안 시간 카드 컴포넌트
- 학생 계약 카드에 3가지 상태별 UI 추가:
  1. **대기 중 + 후보만**: "⏰ 제안한 후보 시간" 목록 표시
  2. **대기 중 + 튜터 제안**: "🎯 튜터가 제안한 시간" + 수락 버튼
  3. **확정됨**: "✅ 체험 레슨 확정" + 확정 시간 표시

---

### ✅ Phase 4: 튜터 확인/선택 UI (완료)
**파일:**
- `src/domain/contract/components/TrialCandidateList.tsx` ⭐ **신규 생성**
- `src/domain/contract/components/TutorContractCard.tsx` - 수정

**기능:**
- 학생 후보 시간 목록 표시 (우선순위 1, 2, 3)
- 후보 클릭하여 선택
- "이 시간으로 확정" 버튼
- "거절/대안 제안" 버튼
- Modal로 후보 목록 표시
- 튜터 계약 카드에 "체험 레슨 후보 시간 확인하기" 버튼
- 확정 시 "✅ 체험 레슨 확정" 표시

---

### ✅ Phase 5: 튜터 대안 제안 UI (완료)
**파일:**
- `src/domain/contract/components/AlternativeTimeSelector.tsx` ⭐ **신규 생성**
- `src/domain/contract/components/TrialCandidateList.tsx` - 수정

**기능:**
- 대안 시간 선택 컴포넌트 (최대 5개)
- 간단한 달력 UI로 날짜 선택
- 시간 드롭다운
- 중복 체크 및 삭제 기능
- TrialCandidateList 거절 폼에 통합
- 거절 사유 + 대안 시간 함께 제출

---

## 📁 생성된 파일 목록

### 신규 생성 (5개)
```
✅ src/domain/contract/api/trialContractApi.ts (61줄)
✅ src/domain/booking/components/TrialCandidateSelector.tsx (265줄)
✅ src/domain/contract/components/TutorProposalCard.tsx (49줄)
✅ src/domain/contract/components/TrialCandidateList.tsx (208줄)
✅ src/domain/contract/components/AlternativeTimeSelector.tsx (237줄)
```

### 수정 (6개)
```
✏️ src/domain/contract/types/contract.ts
✏️ src/domain/booking/types/types.ts
✏️ src/domain/booking/api/lessonBookingApi.ts
✏️ src/domain/booking/pages/ContractRequestForm.tsx
✏️ src/domain/contract/components/StudentContractCard.tsx
✏️ src/domain/contract/components/TutorContractCard.tsx
```

---

## 🔄 데이터 플로우

### 시나리오 1: 후보 중 선택 (정상 플로우)
```
학생 (ContractRequestForm)
  → TrialCandidateSelector에서 후보 3개 선택
  → POST /api/contracts/trial
  ↓
학생 카드 (StudentContractCard)
  → "⏰ 제안한 후보 시간" 표시
  → 튜터 확인 중...
  ↓
튜터 카드 (TutorContractCard)
  → "체험 레슨 후보 시간 확인하기" 버튼
  → Modal 열기 (TrialCandidateList)
  → 후보 중 1개 선택 → "이 시간으로 확정"
  → POST /api/contracts/{id}/trial/confirm
  ↓
양쪽 카드
  → "✅ 체험 레슨 확정" 표시
  → 확정된 날짜/시간 표시
```

### 시나리오 2: 대안 제안 → 수락
```
학생
  → 후보 3개 제안
  ↓
튜터
  → "거절/대안 제안" 클릭
  → 거절 사유 입력 + AlternativeTimeSelector에서 대안 2개 선택
  → POST /api/contracts/{id}/trial/reject
  ↓
학생 카드
  → "🎯 튜터가 제안한 시간" 섹션 표시
  → TutorProposalCard 목록
  → "수락" 버튼 클릭
  → POST /api/contracts/{id}/trial/accept-proposal/{proposalId}
  ↓
양쪽 카드
  → "✅ 체험 레슨 확정" 표시
```

### 시나리오 3: 완전 거절
```
학생
  → 후보 3개 제안
  ↓
튜터
  → "거절/대안 제안" 클릭
  → 거절 사유만 입력 (대안 없이)
  → POST /api/contracts/{id}/trial/reject
  ↓
계약 상태
  → CANCELLED
```

---

## 🎨 UI/UX 특징

### 색상 코드
- **대기 중**: #fff3e0 (주황)
- **가능**: #e8f5e9 (초록)
- **불가**: #ffebee (빨강)
- **확정**: #e3f2fd (파랑)

### 상태 아이콘
- ⏰ 후보 시간 대기
- ✅ 확정 완료
- 🎯 튜터 제안
- ✗ 불가능
- ✓ 가능

### 우선순위 표시
- 1순위, 2순위, 3순위 텍스트 표시

---

## 🧪 테스트 체크리스트

### ✅ 빌드 테스트
- [x] Phase 1 완료 후 빌드 성공 (2.36초)
- [x] Phase 2 완료 후 빌드 성공 (2.35초)
- [x] Phase 4 완료 후 빌드 성공 (2.41초)
- [x] Phase 5 완료 후 빌드 성공 (3.44초)

### 권장 수동 테스트 시나리오
- [ ] 학생: 체험 레슨 신청 (후보 1~3개 선택)
- [ ] 학생: 후보 중복 체크 동작 확인
- [ ] 학생: 과거 날짜 선택 불가 확인
- [ ] 튜터: 후보 목록 확인 모달 열기
- [ ] 튜터: 후보 중 1개 선택 및 확정
- [ ] 튜터: 거절 + 대안 제안 (0~5개)
- [ ] 학생: 튜터 제안 시간 수락
- [ ] 양쪽: 확정된 시간 표시 확인

---

## 📊 코드 통계

- **총 생성된 파일**: 5개
- **총 수정된 파일**: 6개
- **총 추가된 코드**: 약 820줄
- **빌드 시간**: 3.44초
- **빌드 크기 증가**: 약 2.67KB (168.76KB → 176.14KB)

---

## 🎯 구현 완료 체크

- [x] Phase 1: Types & API
- [x] Phase 2: 학생 신청 UI
- [x] Phase 3: 학생 제안 확인/수락 UI
- [x] Phase 4: 튜터 확인/선택 UI
- [x] Phase 5: 튜터 대안 제안 UI

**전체 구현 완료! 🎉**

---

## 📝 다음 단계 (선택사항)

### 개선 사항
1. **로딩 상태 추가** - API 호출 시 로딩 인디케이터
2. **에러 핸들링 강화** - 네트워크 에러, 타임아웃 등
3. **반응형 UI** - 모바일 환경 테스트 및 개선
4. **알림 연동** - 튜터/학생에게 상태 변경 알림
5. **달력 개선** - 다음 달 이동 기능 추가
6. **접근성 개선** - ARIA 레이블, 키보드 네비게이션

### 통합 테스트
1. 실제 백엔드 API 연동 테스트
2. 전체 플로우 E2E 테스트
3. 다양한 엣지 케이스 테스트
4. 성능 테스트 (큰 데이터셋)

---

**구현 완료일**: 2026-02-25
**구현 소요 시간**: 약 2시간
**최종 빌드 상태**: ✅ 성공
