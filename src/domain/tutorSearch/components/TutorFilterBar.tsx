import React, { useState, useEffect } from 'react';
import '../css/tutor-search.css';
import RegionSelector from '../../region/components/RegionSelector';
import { useRegionSelect } from '../../region/hooks/useRegionSelect';
import TwoColumnSelector from '../../../components/TwoColumnSelector';
import { getMainLessonCategory, getSubLessonCategory } from '../../lesson/api/categoryApi';
import type { Category, SubCategory } from '../../../type/onboarding';

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
  const [lessonCategories, setLessonCategories] = useState<Category[]>([]);
  const [lessonSubjects, setLessonSubjects] = useState<Record<string, SubCategory[]>>({});
  const isMobile = useIsMobile();

  // 레슨 카테고리/세부카테고리 fetch
  useEffect(() => {
    getMainLessonCategory().then((data) => setLessonCategories(data));
  }, []);
  useEffect(() => {
    if (!selectedLessonCategory) return;
    if (lessonSubjects[selectedLessonCategory]) return;
    getSubLessonCategory(selectedLessonCategory).then((data) =>
      setLessonSubjects((prev) => ({ ...prev, [selectedLessonCategory]: data }))
    );
  }, [selectedLessonCategory, lessonSubjects]);

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
      ? lessonSubjects[selectedLessonCategory || '']?.find((l) => l.code === selectedLessons[0])
          ?.label || selectedLessons[0]
      : `${
          lessonSubjects[selectedLessonCategory || '']?.find((l) => l.code === selectedLessons[0])
            ?.label || selectedLessons[0]
        } 외 ${selectedLessons.length - 1}개`;

  // TwoColumnSelector용 데이터 변환
  const lessonRightMap = React.useMemo(() => {
    const map: Record<string, { code: string; label: string }[]> = {};
    lessonCategories.forEach((cat) => {
      map[cat.code] = lessonSubjects[cat.code] || [];
    });
    return map;
  }, [lessonCategories, lessonSubjects]);

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
              leftOptions={lessonCategories}
              rightOptionsMap={lessonRightMap}
              leftTitle="레슨"
              rightTitle="세부 레슨"
              selectedLeft={selectedLessonCategory}
              setSelectedLeft={setSelectedLessonCategory}
              selectedRight={selectedLessons}
              toggleRight={(code) =>
                setSelectedLessons((prev) =>
                  prev.includes(code) ? prev.filter((v) => v !== code) : [...prev, code]
                )
              }
              onConfirm={() => setLessonSheetOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
