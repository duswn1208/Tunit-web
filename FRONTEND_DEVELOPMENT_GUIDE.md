# 프론트엔드 개발 가이드

> **최종 수정일**: 2026-02-25  
> **목적**: 프로젝트 코드 일관성 유지 및 실수 방지

---

## 📋 목차
1. [레슨 예약 UI 규칙](#1-레슨-예약-ui-규칙)
2. [컴포넌트 재사용 원칙](#2-컴포넌트-재사용-원칙)
3. [날짜/시간 처리](#3-날짜시간-처리)
4. [API 통신](#4-api-통신)
5. [상태 관리](#5-상태-관리)

---

## 1. 레슨 예약 UI 규칙

### ⚠️ 중요: 시간 선택은 반드시 Chip 방식 사용

**❌ 잘못된 방법 (SelectBox)**
```tsx
// 절대 이렇게 하지 마세요!
<select>
  <option>09:00</option>
  <option>10:00</option>
  <option>11:00</option>
  // ... 모든 시간 표시
</select>
```

**✅ 올바른 방법 (LessonCalendarPicker)**
```tsx
// 튜터의 실제 가능한 시간만 Chip으로 표시
import LessonCalendarPicker from '@/domain/lesson/components/LessonCalendarPicker';

<LessonCalendarPicker
  tutorProfileNo={Number(tutorProfileNo)}
  startDate={new Date().toISOString().split('T')[0]}
  endDate={endDateString}
  date={selectedDate}
  time={selectedTime}
  onChange={(date, time) => {
    // 날짜/시간 선택 처리
  }}
  size="small"
  disabledSlots={alreadySelectedSlots} // 이미 선택된 시간 비활성화
/>
```

### 왜 Chip 방식을 사용해야 하는가?

1. **튜터 가능 시간만 표시**
   - SelectBox: 09:00~20:00 전체 표시 (실제 불가능한 시간도 포함)
   - Chip: API로 조회한 튜터의 실제 가능한 시간만 표시

2. **UX 일관성**
   - 정규 레슨, 선착순 레슨, 체험 레슨 모두 동일한 UI 사용
   - 사용자가 학습할 필요 없음

3. **백엔드 연동**
   - `fetchTutorSchedule()` API로 실시간 가능 시간 조회
   - 예약된 시간 자동 필터링

4. **시각적 피드백**
   - Chip 형태로 클릭 가능/불가 명확히 표시
   - 선택된 상태 강조 표시

### 적용 대상

- ✅ 정규 레슨 예약 (`ContractRequestStep2`)
- ✅ 선착순 레슨 예약 (`ContractRequestStep2`)
- ✅ 체험 레슨 후보 선택 (`TrialCandidateSelector`)
- ✅ 레슨 일정 변경
- ✅ 추가 레슨 예약

---

## 2. 컴포넌트 재사용 원칙

### 기존 컴포넌트 우선 사용

새로운 기능을 구현할 때는 **항상 기존 컴포넌트를 먼저 확인**하고 재사용하세요.

#### 주요 재사용 컴포넌트

| 컴포넌트 | 경로 | 용도 |
|---------|------|------|
| `LessonCalendarPicker` | `@/domain/lesson/components/` | 레슨 날짜/시간 선택 |
| `TuCalendar` | `@/shared/components/` | 캘린더 뷰 (월간/주간) |
| `InlineDateTimePicker` | `@/shared/components/` | 날짜/시간 inline 선택 |
| `Button` | `@/shared/components/` | 버튼 |
| `Modal` | `@/shared/components/` | 모달 |
| `Header` | `@/shared/components/` | 섹션 헤더 |
| `Chip` | `@/shared/components/` | Chip UI |

### 신규 컴포넌트 생성 전 체크리스트

- [ ] 비슷한 기능의 기존 컴포넌트가 있는가?
- [ ] 기존 컴포넌트를 확장/수정할 수 있는가?
- [ ] 정말로 새로운 컴포넌트가 필요한가?

---

## 3. 날짜/시간 처리

### 날짜 포맷

```tsx
import { format } from 'date-fns';
import { ko } from 'date-fns/locale/ko';

// 백엔드로 전송: YYYY-MM-DD
const apiDate = format(new Date(), 'yyyy-MM-dd'); // "2026-02-25"

// 화면 표시: 한글 포맷
const displayDate = format(new Date(), 'M월 d일 (E)', { locale: ko }); // "2월 25일 (화)"
```

### 시간 포맷

```tsx
// 백엔드로 전송: HH:mm (24시간)
const apiTime = "14:00";

// 화면 표시: 오전/오후 (선택사항)
import { toAmPmFormat } from '@/domain/dayTime/lib/timeUtils';
const displayTime = toAmPmFormat("14:00"); // "오후 2:00"
```

### 날짜 생성 시 주의

```tsx
// ❌ 잘못된 방법 (타임존 문제 발생 가능)
new Date("2026-02-25")

// ✅ 올바른 방법
new Date("2026-02-25T00:00:00")
```

---

## 4. API 통신

### API 함수 작성 규칙

```tsx
// src/domain/{domain}/api/{feature}Api.ts

import { api } from '@/shared/lib/api';
import type { ResponseType } from '../types/{feature}';

// DTO 타입 정의
export interface CreateRequestDto {
  field1: string;
  field2: number;
}

// API 함수
export async function createResource(data: CreateRequestDto): Promise<ResponseType> {
  return api.post('/api/resources', data);
}
```

### 에러 처리

```tsx
import { useToast } from '@/shared/contexts/ToastContext';

const { showToast } = useToast();

try {
  await someApiCall();
  showToast('성공 메시지');
} catch (error: any) {
  showToast(error?.message || '기본 에러 메시지', 'error');
}
```

---

## 5. 상태 관리

### 로컬 상태 vs 전역 상태

**로컬 상태 (useState)**
- 컴포넌트 내에서만 사용
- 폼 입력값
- UI 토글 상태

**전역 상태 (Context)**
- 여러 컴포넌트에서 공유
- 사용자 정보
- 인증 상태
- 토스트/알림

### useState 사용 예시

```tsx
// ✅ 관련 있는 상태는 객체로 묶기
const [formData, setFormData] = useState({
  date: '',
  time: '',
  memo: '',
});

// ❌ 너무 많은 개별 state
const [date, setDate] = useState('');
const [time, setTime] = useState('');
const [memo, setMemo] = useState('');
// ...
```

---

## 6. 스타일링

### Inline Style vs CSS Class

**Inline Style**
- 동적 스타일 (조건부)
- 일회성 스타일
- 간단한 레이아웃

**CSS Class**
- 재사용되는 스타일
- 복잡한 스타일
- 애니메이션

### 예시

```tsx
// ✅ 동적 스타일 - inline
<div style={{ 
  backgroundColor: isSelected ? '#1976d2' : '#f5f5f5',
  padding: 16 
}}>

// ✅ 재사용 스타일 - CSS class
<button className="ui-btn ui-btn--primary">
```

---

## 7. 타입 정의

### Interface vs Type

```tsx
// ✅ Interface - 확장 가능한 객체 구조
export interface User {
  id: number;
  name: string;
}

// ✅ Type - Union, Intersection 등
export type Status = 'PENDING' | 'ACTIVE' | 'CANCELLED';
export type UserWithRole = User & { role: string };
```

### Props 타입 정의

```tsx
// ✅ Props는 Interface로 정의
interface MyComponentProps {
  title: string;
  count: number;
  onSubmit: () => void;
  children?: React.ReactNode; // 선택적 props는 ?
}

export default function MyComponent({ 
  title, 
  count, 
  onSubmit 
}: MyComponentProps) {
  // ...
}
```

---

## 8. 파일/폴더 구조

### Domain 기반 구조

```
src/
├── domain/
│   ├── booking/          # 예약 관련
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   └── types/
│   ├── contract/         # 계약 관련
│   ├── lesson/           # 레슨 관련
│   └── tutor/            # 튜터 관련
└── shared/               # 공통
    ├── components/
    ├── lib/
    └── contexts/
```

### 파일명 규칙

- **컴포넌트**: PascalCase (`UserCard.tsx`)
- **API**: camelCase (`userApi.ts`)
- **타입**: camelCase (`user.types.ts`)
- **유틸**: camelCase (`dateUtils.ts`)

---

## 9. 주석 규칙

### 주석 작성 원칙

```tsx
// ❌ 불필요한 주석 (코드가 명확함)
// 사용자 이름을 설정한다
setUserName(name);

// ✅ 필요한 주석 (이유 설명)
// 타임존 문제로 인해 T00:00:00 추가 필요
new Date(dateStr + 'T00:00:00');

// ✅ 복잡한 로직 설명
// JavaScript의 getDay()는 0(일요일)부터 시작하므로
// 백엔드 형식인 1(월요일)~7(일요일)로 변환
const dayOfWeekNum = jsDay === 0 ? 7 : jsDay;
```

---

## 10. 실수 사례 및 방지책

### 🚨 실제 발생한 실수

#### Case 1: SelectBox로 시간 선택 구현
**문제**: 튜터의 실제 가능한 시간이 아닌 모든 시간(09:00~20:00)을 표시

**원인**: 
- 기존 컴포넌트(`LessonCalendarPicker`) 확인하지 않음
- 빠르게 구현하려고 간단한 방법 선택

**해결**:
- `LessonCalendarPicker` 사용으로 변경
- 튜터 가능 시간만 Chip으로 표시

**방지책**:
1. 비슷한 기능 구현 전에 **반드시 기존 컴포넌트 검색**
2. 코드 리뷰에서 재사용 가능 여부 체크
3. 이 문서의 "레슨 예약 UI 규칙" 준수

---

## 11. 체크리스트

### PR 제출 전 확인사항

- [ ] 기존 컴포넌트 재사용 검토했는가?
- [ ] 레슨 시간 선택은 `LessonCalendarPicker` 사용했는가?
- [ ] 날짜 포맷은 올바른가? (YYYY-MM-DD)
- [ ] 에러 처리는 적절한가?
- [ ] 타입 정의는 명확한가?
- [ ] 불필요한 주석은 제거했는가?
- [ ] 빌드가 성공하는가?

---

## 12. 참고 자료

### 주요 문서

- `DESIGN_SYSTEM.md` - 디자인 시스템 가이드
- `CODE_STANDARDS.md` - 코드 작성 규칙
- `TRIAL_LESSON_FRONTEND_GUIDE.md` - 체험 레슨 구현 가이드

### 주요 컴포넌트 경로

```
src/domain/lesson/components/LessonCalendarPicker.tsx
src/shared/components/InlineDateTimePicker.tsx
src/shared/components/Modal.tsx
src/shared/components/Button.tsx
```

---

## 업데이트 이력

| 날짜 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-25 | 최초 작성 - 레슨 예약 UI 규칙 추가 | - |

---

**💡 이 문서는 지속적으로 업데이트됩니다. 새로운 규칙이나 실수 사례를 발견하면 즉시 추가해주세요!**
