import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import type { TutorDetail } from '../../tutor/api/types.ts';
import { useNavigate } from 'react-router-dom';
import Button from '@/shared/components/Button.tsx';

interface TutorProfileCardProps {
  tutor: TutorDetail;
  variant?: 'full' | 'summary';
  isMobile?: boolean;
  clickable?: boolean;
}

export function TutorProfileCard({ tutor, variant = 'full', isMobile, clickable = true }: TutorProfileCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (clickable) navigate(`/tutors/${tutor.tutorProfileNo}`);
  };

  const visibleLessons = tutor.lessonSubcategoryList?.slice(0, 4) ?? [];
  const extraLessons = (tutor.lessonSubcategoryList?.length ?? 0) - visibleLessons.length;

  const visibleRegions = tutor.regionList?.slice(0, 3) ?? [];
  const extraRegions = (tutor.regionList?.length ?? 0) - visibleRegions.length;

  return (
    <div className="tutor-profile info-card">
      {/* 프로필 헤더: 아바타 + 정보 */}
      <div
        className={`tutor-profile-header${clickable ? ' tutor-profile-header--clickable' : ''}`}
        onClick={handleClick}
      >
        {tutor.photoUrl ? (
          <img
            src={tutor.photoUrl}
            alt={tutor.userInfo?.nickname || '튜터'}
            className="tutor-avatar"
          />
        ) : (
          <div className="tutor-avatar-placeholder">
            <FontAwesomeIcon icon={faUser} className="text-4xl text-gray-500" />
          </div>
        )}

        <div className="tutor-info">
          <h1 className="tutor-name">{tutor.userInfo?.nickname || '튜터'}</h1>

          {variant === 'summary' && tutor.introduce && (
            <p className="tutor-intro-summary">{tutor.introduce}</p>
          )}

          {/* 핵심 수치 배지 */}
          <div className="tutor-badges">
            <span className="tutor-tag tutor-tag--career">경력 {tutor.careerYears}년</span>
            <span className="tutor-tag tutor-tag--price">시간당 {tutor.pricePerHour.toLocaleString()}원</span>
            {tutor.rating && (
              <span className="tutor-tag tutor-tag--rating">★ {tutor.rating}</span>
            )}
          </div>

          {/* 레슨 과목 */}
          {visibleLessons.length > 0 && (
            <div className="tutor-tag-row">
              {visibleLessons.map((lesson) => (
                <span key={lesson.tutorLessonNo} className="tutor-tag tutor-tag--lesson">
                  {lesson.lessonCategory.label}
                </span>
              ))}
              {extraLessons > 0 && (
                <span className="tutor-tag tutor-tag--more">+{extraLessons}</span>
              )}
            </div>
          )}

          {/* 가능 지역 */}
          {visibleRegions.length > 0 && (
            <div className="tutor-tag-row">
              {visibleRegions.map((region) => (
                <span key={region.code} className="tutor-tag tutor-tag--region">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="tutor-tag-icon" />
                  {region.label}
                </span>
              ))}
              {extraRegions > 0 && (
                <span className="tutor-tag tutor-tag--more">+{extraRegions}</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 데스크탑 예약 버튼 — 카드 하단 플로우 */}
      {!isMobile && (
        <div className="info-card-action-buttons" onClick={(e) => e.stopPropagation()}>
          <Button
            className="booking-button"
            onClick={(e) => {
              e.stopPropagation();
              window.dispatchEvent(new CustomEvent('tutor-booking-trial', {
                detail: { tutorProfileNo: tutor.tutorProfileNo },
              }));
            }}
          >
            상담/체험 레슨 예약
          </Button>
          <Button
            className="booking-button booking-button--outline"
            onClick={(e) => {
              e.stopPropagation();
              window.dispatchEvent(new CustomEvent('tutor-booking-regular', {
                detail: { tutorProfileNo: tutor.tutorProfileNo },
              }));
            }}
          >
            정기레슨 신청
          </Button>
          <Button
            className="booking-button booking-button--fast"
            onClick={(e) => {
              e.stopPropagation();
              window.dispatchEvent(new CustomEvent('tutor-booking-fast', {
                detail: { tutorProfileNo: tutor.tutorProfileNo },
              }));
            }}
          >
            선착순 레슨 예약
          </Button>
        </div>
      )}
    </div>
  );
}
