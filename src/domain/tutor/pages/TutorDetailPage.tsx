import { useParams } from 'react-router-dom';
import { useTutorDetail } from '../hooks/useTutorDetail';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import '../css/tutor-detail.css';

const DAYS_OF_WEEK = ['월', '화', '수', '목', '금', '토', '일'] as const;

export default function TutorDetailPage() {
  const { tutorId } = useParams();
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
                <span className="badge badge-blue">경력 {data.careerYears}년</span>
                <span className="badge badge-green">
                  시간당 {data.pricePerHour.toLocaleString()}원
                </span>
                {data.rating && <span className="badge badge-yellow">평점 {data.rating}</span>}
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
                    <span
                      key={lesson.tutorLessonNo}
                      className={`badge ${lesson.isMain ? 'badge-blue' : 'badge'}`}
                    >
                      {lesson.lessonCategory.label}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="info-subtitle">레슨 가능 지역</h3>
                <div className="badge-group">
                  {data.regionList?.map((region) => (
                    <span key={region.code} className="badge">
                      {region.label}
                    </span>
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
    </div>
  );
}
