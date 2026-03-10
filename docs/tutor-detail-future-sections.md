# 튜터 상세페이지 - 추가 예정 섹션

백엔드 API 개발 후 구현 예정인 섹션 목록.

현재 탭 구조:
```
['튜터소개', '레슨시간', '레슨후기', 'FAQ']
```

---

## 추가 후보 섹션

| 우선순위 | 섹션명 | 설명 | 필요 API 데이터 |
|---------|--------|------|----------------|
| ⭐⭐⭐ | **경력/자격증** | 신뢰도 형성. 학력, 자격증, 수상 이력, 강의 경력 등 | `careerList`, `certificationList` |
| ⭐⭐⭐ | **가격 안내** | 전환율 직결. 레슨 유형별 가격표 (체험/정기/선착순), 환불 정책 | `lessonPriceList` (현재 `lessonSubcategoryList`에 일부 포함) |
| ⭐⭐ | **레슨 방식** | 미스매치 방지. 온/오프라인 여부, 대면 위치, 온라인 툴, 수강생 레벨 | `lessonStyleList`, `targetLevelList` |
| ⭐ | **포트폴리오/미디어** | 차별화. 수업 영상, 결과물 사진, 레슨 샘플 | `portfolioList`, `mediaList` |
| ⭐ | **공지/현황** | 실시간 상태. 수강 모집 여부, 임시 휴강 공지 | `noticeList`, `statusInfo` |

---

## 구현 시 참고 사항

### 탭 추가 방법 (`TutorDetailPage.tsx`)
```tsx
// 현재
const TAB_LIST = ['튜터소개', '레슨시간', '레슨후기', 'FAQ'];
const SECTION_IDS = ['section-intro', 'section-schedule', 'section-review', 'section-faq'];

// 확장 예시 (경력/자격증 추가 시)
const TAB_LIST = ['튜터소개', '경력/자격증', '레슨시간', '레슨후기', 'FAQ'];
const SECTION_IDS = ['section-intro', 'section-career', 'section-schedule', 'section-review', 'section-faq'];
```

### 새 섹션 JSX 패턴
```tsx
<div id="section-career" className="tutor-section">
  <div className="info-card">
    <h2 className="info-title">경력 / 자격증</h2>
    {/* 내용 */}
  </div>
</div>
```

### CSS
- 새 섹션은 `.info-grid` 안에 넣으면 자동으로 seamless 카드 디자인 적용
- 별도 스타일 필요 시 `tutor-detail.css`에 추가
- 빈 상태: `.card-state` 클래스 사용

### API 타입 (`src/domain/tutor/api/types.ts`)
- `TutorDetail` 인터페이스에 새 필드 추가 필요
- 백엔드 응답 스펙 확정 후 반영

---

## 관련 파일

| 파일 | 역할 |
|------|------|
| `src/domain/tutor/pages/TutorDetailPage.tsx` | 탭 목록, 섹션 렌더링 |
| `src/domain/tutor/css/tutor-detail.css` | 상세 페이지 스타일 |
| `src/domain/tutor/api/types.ts` | TutorDetail 타입 정의 |
| `src/domain/profile/components/TutorProfileCard.tsx` | 프로필 카드 컴포넌트 |
