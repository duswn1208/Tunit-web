# Tunit-Web 코드 작성 규칙

> 이 문서는 프로젝트의 일관성을 유지하기 위한 필수 규칙입니다.  
> 새로운 코드를 작성하거나 리뷰할 때 반드시 참고하세요.

---

## 📁 1. 파일 구조 (File Structure)

### 폴더 구조
```
src/
├── domain/              # 도메인별 기능 (페이지, 컴포넌트, 로직)
│   ├── home/
│   ├── booking/
│   └── [domain]/
│       ├── pages/       # 페이지 컴포넌트
│       ├── components/  # 도메인 전용 컴포넌트
│       └── hooks/       # 도메인 전용 훅
└── shared/              # 공통 모듈
    ├── components/      # 재사용 가능한 UI 컴포넌트
    ├── hooks/           # 공통 훅
    ├── contexts/        # 전역 상태 (Context API)
    ├── layouts/         # 레이아웃 컴포넌트
    ├── css/             # 공통 스타일
    └── utils/           # 유틸리티 함수
```

### 규칙
- ✅ **도메인 전용 로직은 `domain/` 안에**
- ✅ **2개 이상 페이지에서 쓰이면 `shared/`로 이동**
- ❌ `shared/components/`에 도메인 특화 컴포넌트 금지

---

## 🎨 2. CSS 규칙

### 2.1 반응형 브레이크포인트 (Responsive Breakpoints)

**필수 사용 브레이크포인트:**
```css
/* 모바일 우선 (Mobile First) */
모바일: 기본 스타일 (0 ~ 767px)
태블릿: @media (min-width: 768px)
데스크탑: @media (min-width: 1024px)
```

**금지 사항:**
```css
❌ @media (max-width: 600px)  /* 임의의 브레이크포인트 */
❌ @media (min-width: 720px)  /* 가이드에 없는 값 */
❌ @media (max-width: 480px)  /* 일관성 없음 */
```

**예시:**
```css
/* ✅ 올바른 방법 */
.button-group {
  display: flex;
  flex-direction: column;  /* 모바일 기본 */
  gap: 8px;
}

@media (min-width: 768px) {
  .button-group {
    flex-direction: row;   /* 태블릿 이상 */
    gap: 16px;
  }
}
```

### 2.2 CSS 변수 (CSS Variables)

**디자인 토큰 사용 필수:**
```css
/* ✅ 올바른 방법 */
.button {
  background-color: var(--brand-red);
  color: var(--default-white);
  box-shadow: var(--shadow-md);
}

/* ❌ 잘못된 방법 */
.button {
  background-color: #ff4757;  /* 하드코딩 금지 */
  color: #ffffff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}
```

**사용 가능한 CSS 변수는 `DESIGN_SYSTEM.md` 참고**

### 2.3 인라인 스타일 금지

```tsx
/* ❌ 잘못된 방법 */
<div style={{ maxWidth: 800, margin: '0 auto' }}>

/* ✅ 올바른 방법 */
<div className="container">

/* CSS 파일에서 */
.container {
  max-width: 800px;
  margin: 0 auto;
}
```

**예외:** 동적 값이 필요한 경우만 허용
```tsx
/* ✅ 허용 */
<div style={{ height: `${progress}%` }}>
```

---

## ⚛️ 3. React 컴포넌트 규칙

### 3.1 컴포넌트 크기 제한

- **권장:** 100줄 이하
- **최대:** 200줄 (초과 시 분리 고려)
- **기준:** 로직 복잡도, 재사용성

**분리 기준:**
```tsx
/* ❌ 너무 큼 (250줄) */
export default function LessonManagePage() {
  // 필터링 로직 50줄
  // 테이블 렌더링 100줄
  // 모달 로직 100줄
}

/* ✅ 분리 */
export default function LessonManagePage() {
  return (
    <>
      <LessonFilter />
      <LessonTable />
      <LessonModal />
    </>
  );
}
```

### 3.2 라우팅

**React Router 사용:**
```tsx
import { useNavigate } from 'react-router-dom';

/* ✅ 올바른 방법 */
const navigate = useNavigate();
navigate('/path');

/* ❌ 잘못된 방법 */
window.location.href = '/path';  // 페이지 전체 새로고침
```

### 3.3 Props 타입 정의

```tsx
/* ✅ 올바른 방법 */
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export default function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  // ...
}

/* ❌ 잘못된 방법 */
export default function Button(props: any) {  // any 금지
  // ...
}
```

