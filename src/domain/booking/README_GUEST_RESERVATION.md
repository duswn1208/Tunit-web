# Guest Reservation (비회원 예약) 기능

## 개요
게스트 예약 기능은 로그인하지 않은 사용자도 튜터의 체험 레슨을 예약할 수 있게 해주는 기능입니다.

## 주요 특징
- **로그인 불필요**: 이름과 전화번호만으로 예약 가능
- **마법 링크**: 예약 후 고유한 링크를 통해 예약 상태 확인 가능
- **체험 레슨 전용**: TRIAL (체험 레슨) 타입으로만 예약 가능

## API 엔드포인트

### 1. 비회원 예약 생성
```
POST /api/public/reservations/tutors/{tutorProfileNo}
```

**Request Body:**
```json
{
  "studentName": "홍길동",
  "phone": "010-1234-5678",
  "lessonCategory": "PIANO_CLASSIC",
  "lessonDate": "2026-03-15",
  "startTime": "14:00",
  "place": "강남역 스터디룸",
  "level": "초급",
  "memo": "처음 배우는 학생입니다."
}
```

**Response:**
```json
{
  "message": "예약 요청이 완료되었습니다. 선생님 승인 후 확정됩니다.",
  "magicLink": "https://tunit.com/guest-reservation/verify/{token}"
}
```

### 2. 마법 링크로 예약 조회
```
GET /api/public/reservations/verify/{token}
```

**Response:**
```json
{
  "reservationNo": 123,
  "studentName": "홍길동",
  "tutorName": "김선생",
  "lessonDate": "2026-03-15",
  "startTime": "14:00",
  "endTime": "15:00",
  "lessonCategory": "피아노 클래식",
  "status": "PENDING",
  "memo": "처음 배우는 학생입니다."
}
```

### 3. 예약 승인/거절
```
POST /api/public/reservations/{token}/action?action={confirm|reject}
```

**Response:**
```
"예약이 확정되었습니다." 또는 "예약이 취소되었습니다."
```

## 프론트엔드 라우트

### 게스트 예약 페이지
- **경로**: `/tutors/:tutorId/guest-reservation`
- **설명**: 비회원 사용자가 예약 폼을 작성하는 페이지
- **필수 입력**:
  - 이름 (studentName)
  - 전화번호 (phone)
  - 레슨 과목 (lessonCategory)
  - 레슨 날짜 (lessonDate)
  - 시작 시간 (startTime)
- **선택 입력**:
  - 레슨 장소 (place)
  - 실력 수준 (level)
  - 요청사항 (memo)

### 예약 완료 페이지
- **경로**: `/guest-reservation/success`
- **설명**: 예약이 성공적으로 생성된 후 마법 링크를 표시하는 페이지
- **기능**:
  - 마법 링크 복사 버튼
  - 홈으로 돌아가기 버튼

### 예약 확인 페이지
- **경로**: `/guest-reservation/verify/:token`
- **설명**: 마법 링크를 통해 예약 상태를 확인하는 페이지
- **기능**:
  - 예약 정보 조회
  - 예약 상태 표시 (대기 중, 확정, 거절, 취소)
  - 예약 확정/거절 버튼 (PENDING 상태일 때만)

## 사용 흐름

### 학생 (비회원) 관점
1. 튜터 검색 페이지에서 튜터 찾기
2. 튜터 상세 페이지에서 "상담/체험 레슨 예약" 버튼 클릭
3. 비로그인 상태면 자동으로 게스트 예약 페이지로 이동
4. 예약 폼 작성 및 제출
5. 성공 페이지에서 마법 링크 저장
6. 나중에 마법 링크를 통해 예약 상태 확인

### 튜터 관점
1. 게스트 예약 요청 알림 수신
2. 예약 내역에서 승인/거절 처리
3. 승인 시 학생에게 알림 발송

## 파일 구조

```
src/domain/booking/
├── api/
│   └── guestReservationApi.ts         # 게스트 예약 API 함수
├── pages/
│   ├── GuestReservationPage.tsx       # 예약 폼 페이지
│   ├── GuestReservationSuccessPage.tsx # 예약 완료 페이지
│   └── GuestReservationVerifyPage.tsx  # 예약 확인 페이지
└── components/
    └── css/
        └── lesson-booking.css          # 스타일 (게스트 예약 스타일 포함)
```

## 백엔드 연동

### DTO 구조
- **GuestReservationRequestDto**: 
  - `BaseContractDto`를 상속
  - `studentName`, `phone` 필드 추가
  - `contractType`은 항상 `TRIAL`로 고정

### 서비스 로직
- JWT 토큰 기반 마법 링크 생성
- 예약 생성 시 자동으로 PENDING 상태로 설정
- 튜터 승인 후 CONFIRMED 상태로 변경

## 주의사항
1. 게스트 예약은 체험 레슨만 가능합니다.
2. 정기레슨이나 선착순 레슨은 로그인 필요합니다.
3. 마법 링크는 예약 당사자만 사용 가능합니다.
4. 예약 정보는 마법 링크를 통해서만 접근 가능합니다.

## 향후 개선 사항
- [ ] SMS/이메일을 통한 마법 링크 자동 발송
- [ ] 예약 리마인더 기능
- [ ] 예약 수정 기능 추가
- [ ] 예약 취소 사유 입력 기능
