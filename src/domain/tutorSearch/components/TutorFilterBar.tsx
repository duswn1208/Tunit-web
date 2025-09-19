import '../css/tutor-search.css';
import LessonFilter from './LessonFilter';
import RegionFilter from './RegionFilter';

export function TutorFilterBar({
  initialRegion = [],
  initialLessons = [],
}: {
  initialRegion?: any[];
  initialLessons?: string[];
}) {
  return (
    <div className="tutor-filter-bar" style={{ position: 'relative' }}>
      <RegionFilter initialRegion={initialRegion} />
      <LessonFilter initialLessons={initialLessons} />
      <button className="filter-chip">후기 많은 순</button>
    </div>
  );
}
