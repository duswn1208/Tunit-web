import '../css/tutor-search.css';
import LessonFilter from './LessonFilter';
import RegionFilter from './RegionFilter';
import { useState } from 'react';
import SelectBox from '@/shared/components/SelectBox';

export function TutorFilterBar({
  initialRegion = [],
  initialLessons = [],
  onRegionChange,
  onLessonChange,
  onSortChange,
  initialSort = 'REVIEW',
}: {
  initialRegion?: any[];
  initialLessons?: any[];
  onRegionChange?: (regionList: any[]) => void;
  onLessonChange?: (lessonList: any[]) => void;
  onSortChange?: (sortType: string) => void;
  initialSort?: string;
}) {
  const sortOptions = [
    { value: 'REVIEW', label: '후기 많은 순' },
    { value: 'RATING', label: '평점 높은 순' },
    { value: 'PRICE_LOW', label: '가격 낮은 순' },
    { value: 'LATEST', label: '최신 등록순' },
  ];
  const [sortType, setSortType] = useState(initialSort);

  const handleSortTypeChange = (value: string) => {
    setSortType(value);
    onSortChange?.(value);
  };

  return (
    <div className="tutor-filter-bar" style={{ position: 'relative' }}>
      <RegionFilter initialRegion={initialRegion} onChange={onRegionChange} />
      <LessonFilter initialLessons={initialLessons} onChange={onLessonChange} />
      <SelectBox
        value={sortType}
        options={sortOptions}
        onChange={handleSortTypeChange}
        className="filter-chip"
        aria-label="정렬 기준 선택"
      />
    </div>
  );
}
