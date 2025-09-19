import React from 'react';
import { useState, useEffect, useMemo } from 'react';
import TwoColumnSelector from '../../../components/TwoColumnSelector';
import type { Category, SubCategory } from '../../../type/onboarding';
import { useLessonFilter } from '../hooks/useLessonFilter';

export interface LessonFilterProps {
  initialLessons?: string[];
}

function getLessonLabel(
  code: string,
  mainCategories: Category[],
  subCategories: Record<string, SubCategory[]>
) {
  for (const cat of mainCategories) {
    const found = subCategories[cat.code]?.find((l) => l.code === code);
    if (found) return found.label;
  }
  return code;
}

export default function LessonFilter({ initialLessons = [] }: LessonFilterProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>(initialLessons);

  useEffect(() => {
    setSelectedSubCategories(initialLessons);
  }, [initialLessons]);

  const { mainCategories, subCategories, selectedMainCategory, setSelectedMainCategory } =
    useLessonFilter(selectedSubCategories);

  // selectedLessons가 string[]이 아닐 경우(code 대신 객체가 들어올 경우) 보정
  const normalizedSelectedLessons: string[] = React.useMemo(() => {
    if (selectedSubCategories.length === 0) return [];
    if (typeof selectedSubCategories[0] === 'string') return selectedSubCategories as string[];
    // 객체 배열일 경우 code만 추출
    return (selectedSubCategories as any[]).map((l) => l.code || l.lessonSubCategory?.code || '');
  }, [selectedSubCategories]);

  const labelMap = useMemo(() => {
    const map: Record<string, string> = {};
    mainCategories.forEach((cat) => {
      subCategories[cat.code]?.forEach((sub) => {
        map[sub.code] = sub.label;
      });
    });
    return map;
  }, [mainCategories, subCategories]);

  // 표시할 라벨 계산
  const lessonLabel = useMemo(() => {
    if (selectedSubCategories.length === 0) return '전체 레슨';
    if (selectedSubCategories.length === 1) {
      return getLessonLabel(selectedSubCategories[0], mainCategories, subCategories);
    }
    return `${getLessonLabel(selectedSubCategories[0], mainCategories, subCategories)} 외 ${
      selectedSubCategories.length - 1
    }개`;
  }, [selectedSubCategories, mainCategories, subCategories]);

  const lessonRightMap = useMemo(() => {
    const map: Record<string, { code: string; label: string }[]> = {};
    mainCategories.forEach((cat) => {
      map[cat.code] = subCategories[cat.code] || [];
    });
    return map;
  }, [mainCategories, subCategories]);

  return (
    <>
      <button
        className={'filter-chip' + (normalizedSelectedLessons.length ? ' selected' : '')}
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
              selectedRight={normalizedSelectedLessons}
              toggleRight={(code) => {
                setSelectedSubCategories((prev) => {
                  const arr =
                    typeof prev[0] === 'string'
                      ? prev
                      : (prev as any[]).map((l) => l.code || l.lessonSubCategory?.code || '');
                  return arr.includes(code) ? arr.filter((v) => v !== code) : [...arr, code];
                });
              }}
              onConfirm={() => setSheetOpen(false)}
              key={
                sheetOpen ? normalizedSelectedLessons.join(',') + (selectedMainCategory || '') : ''
              }
            />
          </div>
        </div>
      )}
    </>
  );
}
