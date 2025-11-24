import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import Chip from '@/shared/components/Chip.tsx';
import type { TutorDetail } from '../../tutor/api/types.ts';
import { Button } from '@/shared/components';

interface TutorProfileCardProps {
  tutor: TutorDetail;
  variant?: 'full' | 'summary';
  isMobile?: boolean;
}

export function TutorProfileCard({ tutor, variant = 'full', isMobile }: TutorProfileCardProps) {
  console.log('TutorProfileCard render', { tutor });
  return (
    <div className="tutor-profile info-card" style={{ position: 'relative' }}>
      {/* 데스크탑: 프로필 카드 우측 상단 버튼 */}
      {!isMobile && (
        <div
          className="info-card-action-buttons"
          style={{ position: 'absolute', top: 24, right: 24, zIndex: 2, display: 'flex', gap: 8 }}
        >
          <Button
            className="booking-button"
            onClick={() => window.dispatchEvent(new CustomEvent('tutor-booking-trial'))}
          >
            상담/체험 레슨 예약
          </Button>
          <Button
            className="booking-button booking-button--outline"
            onClick={() => window.dispatchEvent(new CustomEvent('tutor-booking-regular'))}
          >
            정기레슨 신청
          </Button>
          <Button
            className="booking-button booking-button--fast"
            onClick={() => window.dispatchEvent(new CustomEvent('tutor-booking-fast'))}
          >
            선착순 레슨 예약
          </Button>
        </div>
      )}
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
