# 튜닛 (Tunit) Design System v1.0

> 1:1 레슨 예약 관리 서비스 튜닛의 디자인 시스템입니다.
> 모든 색상값의 단일 출처(Single Source of Truth)는 `src/shared/css/ui/ui-tokens.css` 입니다.
> 문서와 코드가 충돌할 경우 **항상 `ui-tokens.css`가 우선**합니다.

---

## 색상 시스템 (Color System)

### 브랜드 색상 (Brand Colors)

```css
--color-primary: #4F59D6       /* 주요 브랜드 색상 - CTA, 중요 강조점, 활성 상태 */
--color-primary-bg: #EEEFFE    /* 브랜드 연한 배경 - 선택 카드, soft 버튼 */
--color-primary-dark: #3d47b3  /* 호버/클릭 상태 */
--color-primary-light: #6370d8 /* 보조 강조, 그라데이션 */
```

> ⚠️ 구버전의 `--brand-red (#ff4757)`는 더 이상 사용하지 않습니다.
> 하위 호환을 위해 `--brand-red`는 `--color-primary`로 매핑되어 있으나, **신규 코드에서는 반드시 `--color-primary`를 사용**하세요.

### 배경 색상 (Background Colors)

```css
--bg-base: #F9FAFB     /* 전체 페이지 배경 */
--bg-surface: #FFFFFF  /* 카드, 모달, 드로어 등 컴포넌트 배경 */
```

### 텍스트 색상 (Text Colors)

```css
--text-primary: #191F28   /* 주요 텍스트 - 제목, 본문, 숫자 */
--text-secondary: #4E5968 /* 보조 텍스트 - 부제목, 설명 */
--text-tertiary: #8B95A1  /* 부가 정보 - 캡션, placeholder */
```

### 테두리 (Borders)

```css
--border: #E5E8EB         /* 카드, 섹션, 입력 필드 기본 테두리 */
--border-strong: #C9CDD2  /* 강조 테두리 */
```

### 레슨 상태 색상 (Lesson Status Colors)

레슨의 상태와 타입을 색으로 즉시 구분합니다. 각 상태는 텍스트 컬러 + 연한 배경(`-bg`) 쌍으로 구성됩니다.

| 상태 | 텍스트 변수 | 값 | 배경 변수 | 값 |
|---|---|---|---|---|
| 레슨 신청 | `--lesson-pending` | `#6B4EFF` | `--lesson-pending-bg` | `#F3F0FF` |
| 레슨 확정 | `--lesson-confirmed` | `#0075FF` | `--lesson-confirmed-bg` | `#E8F3FF` |
| 완료 | `--lesson-completed` | `#00B386` | `--lesson-completed-bg` | `#E6FAF5` |
| 취소 | `--lesson-cancelled` | `#F04452` | `--lesson-cancelled-bg` | `#FFF0F1` |
| 만료/노쇼 | `--lesson-expired` | `#8B95A1` | `--lesson-expired-bg` | `#F2F4F6` |
| 체험 레슨 | `--lesson-trial` | `#FF6B35` | `--lesson-trial-bg` | `#FFF3EE` |
| 선착순 | `--lesson-firstcome` | `#F7A300` | `--lesson-firstcome-bg` | `#FFFBEE` |
| 반복(고정) | `--lesson-recurring` | `#4F59D6` | `--lesson-recurring-bg` | `#EEEFFE` |

### 그림자 효과 (Shadows)

```css
--shadow-card:   0 2px 12px rgba(0, 0, 0, 0.06)    /* 카드 기본 */
--shadow-hover:  0 4px 16px rgba(79, 89, 214, 0.10) /* 호버 시 (브랜드 틴트) */
--shadow-drawer: -8px 0 48px rgba(0, 0, 0, 0.12)    /* 우측 드로어 패널 */
--shadow-brand:  0 2px 8px rgba(79, 89, 214, 0.28)  /* Primary 버튼 */
```

---

## 타이포그래피 (Typography)

### 글꼴

- **Pretendard Variable** (한국어 최적화) — `@fortawesome` 다음으로 `index.css`에서 로드
- 기본 자간: `letter-spacing: -0.2px` (헤딩은 -0.3 ~ -0.7px)

### 글꼴 크기

| 역할 | 크기 | 굵기 |
|---|---|---|
| Display / 큰 제목 | 28–32px | Bold 700 |
| Heading 1 | 24px | Bold 700 |
| Heading 2 | 20px | SemiBold 600 |
| Heading 3 | 17px | SemiBold 600 |
| Body 1 | 15px | Regular 400 |
| Body 2 | 13px | Regular 400 |
| Caption | 12px | Medium 500 |
| Badge / Label | 11px | Bold 700 |

### 글꼴 굵기

- **Bold 700** — 제목, 숫자(통계), 버튼, 뱃지
- **SemiBold 600** — 부제목, 강조 레이블
- **Regular 400** — 본문, 보조 텍스트

---

## 컴포넌트 가이드라인

### 둥근 모서리 (Radius)