---

## 🗂️ 4. 파일 네이밍 (File Naming)

### 컴포넌트 파일
```
PascalCase.tsx  ← 컴포넌트
camelCase.ts    ← 유틸, 훅
kebab-case.css  ← CSS
SCREAMING_SNAKE_CASE.md  ← 문서
```

**예시:**
```
✅ BottomTabBar.tsx
✅ useAuth.ts
✅ button.css
✅ README.md

❌ bottomTabBar.tsx
❌ UseAuth.ts
❌ Button.css
```

---

## 🔧 5. 환경 변수 (Environment Variables)

### 규칙
```bash
# ✅ Vite 환경변수는 VITE_ 접두사 필수
VITE_API_BASE_URL=http://localhost:8080

# ❌ 접두사 없으면 브라우저에서 접근 불가
API_BASE_URL=http://localhost:8080
```

### 사용
```typescript
// ✅ 올바른 방법
const apiUrl = import.meta.env.VITE_API_BASE_URL;

// ❌ Node.js 방식 (Vite에서 동작 안 함)
const apiUrl = process.env.API_BASE_URL;
```

---

## 🎯 6. Git 커밋 메시지

### 커밋 타입
```
feat:     새로운 기능 추가
fix:      버그 수정
refactor: 리팩토링 (기능 변경 없음)
style:    코드 포맷팅, 세미콜론 등
chore:    빌드, 설정 변경
docs:     문서 수정
test:     테스트 코드
perf:     성능 개선
```

### 예시
```bash
✅ feat: 레슨 예약 캘린더 추가
✅ fix: BottomTabBar 라우팅 오류 수정
✅ refactor: HomePage 인라인 스타일 제거
✅ chore: Vite 빌드 설정 최적화

❌ "수정함"
❌ "버그 고침"
❌ "작업 완료"
```

---

## 📦 7. 번들 최적화

### Code Splitting 필수

**vite.config.ts에서 설정:**
```typescript
build: {
  rollupOptions: {
    output: {
      manualChunks(id) {
        if (id.includes('node_modules')) {
          // 라이브러리별 분리
          if (id.includes('react')) return 'vendor-react';
          if (id.includes('calendar')) return 'vendor-calendar';
          // ...
        }
      }
    }
  }
}
```

### 목표
- JS 파일 하나가 500KB 초과 금지
- 첫 로딩 번들 크기 200KB 이하 (gzip)

---

## 🧪 8. 성능 최적화

### Context 최적화
```tsx
/* ✅ 올바른 방법 */
const value = useMemo(() => ({ user, login, logout }), [user]);

return (
  <AuthContext.Provider value={value}>
    {children}
  </AuthContext.Provider>
);

/* ❌ 매 렌더링마다 새 객체 생성 */
return (
  <AuthContext.Provider value={{ user, login, logout }}>
```

### 무거운 컴포넌트 메모이제이션
```tsx
const ExpensiveComponent = React.memo(function ExpensiveComponent({ data }) {
  // 복잡한 계산...
});
```

---

## ✅ 9. 체크리스트

### PR 전 필수 확인 사항
- [ ] 브레이크포인트가 768px, 1024px인가?
- [ ] CSS 변수를 사용했는가? (하드코딩 금지)
- [ ] 인라인 스타일을 사용하지 않았는가?
- [ ] 컴포넌트가 200줄을 넘지 않는가?
- [ ] `window.location.href` 대신 `navigate`를 사용했는가?
- [ ] 타입을 `any`로 지정하지 않았는가?
- [ ] `npm run build`가 성공하는가?
- [ ] 커밋 메시지가 규칙을 따르는가?

### 배포 전 체크리스트
- [ ] `.env.production`에 실제 API URL 입력했는가?
- [ ] JS 번들 크기가 500KB 이하인가?
- [ ] 모바일 반응형이 정상 작동하는가?
- [ ] 브라우저 콘솔에 에러가 없는가?

---

## 📚 참고 문서

- **디자인 시스템:** `DESIGN_SYSTEM.md`
- **반응형 가이드:** `src/shared/css/ui/responsive.css`
- **프로젝트 README:** `FRONTEND_README.md`
- **할 일 목록:** `TODO.md`

---

**마지막 업데이트:** 2026-02-20  
**작성자:** GitHub Copilot CLI
