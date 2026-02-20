# TODO

## 🔴 High Priority

### UI/UX 개선
- [ ] 브레이크포인트 통일
  - 현재: 767px, 768px, 720px, 480px, 600px 혼용
  - 목표: 768px(모바일), 1024px(데스크탑)으로 통일
  - 파일: `src/shared/css/ui/responsive.css`, `src/shared/css/components/*.css`, `src/shared/css/layouts/*.css`

- [ ] 모바일 레이아웃 패딩 수정
  - `src/shared/css/layouts/layout.css` - `.main` 모바일 패딩 0 → 16px
  - 현재: 콘텐츠가 화면 끝까지 붙을 수 있음

- [ ] BottomTabBar 브레이크포인트 통일
  - 현재: `@media (max-width: 600px)`
  - 목표: `@media (max-width: 768px)` (responsive.css 기준)

## 🟡 Medium Priority

### 코드 품질
- [ ] HomePage 인라인 스타일 제거
  - `src/domain/home/pages/HomePage.tsx` - `style` prop을 CSS 파일로 분리

- [ ] 큰 컴포넌트 분할
  - `InlineDateTimePicker.tsx` (173줄) - 서브 컴포넌트로 분리 고려

### 성능
- [ ] Context 최적화
  - `AlertContext`, `ToastContext`, `AuthContext`에 `useMemo`, `React.memo` 적용

## 🟢 Low Priority

### 리팩토링
- [ ] SVG 아이콘 컴포넌트 분리
  - `BottomTabBar.tsx` - icons 객체를 별도 파일로 분리
  - 또는 lucide-react 사용 고려

### 배포
- [ ] `.env.production`에 실제 API 서버 주소 입력
  - 현재: `https://your-api-server.com` (placeholder)
