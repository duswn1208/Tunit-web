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

### 환경 변수 파일 생성

```bash
# .env.development (개발)
VITE_API_BASE_URL=http://localhost:8080

# .env.production (배포)
VITE_API_BASE_URL=https://your-api-server.com
```

> ⚠️ **주의:** `.env.production`에 실제 API 서버 주소를 입력해야 합니다.

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

## 📚 개발 가이드

### 필수 문서

| 문서 | 설명 |
|------|------|
| **[CODE_STANDARDS.md](./CODE_STANDARDS.md)** | 🔥 코딩 규칙 (필독!) |
| **[DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)** | 디자인 시스템 (색상, 타이포) |
| **[TODO.md](./TODO.md)** | 개선 필요 항목 |

### 코드 작성 체크리스트

작업 전에 **CODE_STANDARDS.md**를 꼭 읽어주세요!

- [ ] 브레이크포인트: `768px`, `1024px`만 사용
- [ ] CSS 변수 사용 (색상 하드코딩 금지)
- [ ] 인라인 스타일 금지
- [ ] `window.location.href` 대신 `navigate()` 사용
- [ ] 컴포넌트 크기: 200줄 이하
- [ ] Props 타입: `any` 금지

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

## 🤝 Contributing

### Commit 메시지 규칙

```
feat:     새로운 기능 추가
fix:      버그 수정
refactor: 리팩토링
style:    코드 포맷팅
chore:    빌드, 설정 변경
docs:     문서 수정
```

**예시:**
```bash
git commit -m "feat: 레슨 예약 캘린더 추가"
git commit -m "fix: BottomTabBar 라우팅 오류 수정"
```

### PR 전 체크리스트

- [ ] `npm run build` 성공
- [ ] **CODE_STANDARDS.md** 규칙 준수
- [ ] 브라우저 콘솔 에러 없음
- [ ] 모바일 반응형 테스트

---

## 📞 문의

프로젝트 관련 문의: [GitHub Issues](https://github.com/duswn1208/Tunit-web/issues)

---

**Last Updated:** 2025-02-20
