# 튜닛 Design System v1.0

> AI나 개발자에게 전달할 디자인 시스템 레퍼런스.
> 이 파일을 컨텍스트로 제공하면 일관된 UI를 생성할 수 있습니다.

---

## 1. 서비스 개요 & 컨텍스트

튜닛(Tuneet)은 강의·운동·요가 등 **1:1 레슨을 관리하는 B2B SaaS 웹앱**입니다.

**핵심 특징**
- 튜터(선생님)가 돈을 내는 주 타겟
- 고정 반복 레슨(예: 매주 월요일 18:00) + 단건 레슨 동시 관리
- 학생이 연락 없이 앱에서 직접 레슨 신청/취소 가능
- 선착순 레슨, 체험 레슨, 정기레슨 등 다양한 레슨 타입

**사용자**
- 튜터: 레슨 관리, 학생 관리, 스케줄 설정
- 학생: 튜터 탐색, 레슨 예약/취소

**레슨 상태 5가지**
```
신청(pending) → 확정(confirmed) → 완료(completed)
취소(cancelled) / 만료/노소(expired)
```

---

## 2. 디자인 토큰

### 컬러

```css
/* 브랜드 */
--color-primary:    #4F59D6   /* 블루-퍼플, 메인 */
--color-primary-bg: #EEEFFE   /* 브랜드 연배경 */

/* 배경 */
--bg-base:    #F9FAFB   /* 페이지 배경 */
--bg-surface: #FFFFFF   /* 카드/패널 배경 */

/* 텍스트 */
--text-primary:   #191F28   /* 제목/본문 */
--text-secondary: #4E5968   /* 보조 텍스트 */
--text-tertiary:  #8B95A1   /* 힌트/플레이스홀더 */

/* 보더 */
--border: #E5E8EB
```

### 레슨 상태 컬러

| 상태 | 텍스트 | 배경 | CSS 변수 |
|------|--------|------|----------|
| 신청 pending | `#6B4EFF` | `#F3F0FF` | `--lesson-pending` / `--lesson-pending-bg` |
| 확정 confirmed | `#0075FF` | `#E8F3FF` | `--lesson-confirmed` / `--lesson-confirmed-bg` |
| 완료 completed | `#00B386` | `#E6FAF5` | `--lesson-completed` / `--lesson-completed-bg` |
| 취소 cancelled | `#F04452` | `#FFF0F1` | `--lesson-cancelled` / `--lesson-cancelled-bg` |
| 만료 expired | `#8B95A1` | `#F2F4F6` | `--lesson-expired` / `--lesson-expired-bg` |
| 체험 trial | `#FF6B35` | `#FFF3EE` | `--lesson-trial` / `--lesson-trial-bg` |
| 선착순 firstcome | `#F7A300` | `#FFFBEE` | `--lesson-firstcome` / `--lesson-firstcome-bg` |
| 반복 recurring | `#4F59D6` | `#EEEFFE` | `--lesson-recurring` / `--lesson-recurring-bg` |

### 타이포그래피

```
폰트:  Pretendard Variable (CDN)
       https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.8/dist/web/variable/pretendardvariable-dynamic-subset.css

자간:  letter-spacing -0.2px ~ -0.5px (한국어 최적화)
굵기:  Bold 700    — 헤딩, 숫자
       SemiBold 600 — 버튼, 강조
       Regular 400  — 본문
```

### 컴포넌트 Radius

```css
--radius-card:   12px
--radius-btn:    10px
--radius-chip:   5px
--radius-modal:  16px
--radius-input:  10px
--radius-avatar: 50%

/* 헤더 높이 */
header height: 52px
/* 드로어 너비 */
drawer width: 420px
```

### 그림자

```css
--shadow-card:   0 2px 12px rgba(0,0,0,0.06)        /* 기본 카드 */
--shadow-hover:  0 4px 16px rgba(79,89,214,0.10)     /* 호버 시 */
--shadow-drawer: -8px 0 48px rgba(0,0,0,0.12)        /* 드로어 패널 */
--shadow-brand:  0 2px 8px rgba(79,89,214,0.28)      /* 브랜드 버튼 */
```

### 트랜지션

```css
--transition-base:   all 0.15s ease
--transition-drawer: transform 0.3s cubic-bezier(0.32,0.72,0,1)
--transition-bg:     opacity 0.25s ease
```

---

## 3. 공통 인터랙션 패턴

### 드로어 패턴
- 항목 클릭 → 420px 드로어 패널 우측(`right:0`)에서 슬라이드인
- 배경 오버레이: `rgba(0,0,0,0.36)`, 클릭 시 닫힘
- `transform: translateX(0 ↔ 100%)`, `transition: 0.3s cubic-bezier(0.32,0.72,0,1)`