```css
--radius-card:   12px   /* 카드 */
--radius-btn:    10px   /* 버튼 (md) */
--radius-chip:   5px    /* 칩 / 작은 뱃지 */
--radius-modal:  16px   /* 모달 */
--radius-input:  10px   /* 입력 필드 */
--radius-avatar: 50%    /* 아바타 */
```

### 버튼 (Button)

| Variant | 배경 | 텍스트 | 용도 |
|---|---|---|---|
| Primary | `--color-primary` | 흰색 | 주요 액션 (등록, 예약) |
| Secondary | `--color-primary-bg` | `--color-primary` | 보조 액션 |
| Outline | 투명 + 브랜드 테두리 | `--color-primary` | 차선 액션 |
| Ghost | 투명 | `--text-secondary` | 약한 액션 |
| Danger | `#F04452` | 흰색 | 삭제, 취소 |

- 호버 시 배경 어두워짐 + `--shadow-brand`
- 클릭 시 `transform: scale(0.97)`
- 그라데이션 배경은 사용하지 않습니다 (플랫 컬러).

### 입력 필드 (Input)

- 패딩 `10px 14px`, radius `--radius-input`
- 포커스 시 `--color-primary` 테두리 + `0 0 0 3px rgba(79,89,214,0.14)` 링
- 에러 시 `#F04452` 테두리 + 빨간 링

### 아바타 (Avatar)

- 이미지가 없으면 이름 앞 2글자 + **이름 기반 accent 컬러** 사용
- 배경: `accent + '22'` (투명), 텍스트: `accent`
- accent 팔레트: `['#6B4EFF','#0075FF','#00B386','#FF6B35','#F7A300','#F04452','#4F59D6']`

### 진행률 표시 (Progress)

- 레슨 횟수는 연속값이 아닌 **이산값**(4회, 8회)이므로 진행률 바 대신 **도트(● ● ● ○)** 를 사용합니다.
- 체험 레슨은 도트를 표시하지 않고 "정식 등록 제안 →" CTA로 대체합니다.

### 레이아웃 (Layout)

- 헤더 높이: `52px` (sticky, `--color-primary` 배경)
- 드로어 너비: `420px`
- 카드 간격: `10–16px`
- 페이지 좌우 여백: `24–40px`

---

## 아이콘 (Icons)

- **Font Awesome 6 Free (Solid)** 만 사용 — `index.css`에서 로드됨
- **이모지(🎓 ⚠ 📅 등)는 사용하지 않습니다.** 빈 상태·배너·안내 문구 포함 모든 곳에서 Font Awesome 아이콘으로 대체하세요.
- 아이콘 색상은 브랜드 컬러 또는 해당 컨텍스트 상태 컬러를 적용합니다.

---

## 애니메이션 가이드라인

```css
--transition-base:   all 0.15s ease                          /* 기본 호버/상태 */
--transition-drawer: transform 0.3s cubic-bezier(0.32,0.72,0,1) /* 드로어 슬라이드 */
--transition-bg:     opacity 0.25s ease                      /* 배경 오버레이 */
```

- 호버: `transform: translateY(-1px)` + 그림자 증가
- 클릭: `transform: scale(0.97)`
- 드로어: 우측에서 슬라이드인, 배경 오버레이 `rgba(0,0,0,0.36)`
- 토스트: 하단 중앙에서 등장, 2.5초 후 자동 사라짐

---

## 접근성 (Accessibility)

- 충분한 색상 대비 (텍스트/배경)
- 키보드 포커스 표시 (포커스 링)
- 클릭 영역 최소 44px
- 시각적 피드백 제공 (호버/액티브 상태)

---

## CSS 변수 사용 규칙

1. **직접 색상값(hex) 사용 금지** — 항상 `ui-tokens.css`의 CSS 변수 사용
2. RGB 값이 필요하면 `--color-primary-rgb` 같은 별도 RGB 변수 사용
3. 신규 색상 추가 시 `ui-tokens.css`에 변수 정의 후 사용
4. 구버전 별칭(`--brand-red` 등)은 하위 호환용일 뿐, **신규 코드에서는 신규 변수명 사용**

---

## 에러 처리 가이드라인

데이터/네트워크 오류는 화면에 `div`로 직접 표시하지 않고, 반드시 공통 **Toast** 컴포넌트로 안내합니다.

```tsx
// 잘못된 예시
{ error && <div>에러가 발생했습니다</div> }

// 올바른 예시
const { showToast } = useToast();
useEffect(() => {
  if (error) showToast('데이터를 불러오지 못했습니다.', 'error');
}, [error]);
```

---

## 컴포넌트 구조화

1. 컴포넌트별 CSS 파일 분리
2. 공통 스타일은 `src/shared/css/ui/` 에 저장
3. 페이지별 스타일은 해당 도메인 디렉토리(`src/domain/<도메인>/css/`)에 저장
4. 모든 토큰 정의는 `src/shared/css/ui/ui-tokens.css` 한 곳에서 관리
