# Tunit Web - Frontend

🎵 튜터/학생 1:1 레슨 예약 서비스의 React 기반 웹 프론트엔드

---

## 🚀 시작하기

### 1. 개발 환경 셋업

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:5173)
npm run dev
```

### 2. 필수 설정

**Firebase 설정** (`src/shared/lib/firebase.ts`):
- Firebase 프로젝트 생성
- `firebaseConfig` 객체에 프로젝트 정보 입력

**환경 변수** (`.env` 파일):
```
VITE_API_BASE_URL=your_backend_url
VITE_FIREBASE_API_KEY=your_firebase_key
# ... 기타 필요한 변수
```

### 3. 빌드 & 배포

```bash
# 빌드
npm run build

# 프리뷰
npm run preview
```

---

## 📂 폴더 구조 (DDD 기반)

```
src/
├── domain/                # 비즈니스 도메인 (12개)
│   ├── home/              # 홈, 로그인
│   ├── onboarding/        # 회원가입 온보딩
│   ├── search/            # 튜터 검색
│   ├── tutor/             # 튜터 상세정보
│   ├── booking/           # 레슨 예약
│   ├── contract/          # 학생-튜터 계약
│   ├── lesson/            # 수업 일정
│   ├── mypage/            # 마이페이지
│   ├── notification/      # 알림
│   ├── profile/           # 프로필
│   ├── region/            # 지역 선택
│   └── dayTime/           # 시간 설정
│
├── shared/                # 공통 코드
│   ├── components/        # 재사용 컴포넌트
│   ├── contexts/          # 전역 상태
│   ├── layouts/           # 레이아웃
│   ├── lib/               # 유틸리티 (API, Firebase 등)
│   ├── hooks/             # Custom Hooks
│   └── auth/              # 인증
│
├── App.tsx                # 라우팅
└── main.tsx               # 엔트리포인트
```

### 도메인 구조 (각 도메인 내부)

```
domain/{name}/
├── pages/                 # 라우팅 페이지
├── components/            # 도메인 컴포넌트
├── hooks/                 # 커스텀 훅
├── api/                   # API 호출
└── types/                 # TypeScript 타입
```

---

## 🛠 기술 스택

- **프레임워크**: React 18 + TypeScript
- **라우팅**: React Router v6
- **상태 관리**: React Query (서버), Context API (전역)
- **폼**: React Hook Form
- **스타일**: Tailwind CSS
- **빌드**: Vite
- **인증**: Firebase Authentication

---

## 📋 개발 규칙

### 1. 에러 처리

모든 에러는 **Toast 컴포넌트**로 표시:

```tsx
const { showToast } = useToast();
useEffect(() => {
  if (error) showToast('에러 메시지', 'error');
}, [error]);
```

### 2. 폼 작성

React Hook Form 사용:

```tsx
const { register, handleSubmit } = useForm();
<form onSubmit={handleSubmit(onSubmit)}>
  <input {...register('name')} />
</form>
```

### 3. API 호출

`api/` 디렉토리에 함수 작성:

```tsx
// domain/lesson/api/lessonApi.ts
export const fetchLessons = async () => {
  const response = await api.get('/lessons');
  return response.data;
};
```

### 4. Commit 메시지

```
feat: 기능 추가
fix: 버그 수정
refactor: 코드 개선
docs: 문서
```

---

## 📚 주요 문서

- **Design System**: `DESIGN_SYSTEM.md`
- **아키텍처 설계**: 이 README 및 경력기술서 참고

---

## 🚀 다음 단계

1. `npm run dev` 로 개발 서버 실행
2. `src/domain` 에서 원하는 기능의 코드 확인
3. `src/shared/components` 에서 공통 컴포넌트 참고
4. 새 기능 추가 시 도메인 구조 따르기

