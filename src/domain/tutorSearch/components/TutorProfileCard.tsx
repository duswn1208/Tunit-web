import type { Category, SubCategory } from '../../../type/onboarding';
import type { Region } from '../../region/types/regions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

export interface LessonSubcategory {
  tutorLessonNo: number;
  isMain: boolean;
  lessonCategory: Category;
}
export interface TutorProfile {
  tutorProfileNo: string;
  name: string;
  introduce: string;
  photoUrl?: string;
  regionList: Region[];
  lessonSubcategoryList: LessonSubcategory[];
  careerYears: number;
  pricePerHour: number;
  rating?: number;
}

export function TutorProfileCard({ tutor }: { tutor: TutorProfile }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/tutors/${tutor.tutorProfileNo}`);
  };

  return (
    <div
      className="tutor-profile-card"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
    >
      {tutor.photoUrl ? (
        <img src={tutor.photoUrl} alt={tutor.name} className="tutor-profile-image" />
      ) : (
        <div className="tutor-profile-icon">
          <FontAwesomeIcon icon={faUser} size="2x" />
        </div>
      )}
      <div className="tutor-info">
        <div className="tutor-name">{tutor?.name || 'tutor'}</div>
        <div className="tutor-introduce">
          <i className="fa-solid fa-quote-left quote-icon-left"></i>
          <span>
            {tutor.introduce}
            <i className="fa-solid fa-quote-right quote-icon-right"></i>
          </span>
        </div>
        <div className="tutor-meta">
          <span className="tutor-career">
            <i
              className={`fa-solid fa-trophy ${
                tutor.careerYears > 5 ? 'gold' : tutor.careerYears > 3 ? 'silver' : 'bronze'
              }`}
            ></i>
            {tutor.careerYears}년 경력
          </span>
          <span className="tutor-price">
            <i className="fa-solid fa-coins"></i>
            {Math.floor(tutor.pricePerHour / 10000)}만원
          </span>
          <span className="tutor-region">
            <i className="fa-solid fa-location-dot"></i>
            {tutor.regionList.map((region) => region.label).join(', ')}
          </span>
        </div>
        <div className="tutor-lessons">
          {tutor.lessonSubcategoryList.map((lesson) => (
            <span key={lesson.tutorLessonNo} className="lesson-chip">
              {lesson.lessonCategory.label}
            </span>
          ))}
        </div>
        {tutor.rating !== undefined && (
          <div className="tutor-rating">★ {tutor.rating.toFixed(1)}</div>
        )}
      </div>
    </div>
  );
}
