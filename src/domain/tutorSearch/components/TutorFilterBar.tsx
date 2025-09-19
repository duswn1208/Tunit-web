import React, { useState } from 'react';
import '../css/tutor-search.css';
import RegionSelector from '../../region/components/RegionSelector';
import { useRegionSelect } from '../../region/hooks/useRegionSelect';
import TwoColumnSelector from '../../../components/TwoColumnSelector';

// 예시: 과목 대분류/소분류 데이터 (실제 API 연동 시 대체)
const LESSON_CATEGORIES = [
  { code: 'eng', label: '영어' },
  { code: 'math', label: '수학' },
  { code: 'sci', label: '과학' },
];
const LESSON_SUBJECTS: Record<string, { code: string; label: string }[]> = {
  eng: [
    { code: 'eng-conv', label: '회화' },
    { code: 'eng-gram', label: '문법' },
    { code: 'eng-read', label: '독해' },
  ],
  math: [
    { code: 'math-basic', label: '기초수학' },
    { code: 'math-high', label: '고등수학' },
  ],
  sci: [
    { code: 'sci-phy', label: '물리' },
    { code: 'sci-chem', label: '화학' },
    { code: 'sci-bio', label: '생물' },
  ],
};

function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
}

export default function TutorFilterBar() {
  const [regionSheetOpen, setRegionSheetOpen] = useState(false);
  const [lessonSheetOpen, setLessonSheetOpen] = useState(false);
  const [selectedLessons, setSelectedLessons] = useState<string[]>([]);
  const [selectedLessonCategory, setSelectedLessonCategory] = useState<string | null>(null);
  const isMobile = useIsMobile();

  // 지역 상태를 useRegionSelect로 관리 (컨트롤드)
  const region = useRegionSelect();
  const {
    selectedList,
    sidos,
    activeSido,
    setSelectedSido,
    subregions,
    isSidoSelected,
    toggleSidoWhole,
    isGugunSelected,
    toggleGugun,
    stripParentPrefix,
  } = region;

  // 칩에 표시될 텍스트
  const regionLabel =
    selectedList.length === 0
      ? '전체 지역'
      : selectedList.length === 1
      ? selectedList[0].label
      : `${selectedList[0].label} 외 ${selectedList.length - 1}개`;
  const lessonLabel =
    selectedLessons.length === 0
      ? '전체 레슨'
      : selectedLessons.length === 1
      ? LESSON_SUBJECTS[selectedLessonCategory || '']?.find((l) => l.code === selectedLessons[0])
          ?.label || selectedLessons[0]
      : `${
          LESSON_SUBJECTS[selectedLessonCategory || '']?.find((l) => l.code === selectedLessons[0])
            ?.label || selectedLessons[0]
        } 외 ${selectedLessons.length - 1}개`;

  return (
    <div className="tutor-filter-bar" style={{ position: 'relative' }}>
      <button
        className={'filter-chip' + (selectedList.length ? ' selected' : '')}
        onClick={() => setRegionSheetOpen(true)}
      >
        {regionLabel} ▾
      </button>
      <button
        className={'filter-chip' + (selectedLessons.length ? ' selected' : '')}
        onClick={() => setLessonSheetOpen(true)}
      >
        {lessonLabel} ▾
      </button>
      <button className="filter-chip">후기 많은 순</button>

      {/* 지역 선택 UI */}
      {regionSheetOpen && (
        <div className="bottom-sheet" onClick={() => setRegionSheetOpen(false)}>
          <div className="bottom-sheet-content" onClick={(e) => e.stopPropagation()}>
            <RegionSelector
              sidos={sidos}
              activeSido={activeSido}
              setSelectedSido={setSelectedSido}
              subregions={subregions}
              isSidoSelected={isSidoSelected}
              toggleSidoWhole={toggleSidoWhole}
              isGugunSelected={isGugunSelected}
              toggleGugun={toggleGugun}
              loadingSido={region.loadingSido}
              loadingSub={region.loadingSub}
              error={region.error}
              onConfirm={() => setRegionSheetOpen(false)}
            />
          </div>
        </div>
      )}

      {/* 레슨 2단 바텀시트 */}
      {lessonSheetOpen && (
        <div className="bottom-sheet" onClick={() => setLessonSheetOpen(false)}>
          <div className="bottom-sheet-content" onClick={(e) => e.stopPropagation()}>
            <TwoColumnSelector
              leftOptions={LESSON_CATEGORIES}
              rightOptionsMap={LESSON_SUBJECTS}
              leftTitle="과목"
              rightTitle="세부과목"
              selectedLeft={selectedLessonCategory}
              setSelectedLeft={setSelectedLessonCategory}
              selectedRight={selectedLessons}
              toggleRight={(code) =>
                setSelectedLessons((prev) =>
                  prev.includes(code) ? prev.filter((v) => v !== code) : [...prev, code]
                )
              }
            />
            <div className="sheet-confirm" onClick={() => setLessonSheetOpen(false)}>
              확인
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
