# 튜닛 웹앱 (Tunit Web)

🎵 **튜터/학생 1:1 레슨 예약 서비스**의 웹 프론트엔드 레포입니다.  
튜터는 웹앱을 통해 프로필 관리, 레슨 가능 시간 등록, 마이페이지 조회 등을 할 수 있습니다.

---

## 🚀 기술 스택

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) (개발 서버 & 번들러)
- [React Router](https://reactrouter.com/) (라우팅)
- [React Hook Form](https://react-hook-form.com/) (폼 관리)
- [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/) (코드 품질/스타일)
- CSS Modules (or Tailwind, 필요 시)

---

## 📂 프로젝트 구조

```bash
tunit-web/
  ├─ src/
  │  ├─ pages/         # 페이지 컴포넌트 (Login, OnboardingTutor, MyPage)
  │  ├─ components/    # 재사용 가능한 컴포넌트
  │  ├─ lib/           # api.ts, types.ts 등 공통 유틸
  │  ├─ styles/        # CSS 모듈
  │  ├─ App.tsx        # 라우팅 설정
  │  └─ main.tsx       # 엔트리 포인트
  └─ vite.config.ts
```
