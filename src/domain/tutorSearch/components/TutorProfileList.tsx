import { TutorProfileCard, type TutorProfile } from './TutorProfileCard';

export default function TutorProfileList({ tutors }: { tutors: TutorProfile[] }) {
  return (
    <div className="tutor-profile-list">
      {tutors.map((tutor) => (
        <TutorProfileCard key={tutor.tutorProfileNo} tutor={tutor} />
      ))}
    </div>
  );
}
