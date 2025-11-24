import type { TutorProfile } from '@/domain/tutor/api/types';
import { TutorProfileCard } from './TutorProfileCard';

export default function TutorProfileList({ tutors }: { tutors: TutorProfile[] }) {
  return (
    <div className="tutor-profile-list">
      {tutors.length === 0 ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#aaa',
            padding: '48px 0',
            fontSize: '18px',
            width: '100%',
          }}
        >
          조건에 맞는 튜터가 없어요 😭
        </div>
      ) : (
        tutors.map((tutor) => <TutorProfileCard key={tutor.tutorProfileNo} tutor={tutor} />)
      )}
    </div>
  );
}
