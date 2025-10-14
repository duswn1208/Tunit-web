import '../css/tutor-search.css';
import LessonFilter from './LessonFilter';
import RegionFilter from './RegionFilter';

export function TutorFilterBar({
  initialRegion = [],
  initialLessons = [],
  onRegionChange,
  onLessonChange,
}: {
  initialRegion?: any[];
  initialLessons?: any[];
  onRegionChange?: (regionList: any[]) => void;
  onLessonChange?: (lessonList: any[]) => void;
}) {
  return (
    <div className="tutor-filter-bar" style={{ position: 'relative' }}>
      <RegionFilter initialRegion={initialRegion} onChange={onRegionChange} />
      <LessonFilter initialLessons={initialLessons} onChange={onLessonChange} />
      <button className="filter-chip">후기 많은 순</button>
    </div>
  );
}