### 토스트 알림
- 위치: 하단 중앙 `fixed`
- 등장/퇴장: `opacity + translateY`
- 2.5초 후 자동 사라짐
- 타입: `success`(초록) / `info`(파랑) / `error`(빨강)

### 호버 퀵액션
- 카드/칩에 마우스 오버 시 액션 버튼 `display:flex`로 출현
- 칩 호버: `translateY(-1px)` + `box-shadow` 증가

### 스탯 카드 인터랙션
- 클릭 가능한 경우: 호버 시 테두리 `#D4D7FC` + 그림자 증가
- 활성 상태: 배경 `#EEEFFE`, 텍스트/테두리 `#4F59D6`

### 레슨 칩 (캘린더)
- 반복 레슨: 좌측 `3px` 세로 accent bar
- 타입 뱃지: 체험(`#FF6B35`) / 선착순(`#F7A300`) 우측 상단
- 상태별 배경색 + 텍스트색으로 구분

### 진행률 도트
- 이산값(4회, 8회)에는 바 대신 `● ● ● ○` 도트 사용
- 체험 레슨: 도트 없음, "정식 등록 제안 →" CTA 버튼

### Sticky 탭 + 스크롤스파이
- 탭바: `position:sticky`, `top:52px` (헤더 높이)
- 스크롤 위치에 따라 활성 탭 자동 변경
- 탭 클릭 시 해당 섹션으로 `smooth scroll`

### 아바타 (이미지 없을 때)
- 이름 앞 2글자 이니셜 표시
- 배경: 이름 기반 accent 컬러 + `22` (투명도 hex)
- 텍스트: 같은 accent 컬러

---

## 4. 페이지별 요구사항

### TUTOR — 레슨 관리 캘린더

**현재 문제**
- 캘린더가 빈 그리드만 있고 레슨 칩이 없음
- 통계 카드 클릭 불가, 인터랙션 없음

**개선 요구사항**
1. 헤더: 튜닛 로고 + 내 레슨/내 학생 nav + 벨 아이콘 + 학원명 버튼
2. 통계 4개 (오늘/이번주 남은/신청 대기/이번달) — 클릭 가능, 신청 대기는 주황 강조
3. 신청 대기 배너 (황색, 확인하기 버튼)
4. 오늘의 레슨 스트립 — 오늘 레슨을 카드로 가로 나열, 퀵 확정/취소 버튼
5. 캘린더 셀 호버 → `+` 버튼 출현
6. 레슨 칩: 상태별 컬러, 반복 레슨은 좌측 accent bar, 체험/선착순 타입 뱃지
7. 레슨 칩 클릭 → 드로어 패널 슬라이드인
8. 드로어: 학생 정보 + 상태 변경 버튼 4개 + 날짜/시간 + 메모 + 액션 버튼
9. 월간/주간 뷰 토글 (주간 뷰는 시간 그리드)
10. 토스트 알림 (상태 변경 시)

---

### TUTOR — 내 학생 관리

**현재 문제**
- 탭 3개(요청/진행중/종료)만 있고 카드가 너무 단조로움
- 학생 정보 위계가 없음, 이름이 크게 강조 안 됨

**개선 요구사항**
1. 상단 요약 통계 4개 (전체/진행중/신청 대기/고정 레슨)
2. 탭 3개에 카운트 뱃지
3. [요청 학생] 탭: 요청 메시지 표시 + [수락]/[거절] 버튼 눈에 띄게
4. [진행중 학생] 카드:
   - 컬러 아바타 (이름 2글자 + 이름 기반 컬러)
   - 레벨 뱃지 (초급/중급/고급 컬러 구분)
   - 다음 레슨 날짜, 장소, 이번달 레슨 횟수
   - 수강료 오른쪽에 크고 굵게
   - 호버 시 [레슨 보기][중단] 버튼 출현
   - 하단 진행률: 바 대신 `● ● ● ○` 도트
   - 체험 레슨: 도트 없음, 황색 카드 배경, "정식 등록 제안 →" CTA
5. 카드 클릭 → 드로어 (학생 정보 + 최근 레슨 내역 + 메모)
6. [종료된 학생]: 흐릿하게 처리, [재등록] 버튼
7. 학생 초대 버튼

---

### STUDENT — 튜터 찾기

**현재 문제**
- 회색 기본 아이콘 → 튜터 익명처럼 보여 신뢰 부족
- 별점/후기 수 없음 → 선택 기준 없음
- 가격이 태그에 묻혀있음

