# Tunit Design System

## 색상 시스템 (Color System)

### 브랜드 색상 (Brand Colors)

```css
--brand-red: #ff4757      /* 주요 브랜드 색상 - CTA, 중요 강조점에 사용 */
--brand-red-dark: #e6394a /* 호버/클릭 상태에서 사용 */
--brand-red-light: #ff6b7a/* 보조 강조나 그라데이션에 사용 */
--brand-mint: #1ec9bb     /* 보조 브랜드 색상 - 성공/완료 상태에 사용 */
```

### 배경 색상 (Background Colors)

```css
--bg-gray: #f8fafc    /* 전체 페이지 배경 */
--bg-modal: #ffffff   /* 카드, 모달 등 컴포넌트 배경 */
```

### 텍스트 색상 (Text Colors)

```css
--text-primary: #1a202c   /* 주요 텍스트 - 제목, 본문 */
--text-secondary: #4a5568 /* 보조 텍스트 - 부제목, 설명 */
--text-muted: #718096     /* 부가 정보 */
```

### 테두리 & 구분선 (Borders)

```css
--border-light: #e2e8f0   /* 카드, 섹션 구분 */
--border-input: #cbd5e0   /* 입력 필드 테두리 */
```

### 그림자 효과 (Shadows)

```css
--shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.05)   /* 작은 요소 (버튼, 카드) */
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.05)   /* 중간 크기 요소 (호버 상태) */
--shadow-lg: 0 10px 30px rgba(0, 0, 0, 0.08) /* 큰 요소 (모달, 팝업) */
```

## 타이포그래피 (Typography)

### 글꼴 크기

- 큰 제목: 36px (font-size: 36px)
- 중간 제목: 24px
- 작은 제목: 18px
- 본문: 16px
- 부가 정보: 14px

### 글꼴 굵기

- 굵게 (Bold): 700 - 제목, 강조
- 중간 (Semi-bold): 600 - 부제목, 버튼
- 기본 (Regular): 400 - 본문

## 컴포넌트 가이드라인

### 버튼 (Button)

1. Primary Button

   - 브랜드 그라데이션 배경 사용
   - 흰색 텍스트
   - 그림자 효과로 입체감 부여
   - 호버 시 살짝 위로 떠오르는 애니메이션

2. 선택 카드 (Radio Card)
   - 넓은 클릭 영역
   - 선택 시 브랜드 색상 테두리와 텍스트
   - 호버 시 부드러운 애니메이션

### 입력 필드 (Input)

- 충분한 패딩 (12px 16px)
- 포커스 시 브랜드 색상 테두리
- 부드러운 그림자 효과

### 레이아웃 (Layout)

- 최대 너비: 760px (컨텐츠 영역)
- 여백: 32px (섹션 간)
- 카드 모서리: 16px-32px border-radius

## 애니메이션 가이드라인

### 트랜지션

- 기본 duration: 0.2s
- timing-function: ease
- 호버/클릭 시 transform: translateY() 사용
- 그림자 변화와 함께 적용

## 접근성 (Accessibility)

- 충분한 색상 대비
- 키보드 포커스 표시
- 적절한 클릭 영역 크기
- 시각적 피드백 제공

## CSS 변수 사용 규칙

1. 직접적인 색상값 사용 금지, 항상 CSS 변수 사용
2. RGB 값이 필요한 경우 별도의 RGB 변수 정의
3. 새로운 색상 추가 시 index.css에 변수 정의 후 사용

## 에러 처리 가이드라인

### 데이터/네트워크 오류 안내

- 데이터 조회, API 호출 등에서 오류가 발생할 경우 화면에 div 등으로 에러 메시지를 직접 표시하지 않고, 반드시 Toast 컴포넌트(공통 Toast)를 사용하여 사용자에게 에러를 안내해야 합니다.
- 모든 도메인/컴포넌트에서 동일하게 적용하며, 예외 상황이 필요한 경우 사유를 명확히 주석으로 남깁니다.

예시)

```tsx
// 잘못된 예시
{
  error && <div>에러가 발생했습니다</div>;
}

// 올바른 예시
const { showToast } = useToast();
useEffect(() => {
  if (error) showToast('데이터를 불러오지 못했습니다.', 'error');
}, [error]);
```

---

## 컴포넌트 구조화

1. 컴포넌트별 CSS 파일 분리
2. 공통 스타일은 ui/ 디렉토리에 저장
3. 페이지별 스타일은 해당 도메인 디렉토리에 저장
