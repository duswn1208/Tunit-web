# Tunit Web 🎵

> 튜터/학생 1:1 레슨 예약 서비스의 React 기반 웹 프론트엔드

[![React](https://img.shields.io/badge/React-19.1.1-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.3-646CFF?logo=vite)](https://vitejs.dev/)

---

## 🚀 빠른 시작

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:5173)
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview
```

---

## 📂 프로젝트 구조 (DDD 기반)

```
src/
├── domain/                # 비즈니스 도메인 (12개)
│   ├── home/              # 홈, 로그인
│   ├── onboarding/        # 회원가입 온보딩
│   ├── search/            # 튜터 검색
│   ├── booking/           # 레슨 예약
│   ├── lesson/            # 수업 일정 관리
│   ├── contract/          # 학생-튜터 계약
│   ├── mypage/            # 마이페이지
│   └── ...
│
├── shared/                # 공통 코드
│   ├── components/        # 재사용 컴포넌트 (23개)
│   ├── contexts/          # 전역 상태 (Auth, Toast, Alert)
│   ├── layouts/           # 레이아웃
│   ├── css/               # 공통 스타일
│   ├── hooks/             # Custom Hooks
│   ├── lib/               # 유틸리티 (API, Firebase)
│   └── auth/              # 인증
│
├── App.tsx                # 라우팅 설정
└── main.tsx               # 엔트리포인트
```

**각 도메인 구조:**
```
domain/{name}/
├── pages/                 # 라우팅 페이지
├── components/            # 도메인 전용 컴포넌트
├── hooks/                 # 커스텀 훅
└── api/                   # API 호출 함수
```

---

## 🛠 기술 스택

### Core
- **React 19** + **TypeScript 5**
- **Vite 7** (번들러 & 개발 서버)
- **React Router v7** (라우팅)

### 상태 관리
- **TanStack Query v5** (서버 상태)
- **Context API** (전역 상태)

### 스타일링
- **Tailwind CSS 3**
- **CSS Variables** (디자인 토큰)
- **반응형 디자인** (모바일 우선)

### 기타
- **React Hook Form** (폼 관리)
- **Firebase** (인증)
- **React Big Calendar** (일정 관리)

---

## 📋 환경 설정

### 환경 변수

```bash
# .env.development (개발)
VITE_API_BASE_URL=http://localhost:8080

# .env.production (배포)
VITE_API_BASE_URL=https://your-api-server.com
```

### Firebase 설정

`src/shared/lib/firebase.ts` 파일에서 Firebase 프로젝트 정보 입력:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  // ...
};
```

---

## 📚 프로젝트 문서

- **[CODE_STANDARDS.md](./CODE_STANDARDS.md)** - 코딩 규칙 및 컨벤션
- **[DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)** - 디자인 시스템 (색상, 타이포그래피)
- **[TODO.md](./TODO.md)** - 개선 필요 항목

---

## 🎨 주요 기능

### 1. 사용자 인증
- Firebase Authentication
- 역할 기반 접근 제어 (학생/튜터)

### 2. 튜터 온보딩
- 프로필 설정
- 레슨 정보 입력
- 지역 및 시간 설정

### 3. 레슨 예약
- 튜터 검색 및 필터링
- 일정 캘린더 (React Big Calendar)
- 게스트 예약 (비로그인)

### 4. 수업 관리
- 레슨 일정 확인
- 튜터/학생 매칭 관리
- 계약 정보 수정

---

## 🚀 배포

### 프로덕션 빌드

```bash
# 1. 환경 변수 설정
# .env.production에 실제 API URL 입력

# 2. 빌드
npm run build

# 3. dist 폴더 확인
ls -lh dist/

# 4. 빌드 결과
# - JS: ~850KB (gzip: ~250KB)
# - CSS: ~187KB (gzip: ~47KB)
# - 6개 번들로 코드 스플리팅 완료
```

### 빌드 최적화

- ✅ Code Splitting (vendor-react, vendor-calendar 등)
- ✅ CSS 압축 (Tailwind purge)
- ✅ Tree Shaking
- ✅ Lazy Loading

---

## 📞 Contact

프로젝트 관련 문의: [GitHub Repository](https://github.com/duswn1208/Tunit-web)
