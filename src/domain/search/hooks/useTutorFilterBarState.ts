import React from 'react';
import { useRegionSelect } from '../../region/hooks/useRegionSelect';
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

export interface UseTutorFilterBarStateProps {
  initialRegion?: any[];
  initialLessons?: string[];
}

export function useTutorFilterBarState({
  initialRegion = [],
  initialLessons = [],
}: UseTutorFilterBarStateProps) {
  const [regionSheetOpen, setRegionSheetOpen] = React.useState(false);
  const [lessonSheetOpen, setLessonSheetOpen] = React.useState(false);
  const [selectedLessons, setSelectedLessons] = React.useState<string[]>(initialLessons);
  const [selectedLessonCategory, setSelectedLessonCategory] = React.useState<string | null>(null);
  const [lessonCategories, setLessonCategories] = React.useState<Category[]>([]);
  const [lessonSubjects, setLessonSubjects] = React.useState<Record<string, SubCategory[]>>({});
  const isMobile = useIsMobile();

  // 레슨 카테고리/세부카테고리 fetch
  React.useEffect(() => {
    getMainLessonCategory().then((data) => setLessonCategories(data));
  }, []);
  React.useEffect(() => {
    if (!selectedLessonCategory) return;
    if (lessonSubjects[selectedLessonCategory]) return;
    getSubLessonCategory(selectedLessonCategory).then((data) =>
      setLessonSubjects((prev) => ({ ...prev, [selectedLessonCategory]: data }))
    );
  }, [selectedLessonCategory, lessonSubjects]);

  // initialLessons의 첫 번째 값의 상위 카테고리로 selectedLessonCategory 자동 설정
  React.useEffect(() => {
    if (!lessonCategories.length || !selectedLessons.length) return;
    for (const cat of lessonCategories) {
      if (lessonSubjects[cat.code]?.some((sub) => sub.code === selectedLessons[0])) {
        setSelectedLessonCategory(cat.code);
        return;
      }
    }
    setSelectedLessonCategory(null);
  }, [lessonCategories, lessonSubjects, selectedLessons]);

  // 지역 상태를 useRegionSelect로 관리 (컨트롤드)
  const region = useRegionSelect({ initialSelected: initialRegion });

  // 칩에 표시될 텍스트
  const regionLabel =
    region.selectedList.length === 0
      ? '전체 지역'
      : region.selectedList.length === 1
      ? region.selectedList[0].label
      : `${region.selectedList[0].label} 외 ${region.selectedList.length - 1}개`;
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

  return {
    regionSheetOpen,
    setRegionSheetOpen,
    lessonSheetOpen,
    setLessonSheetOpen,
    selectedLessons,
    setSelectedLessons,
    selectedLessonCategory,
    setSelectedLessonCategory,
    lessonCategories,
    lessonSubjects,
    lessonRightMap,
    isMobile,
    region,
    regionLabel,
    lessonLabel,
  };
}
