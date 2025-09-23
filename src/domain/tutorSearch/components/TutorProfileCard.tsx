import type { Category, SubCategory } from '../../../type/onboarding';
import type { Region } from '../../region/types/regions';

export interface TutorProfile {
  tutorProfileNo: string;
  name: string;
  introduce: string;
  photoUrl?: string;
  regionList: Region[];
  lessonSubcategoryList: SubCategory[];
  careerYears: number;
  pricePerHour: number;
  rating?: number;
}

export function TutorProfileCard({ tutor }: { tutor: TutorProfile }) {
  return (
    <div className="tutor-profile-card">
      <img src={tutor.photoUrl || '/default-profile.png'} alt={tutor.name} />
      <div className="tutor-info">
        <div className="tutor-name">{tutor?.name || 'tutor'}</div>
        <div className="tutor-region">{tutor.regionList.join(', ')}</div>
        <div className="tutor-lessons">{tutor.lessonSubcategoryList.join(', ')}</div>
        {tutor.rating !== undefined && (
          <div className="tutor-rating">★ {tutor.rating.toFixed(1)}</div>
        )}
      </div>
    </div>
  );
}