**개선 요구사항**
1. 상단 검색바 (이름, 종목, 지역 통합 검색)
2. 필터 칩: 지역 / 레슨 종류 / 가격대 (활성 시 `#4F59D6` 강조)
3. 우측 정렬 드롭다운 (후기 많은 순 / 가격 낮은 순 / 평점 높은 순)
4. 튜터 카드:
   - 이름 기반 컬러 아바타 (64px, radius 16px)
   - 이름 + 별점(⭐ 4.8) + 후기 수
   - 한 줄 소개 (말줄임)
   - 경력 뱃지 (`#4F59D6`) + 레슨 타입 태그 (회색)
   - 가격: 오른쪽에 크고 굵게 (X,XXX원/회)
   - 호버 시 [체험 레슨 신청] 버튼 출현
5. 카드 클릭 → 튜터 프로필 페이지로 이동

---

### STUDENT — 튜터 프로필

**현재 문제**
- 회색 기본 아이콘
- CTA 버튼 3개가 스타일 불일치
- 탭 콘텐츠가 텍스트 나열

**개선 요구사항**
1. ← 목록으로 버튼 (outline 스타일)
2. 히어로 카드:
   - 큰 컬러 아바타 (80px, radius 20px)
   - 이름 + 별점 + 후기 수
   - 경력 뱃지(파랑) + 가격 뱃지(초록) + 레슨타입 태그
3. CTA 버튼 위계:
   - **Primary** (채움): 상담/체험 레슨 예약 — 가장 먼저 시도할 액션
   - **Outline**: 정기레슨 신청
   - **Soft** (황색): 선착순 레슨 예약
4. Sticky 탭 (`top:52px`) — 튜터소개 / 레슨시간 / 레슨후기 / FAQ
5. 스크롤 시 탭 자동 활성화 (스크롤스파이)
6. 탭 클릭 시 해당 섹션으로 smooth scroll
7. [튜터소개]: 소개 텍스트 + 자격/이력 리스트
8. [레슨시간]: 요일별 가능 시간 (불가 요일 흐릿하게)
9. [레슨후기]: 별점 요약 + 개별 리뷰 카드
10. [FAQ]: 클릭 시 답변 펼쳐지는 아코디언

---

## 5. 컴포넌트 퀵 레퍼런스

### Button variants

```tsx
// Primary (기본)
<button className="ui-btn">확정</button>

// Outline
<button className="ui-btn ui-btn--outline">취소</button>

// Ghost
<button className="ui-btn ui-btn--ghost">더보기</button>

// Soft (연배경)
<button className="ui-btn ui-btn--soft">선착순 예약</button>

// Danger
<button className="ui-btn ui-btn--danger">삭제</button>

// Full width
<button className="ui-btn ui-btn--full">저장</button>

// Small
<button className="ui-btn ui-btn--sm">수락</button>
```

### 레슨 상태 칩

```tsx
// 상태별 className 패턴
<span className="lesson-chip lesson-chip--pending">신청</span>
<span className="lesson-chip lesson-chip--confirmed">확정</span>
<span className="lesson-chip lesson-chip--completed">완료</span>
<span className="lesson-chip lesson-chip--cancelled">취소</span>
<span className="lesson-chip lesson-chip--trial">체험</span>
<span className="lesson-chip lesson-chip--firstcome">선착순</span>
```

### 아바타 (이니셜)

```tsx
// 이름 기반 컬러 생성 로직
const ACCENT_COLORS = ['#4F59D6','#6B4EFF','#0075FF','#00B386','#FF6B35','#F7A300','#F04452'];
function getAvatarColor(name: string) {
  const idx = name.charCodeAt(0) % ACCENT_COLORS.length;
  return ACCENT_COLORS[idx];
}

// JSX
const color = getAvatarColor(name);
<div style={{ background: color + '22', color }}>
  {name.slice(0, 2)}
</div>
```

### 드로어

```tsx
// 열림 상태에 따라 translateX 제어
<div style={{
  position: 'fixed',
  right: 0, top: 0, bottom: 0,
  width: '420px',
  transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
  transition: 'transform 0.3s cubic-bezier(0.32,0.72,0,1)',
  boxShadow: 'var(--shadow-drawer)',
  background: 'var(--bg-surface)',
  zIndex: 50,
}} />
{/* 오버레이 */}
<div style={{
  position: 'fixed', inset: 0,
  background: 'rgba(0,0,0,0.36)',
  opacity: isOpen ? 1 : 0,
  transition: 'opacity 0.25s ease',
  pointerEvents: isOpen ? 'auto' : 'none',
  zIndex: 49,
}} onClick={onClose} />
```
