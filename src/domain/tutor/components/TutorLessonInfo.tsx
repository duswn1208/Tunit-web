import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
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
          <div className="tutor-tag-row">
            {lessonData.lessonSubcategoryList?.map((lesson) => (
              <span key={lesson.tutorLessonNo} className="tutor-tag tutor-tag--lesson">
                {lesson.lessonCategory.label}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h3 className="info-subtitle">레슨 가능 지역</h3>
          <div className="tutor-tag-row">
            {lessonData.regionList?.map((region) => (
              <span key={region.code} className="tutor-tag tutor-tag--region">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="tutor-tag-icon" />
                {region.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
