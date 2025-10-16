import Chip from '@/shared/components/Chip';
import type { TutorDetailResponse } from '../api/tutorApi';

interface TutorLessonInfoProps {
  lessonData: TutorDetailResponse;
}

export default function TutorLessonInfo({ lessonData }: TutorLessonInfoProps) {
  return (
    <div className="info-card">
      <h2 className="info-title">레슨 정보</h2>
      <div className="info-content">
        <div>
          <h3 className="info-subtitle">레슨 과목</h3>
          <div className="badge-group">
            {lessonData.lessonSubcategoryList?.map((lesson) => (
              <Chip
                key={lesson.tutorLessonNo}
                label={lesson.lessonCategory.label}
                variant="gray"
                size="md"
                style={{ border: 'none' }}
              />
            ))}
          </div>
        </div>
        <div>
          <h3 className="info-subtitle">레슨 가능 지역</h3>
          <div className="badge-group">
            {lessonData.regionList?.map((region) => (
              <Chip
                key={region.code}
                label={region.label}
                variant="gray"
                size="md"
                style={{ border: 'none' }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
