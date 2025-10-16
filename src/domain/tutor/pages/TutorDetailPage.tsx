import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ErrorState from '@/shared/components/ErrorState';
import TutorLessonInfo from '../components/TutorLessonInfo';
import TutorScheduleInfo from '../components/TutorScheduleInfo';
import TutorProfileCard from '../../profile/components/TutorProfileCard.tsx';
import LessonBookingForm from '../components/LessonBookingForm';
import { useTutorDetail } from '../hooks/useTutorDetail';
import { useReservationState } from '../hooks/useReservationState';
import '../css/tutor-detail.css';
import '../css/tutor-calendar.css';

export default function TutorDetailPage() {
  const { tutorId: tutorProfileNo } = useParams();
  const { data, isLoading, error } = useTutorDetail(tutorProfileNo!);
  const {
    state: { showBookingCalendar, selectedDate, selectedTime, selectedLesson, requestMessage },
    toggleCalendar,
    setDateTime,
    setLesson,
    setMessage,
  } = useReservationState();

  // 페이지 로드 시 자동으로 예약 캘린더 표시
  useEffect(() => {
    toggleCalendar(true);
  }, [toggleCalendar]);

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
            <ErrorState
              message="죄송합니다. 튜터 정보를 찾을 수 없습니다."
              details={`프로필 번호: ${tutorProfileNo}`}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tutor-detail-page">
      <div className="tutor-detail-container">
        <TutorProfileCard
          tutor={{ ...data, tutorId: parseInt(tutorProfileNo!, 10) }}
          variant="full"
        />
      </div>

      <div className="info-grid">
        {!showBookingCalendar ? (
          <>
            <TutorLessonInfo lessonData={data} />
            <TutorScheduleInfo
              scheduleData={data.tutorAvailableTimeList}
              onBookingClick={() => toggleCalendar(true)}
            />
          </>
        ) : (
          <LessonBookingForm
            tutorProfileNo={tutorProfileNo!}
            lessonData={data}
            selectedDate={selectedDate || ''}
            selectedTime={selectedTime || ''}
            selectedLesson={selectedLesson || ''}
            requestMessage={requestMessage || ''}
            onBack={() => toggleCalendar(false)}
            onDateTimeChange={setDateTime}
            onLessonChange={setLesson}
            onMessageChange={setMessage}
          />
        )}
      </div>
    </div>
  );
}
