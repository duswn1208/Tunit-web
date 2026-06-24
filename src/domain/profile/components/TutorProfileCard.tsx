import type { TutorProfile } from '@/domain/tutor/api/types.ts';
import { useNavigate } from 'react-router-dom';
import '../css/tutor-profile-card.css';

const ACCENT_COLORS = ['#4F59D6', '#6B4EFF', '#0075FF', '#00B386', '#FF6B35', '#F7A300', '#F04452'];

function getAvatarColor(name: string) {
  const idx = name.charCodeAt(0) % ACCENT_COLORS.length;
  return ACCENT_COLORS[idx];
}

interface TutorProfileCardProps {
  tutor: TutorProfile;
  variant?: 'full' | 'summary';
  isMobile?: boolean;
  clickable?: boolean;
}

export function TutorProfileCard({ tutor, variant = 'full', clickable = true }: TutorProfileCardProps) {
  const navigate = useNavigate();
  const name = tutor.userInfo?.nickname || '튜터';
  const avatarColor = getAvatarColor(name);

  const visibleLessons = tutor.lessonSubcategoryList?.slice(0, 3) ?? [];
  const extraLessons = (tutor.lessonSubcategoryList?.length ?? 0) - visibleLessons.length;

  const handleCardClick = () => {
    if (clickable) navigate(`/tutors/${tutor.tutorProfileNo}`);
  };

  const handleTrialClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.dispatchEvent(
      new CustomEvent('tutor-booking-trial', { detail: { tutorProfileNo: tutor.tutorProfileNo } })
    );
  };

  return (
    <div
      className={`tpc-card${clickable ? ' tpc-card--clickable' : ''}`}
      onClick={handleCardClick}
    >
      {/* 카드 본문: 아바타 + 정보 */}
      <div className="tpc-body">
        {/* 아바타 */}
        {tutor.photoUrl ? (
          <img src={tutor.photoUrl} alt={name} className="tpc-avatar" />
        ) : (
          <div
            className="tpc-avatar"
            style={{ background: avatarColor + '22', color: avatarColor }}
          >
            {name.slice(0, 2)}
          </div>
        )}

        {/* 정보 영역 */}
        <div className="tpc-info">
          {/* 이름 + 별점 */}
          <div className="tpc-name-row">
            <span className="tpc-name">{name}</span>
            {tutor.rating != null ? (
              <span className="tpc-rating">⭐ {tutor.rating.toFixed(1)}</span>
            ) : (
              <span className="tpc-rating tpc-rating--empty">후기 없음</span>
            )}
          </div>

          {/* 한 줄 소개 */}
          {variant === 'summary' && tutor.introduce && (
            <p className="tpc-intro">{tutor.introduce}</p>
          )}

          {/* 배지 행: 경력 + 레슨 타입 */}
          <div className="tpc-tag-row">
            {tutor.careerYears > 0 && (
              <span className="tpc-badge tpc-badge--career">경력 {tutor.careerYears}년</span>
            )}
            {visibleLessons.map((lesson) => (
              <span key={lesson.tutorLessonNo} className="tpc-badge tpc-badge--lesson">
                {lesson.lessonCategory.label}
              </span>
            ))}
            {extraLessons > 0 && (
              <span className="tpc-badge tpc-badge--more">+{extraLessons}</span>
            )}
          </div>
        </div>

        {/* 가격 (우측 고정) */}
        <div className="tpc-price-col">
          <span className="tpc-price">{tutor.pricePerHour.toLocaleString()}원</span>
          <span className="tpc-price-unit">/회</span>
        </div>
      </div>

      {/* 호버 시 출현하는 체험 레슨 신청 버튼 */}
      <div className="tpc-hover-action" onClick={(e) => e.stopPropagation()}>
        <button className="tpc-trial-btn" onClick={handleTrialClick}>
          체험 레슨 신청
        </button>
      </div>
    </div>
  );
}
