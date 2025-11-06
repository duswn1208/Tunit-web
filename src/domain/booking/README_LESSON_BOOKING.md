# 레슨 예약 기능 (Lesson Booking)

## 📋 개요

기존 계약에서 **신규 레슨 예약** 및 **레슨 날짜/시간 변경** 기능을 제공합니다.

---

## 🎯 핵심 기능

### 1. **신규 레슨 예약** (FIRSTCOME만 가능)

- 선착순 신청(FIRSTCOME) 계약에서만 신규 레슨 예약 가능
- 정기 레슨(REGULAR) 계약은 백엔드 배치로 자동 생성되므로 신규 예약 불가
- 튜터의 가용 시간 및 이미 예약된 시간을 확인하여 예약

### 2. **레슨 날짜/시간 변경** (모든 계약 타입 가능)

- 기존 예약된 레슨의 날짜/시간을 변경
- 계약 타입과 관계없이 모든 레슨에서 사용 가능

---

## 📁 파일 구조

```
src/domain/booking/
├── api/
│   └── lessonBookingApi.ts           # API (bookLesson, rescheduleLesson 추가)
├── components/
│   ├── ContractInfoCard.tsx          # 계약 정보 요약 카드
│   ├── LessonBookingForm.tsx         # 레슨 예약/변경 폼
│   └── css/
│       └── lesson-booking.css        # ContractInfoCard 스타일 추가
└── pages/
    └── LessonBookingPage.tsx         # 레슨 예약/변경 페이지
```

---

## 🔌 API 엔드포인트

### 신규 레슨 예약

```typescript
POST /api/lessons/reservation
{
  contractNo: number;
  lessonDate: string;    // YYYY-MM-DD
  startTime: string;     // HH:mm
  endTime: string;       // HH:mm
  memo?: string;
}
```

### 레슨 날짜/시간 변경

```typescript
PUT /api/lessons/{lessonReservationNo}/reschedule
{
  lessonDate: string;    // YYYY-MM-DD
  startTime: string;     // HH:mm
  endTime: string;       // HH:mm
  memo?: string;
}
```

---

## 🚀 사용 방법

### 1. 신규 레슨 예약 (FIRSTCOME 계약)

**URL:** `/student/booking/lesson?contractNo=123&mode=new`

```tsx
// StudentContractCard에서 "레슨 예약" 버튼 클릭
navigate(`/student/booking/lesson?contractNo=${contractNo}&mode=new`);
```

**동작:**

1. 계약 정보 로드 (contractNo)
2. 계약 타입 확인
   - FIRSTCOME → 예약 진행
   - REGULAR → 불가 메시지 표시
3. LessonCalendarPicker로 날짜/시간 선택
4. bookLesson API 호출
5. 성공 시 레슨 목록 페이지로 이동

### 2. 레슨 날짜/시간 변경

**URL:** `/student/booking/lesson?contractNo=123&mode=reschedule&lessonReservationNo=456&lessonDate=2025-01-15&startTime=14:00&endTime=15:00`

```tsx
// 레슨 상세/목록에서 "날짜 변경" 버튼 클릭
navigate(
  `/student/booking/lesson?contractNo=${contractNo}&mode=reschedule` +
    `&lessonReservationNo=${lessonNo}&lessonDate=${date}&startTime=${start}&endTime=${end}`
);
```

**동작:**

1. 계약 및 기존 레슨 정보 로드
2. 현재 예약 정보 표시
3. 새로운 날짜/시간 선택
4. rescheduleLesson API 호출
5. 성공 시 레슨 목록 페이지로 이동

---

## 🎨 컴포넌트 구조

### LessonBookingPage (페이지 컨테이너)

- URL 파라미터 파싱
- 계약 정보 로드
- API 호출 및 에러 처리
- 성공/실패 토스트 메시지

### LessonBookingForm (메인 폼)

- 계약 정보 표시 (ContractInfoCard)
- 날짜/시간 선택 (LessonCalendarPicker)
- REGULAR 계약 신규 예약 제한
- 제출/취소 처리

### ContractInfoCard (정보 카드)

- 레슨 카테고리
- 계약 타입
- 정규 스케줄
- 장소, 진행 상황, 계약 기간

---

## ⚠️ 제약사항

### 신규 레슨 예약

- ✅ FIRSTCOME (선착순 신청) - 가능
- ❌ REGULAR (정기 레슨) - 불가 (백엔드 배치로 자동 생성)
- ❌ TRIAL (체험 레슨) - 불가 (1회성)

### 레슨 날짜/시간 변경

- ✅ 모든 계약 타입에서 가능
- 튜터의 가용 시간 내에서만 변경 가능
- 이미 예약된 시간은 선택 불가

---

## 🔄 사용자 플로우

```
[계약 카드 - ACTIVE 상태]
    ↓
  [레슨 예약 버튼]
    ↓
┌─────────────────────────────────┐
│  계약 타입 확인                  │
├─────────────────────────────────┤
│ FIRSTCOME → LessonBookingPage   │
│ REGULAR   → 레슨 목록 페이지     │
└─────────────────────────────────┘
    ↓
  [LessonBookingPage]
    ↓
  1. 계약 정보 표시
  2. 날짜/시간 선택 (LessonCalendarPicker)
     - 가용 시간 표시
     - 예약된 시간 비활성화
  3. 메모 입력 (선택)
  4. 제출
    ↓
  [API 호출]
    ↓
  [성공] → 레슨 목록 페이지
  [실패] → 에러 메시지
```

---

## 🧪 테스트 시나리오

### 1. FIRSTCOME 계약 - 신규 예약

```
1. FIRSTCOME 계약 선택
2. "레슨 예약" 버튼 클릭
3. 날짜 선택
4. 가용 시간 중 선택
5. 예약 완료 확인
```

### 2. REGULAR 계약 - 신규 예약 시도

```
1. REGULAR 계약 선택
2. "레슨 예약" 버튼 클릭
3. 레슨 목록 페이지로 이동
   (또는 신규 예약 불가 메시지)
```

### 3. 레슨 날짜/시간 변경

```
1. 레슨 상세/목록에서 레슨 선택
2. "날짜 변경" 버튼 클릭
3. 새로운 날짜/시간 선택
4. 변경 완료 확인
```

---

## 📝 향후 개선 사항

1. **레슨 목록/상세 페이지에서 변경 버튼 추가**

   - LessonCard에 "날짜 변경" 버튼
   - LessonDetailModal에 변경 옵션

2. **변경 이력 표시**

   - 레슨이 변경되었을 경우 표시
   - 변경 횟수 제한

3. **취소 정책 추가**

   - 레슨 시작 N시간 전까지만 변경 가능
   - 취소/변경 수수료 정책

4. **반복 예약**
   - FIRSTCOME 계약에서 여러 날짜 일괄 예약
   - 주간 반복 패턴 선택

---

## 🔗 관련 파일

- `src/domain/lesson/components/LessonCalendarPicker.tsx` - 날짜/시간 선택기
- `src/domain/contract/components/StudentContractCard.tsx` - 계약 카드
- `src/domain/contract/types/contract.ts` - 계약 타입 정의
- `src/domain/booking/types/types.ts` - 계약 타입 유틸
