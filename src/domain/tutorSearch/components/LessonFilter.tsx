import React from 'react';
import { useState, useEffect, useMemo } from 'react';
import TwoColumnSelector from '../../../components/TwoColumnSelector';
import { useLessonFilter } from '../hooks/useLessonFilter';

export interface LessonFilterProps {
  initialLessons?: string[];
  onChange?: (selected: any[]) => void;
}

export default function LessonFilter({ initialLessons = [], onChange }: LessonFilterProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedSubCategories, setSelectedSubCategories] = useState<any[]>(initialLessons);

  // 선택이 바뀔 때마다 상위로 전달
  useEffect(() => {
    if (typeof onChange === 'function') {
      onChange(selectedSubCategories);
    }
  }, [selectedSubCategories]);

  const { mainCategories, subCategories, selectedMainCategory, setSelectedMainCategory } =
    useLessonFilter(selectedSubCategories);

  const selectedLessonCodes: string[] = React.useMemo(() => {
    if (selectedSubCategories.length === 0) return [];

    return (selectedSubCategories as any[]).map((l) => l?.code || '');
  }, [selectedSubCategories]);

  // 표시할 라벨 계산
  const lessonLabel = useMemo(() => {
    if (selectedSubCategories.length === 0) return '전체 레슨';
    if (selectedSubCategories.length === 1) {
      return selectedSubCategories[0].label;
    }
    return `${selectedSubCategories[0].label} 외 ${selectedSubCategories.length - 1}개`;
  }, [selectedSubCategories]);

  const lessonRightMap = useMemo(() => {
    const map: Record<string, { code: string; label: string }[]> = {};
    mainCategories.forEach((cat) => {
      map[cat.code] = subCategories[cat.code] || [];
    });
    return map;
  }, [mainCategories, subCategories]);

  useEffect(() => {
    if (!mainCategories.length || !selectedSubCategories.length || selectedMainCategory) return;
    const found = mainCategories.find((cat) =>
      (subCategories[cat.code] || []).some(
        (sub) => String(sub.code) === String(selectedSubCategories[0])
      )
    );
    if (found) setSelectedMainCategory(found.code);
  }, [
    mainCategories,
    subCategories,
    selectedSubCategories,
    selectedMainCategory,
    setSelectedMainCategory,
  ]);

  return (
    <>
      <button
        className={'filter-chip' + (selectedLessonCodes.length ? ' selected' : '')}
        onClick={() => setSheetOpen(true)}
      >
        {lessonLabel} ▾
      </button>
      {sheetOpen && (
        <div className="bottom-sheet" onClick={() => setSheetOpen(false)}>
          <div className="bottom-sheet-content" onClick={(e) => e.stopPropagation()}>
            <TwoColumnSelector
              leftOptions={mainCategories}
              rightOptionsMap={lessonRightMap}
              leftTitle="레슨"
              rightTitle="세부 레슨"
              selectedLeft={selectedMainCategory}
              setSelectedLeft={setSelectedMainCategory}
              selectedRight={selectedLessonCodes}
              toggleRight={(code, label) => {
                setSelectedSubCategories((prev) => {
                  const exists = prev.find((l) => l.code === code);
                  if (exists) {
                    return prev.filter((l) => l.code !== code);
                  } else {
                    return [...prev, { code, label }];
                  }
                });
              }}
              onConfirm={() => setSheetOpen(false)}
              key={sheetOpen ? selectedLessonCodes.join(',') + (selectedMainCategory || '') : ''}
            />
          </div>
        </div>
      )}
    </>
  );
}
