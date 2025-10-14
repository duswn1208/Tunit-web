import { TutorProfileCard, type TutorProfile } from '../../search/components/TutorProfileCard.tsx';

export default function TutorProfileList({ tutors }: { tutors: TutorProfile[] }) {
  return (
    <div className="tutor-profile-list">
      {tutors.map((tutor) => (
        <TutorProfileCard key={tutor.tutorProfileNo} tutor={tutor} />
      ))}
    </div>
  );
}
