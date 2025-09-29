import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTutorDetail } from '../hooks/useTutorDetail';
import { format } from 'date-fns';
import Chip, { type ChipStyle } from '../../../components/Chip';
import TutorProfileCard from '../components/TutorProfileCard';
import LessonCalendarSection from '../../lessonManage/components/LessonCalendarSection';
import '../css/tutor-detail.css';

const DAYS_OF_WEEK = ['월', '화', '수', '목', '금', '토', '일'] as const;

export default function TutorDetailPage() {
  const { tutorId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useTutorDetail(tutorId!);
  const [showBookingCalendar, setShowBookingCalendar] = React.useState(false);

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
        <TutorProfileCard tutor={data} variant="full" />
      </div>

      <div className="info-grid">
        {!showBookingCalendar ? (
          <>
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
                <button className="booking-button" onClick={() => setShowBookingCalendar(true)}>
                  레슨 예약하기
                </button>
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
          </>
        ) : (
          /* 레슨 예약 캘린더 */
          <div className="info-card full-width">
            <div className="schedule-header">
              <h2 className="info-title">레슨 예약</h2>
              <button className="back-button" onClick={() => setShowBookingCalendar(false)}>
                뒤로 가기
              </button>
            </div>
            <div className="calendar-container">
              <LessonCalendarSection
                lessonEvents={[]}
                onSelectEvent={() => {}}
                onSelectSlot={(slotInfo: { start: Date }) => {
                  const selectedDate = slotInfo.start;
                  const dayOfWeek = selectedDate.getDay();

                  // 튜터의 가능한 시간대 확인
                  const available = data.tutorAvailableTimeList?.find(
                    (time) => time.dayOfWeekNum === dayOfWeek
                  );

                  if (available) {
                    // TODO: 예약 모달 표시
                  } else {
                    alert('선택하신 날짜는 레슨이 불가능합니다.');
                  }
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
