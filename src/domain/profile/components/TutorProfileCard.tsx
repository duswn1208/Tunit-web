import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import Chip from '@/shared/components/Chip.tsx';
import type { TutorDetail } from '../../tutor/api/types.ts';

interface TutorProfileCardProps {
  tutor: TutorDetail;
  variant?: 'full' | 'summary';
}

export default function TutorProfileCard({ tutor, variant = 'full' }: TutorProfileCardProps) {
  return (
    <div className="tutor-profile info-card">
      <div className="tutor-profile-header">
        {tutor.photoUrl ? (
          <img src={tutor.photoUrl} alt={tutor.nickname || '튜터'} className="tutor-avatar" />
        ) : (
          <div className="tutor-avatar-placeholder">
            <FontAwesomeIcon icon={faUser} className="text-4xl text-gray-500" />
          </div>
        )}
        <div className="tutor-info">
          <h1 className="tutor-name">{tutor.nickname || '튜터'}</h1>
          {variant === 'full' && tutor.introduce && (
            <div className="tutor-intro">{tutor.introduce}</div>
          )}
          <div className="tutor-badges">
            <Chip
              label={`경력 ${tutor.careerYears}년`}
              variant="blue"
              size="md"
              selected
              borderColor="#1d4ed8"
            />
            <Chip
              label={`시간당 ${tutor.pricePerHour.toLocaleString()}원`}
              variant="green"
              size="md"
              selected
              borderColor="#15803d"
            />
            {variant === 'full' && tutor.rating && (
              <Chip
                label={`평점 ${tutor.rating}`}
                variant="yellow"
                size="md"
                selected
                borderColor="#a16207"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
