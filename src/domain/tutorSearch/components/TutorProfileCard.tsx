export interface TutorProfile {
  id: string;
  name: string;
  photoUrl?: string;
  region: string;
  lessons: string[];
  rating?: number;
}

export function TutorProfileCard({ tutor }: { tutor: TutorProfile }) {
  return (
    <div className="tutor-profile-card">
      <img src={tutor.photoUrl || '/default-profile.png'} alt={tutor.name} />
      <div className="tutor-info">
        <div className="tutor-name">{tutor.name}</div>
        <div className="tutor-region">{tutor.region}</div>
        <div className="tutor-lessons">{tutor.lessons.join(', ')}</div>
        {tutor.rating !== undefined && (
          <div className="tutor-rating">★ {tutor.rating.toFixed(1)}</div>
        )}
      </div>
    </div>
  );
}
