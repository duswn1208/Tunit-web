import { useParams, useNavigate } from 'react-router-dom';
import { useTutorDetail } from '../hooks/useTutorDetail';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import Chip, { type ChipStyle } from '../../../components/Chip';
import '../css/tutor-detail.css';

const DAYS_OF_WEEK = ['월', '화', '수', '목', '금', '토', '일'] as const;

export default function TutorDetailPage() {
  const { tutorId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useTutorDetail(tutorId!);

  if (isLoading) {
    return (
      <div className="tutor-detail-page">
        <div className="tutor-detail-container">
          <div className="info-card">
            <div className="loading-message">로딩 중...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="tutor-detail-page">
        <div className="tutor-detail-container">
          <div className="info-card">
            <h2 className="error-title">오류 발생</h2>
            <p className="error-message">
              죄송합니다. 튜터 정보를 찾을 수 없습니다. (ID: {tutorId})
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tutor-detail-page">
      <div className="tutor-detail-container">
        {/* 프로필 헤더 */}
        <div className="tutor-profile info-card">
          <div className="tutor-profile-header">
            {data.photoUrl ? (
              <img src={data.photoUrl} alt={data.nickname || '튜터'} className="tutor-avatar" />
            ) : (
              <div className="tutor-avatar-placeholder">
                <FontAwesomeIcon icon={faUser} className="text-4xl text-gray-500" />
              </div>
            )}
            <div className="tutor-info">
              <h1 className="tutor-name">{data.nickname || '튜터'}</h1>
              <div className="tutor-intro">{data.introduce}</div>
              <div className="tutor-badges">
                <Chip
                  label={`경력 ${data.careerYears}년`}
                  variant="blue"
                  size="md"
                  selected
                  borderColor="#1d4ed8"
                />
                <Chip
                  label={`시간당 ${data.pricePerHour.toLocaleString()}원`}
                  variant="green"
                  size="md"
                  selected
                  borderColor="#15803d"
                />
                {data.rating && (
                  <Chip
                    label={`평점 ${data.rating}`}
                    variant="yellow"
                    size="md"
                    selected
                    borderColor="#a16207"
                  />
                )}
              </div>
              <button
                className="booking-button"
                onClick={() => navigate(`/tutor/${tutorId}/booking`)}
              >
                레슨 예약하기
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="info-grid">
        {/* 레슨 정보 */}
        <div className="info-card">
          <h2 className="info-title">레슨 정보</h2>
          <div className="info-content">
            <div>
              <h3 className="info-subtitle">레슨 과목</h3>
              <div className="badge-group">
                {data.lessonSubcategoryList?.map((lesson) => (
                  <Chip
                    key={lesson.tutorLessonNo}
                    label={lesson.lessonCategory.label}
                    variant="gray"
                    size="md"
                    style={{ border: 'none' }}
                  />
                ))}
              </div>
            </div>
            <div>
              <h3 className="info-subtitle">레슨 가능 지역</h3>
              <div className="badge-group">
                {data.regionList?.map((region) => (
                  <Chip
                    key={region.code}
                    label={region.label}
                    variant="gray"
                    size="md"
                    style={{ border: 'none' }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 스케줄 정보 */}
        <div className="info-card">
          <div className="schedule-header">
            <h2 className="info-title">레슨 가능 시간</h2>
            <button className="schedule-book-button">레슨 예약하기</button>
          </div>
          <div className="schedule-list">
            {DAYS_OF_WEEK.map((day) => {
              const dayIndex = DAYS_OF_WEEK.indexOf(day);
              const schedule = data.tutorAvailableTimeList?.find(
                (time) => time.dayOfWeekNum === dayIndex + 1
              );
              return (
                <div
                  key={day}
                  className={`schedule-item ${schedule ? 'has-schedule' : 'no-schedule'}`}
                >
                  <span className="schedule-day">{day}요일</span>
                  {schedule ? (
                    <span className="schedule-time">
                      {schedule.startTime} - {schedule.endTime}
                    </span>
                  ) : (
                    <span className="schedule-off">휴무</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
