import { useParams, useNavigate, useLocation } from 'react-router-dom';
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
  const navigate = useNavigate();
  const location = useLocation();
  const showBookingParam = new URLSearchParams(location.search).get('booking');
  const { data, isLoading, error } = useTutorDetail(tutorProfileNo!);
  const {
    state: { selectedDate, selectedTime, selectedLesson, requestMessage },
    setDateTime,
    setLesson,
    setMessage,
  } = useReservationState();

  const showBookingCalendar = showBookingParam === 'true';

  const toggleCalendar = (show: boolean) => {
    navigate(`/tutors/${tutorProfileNo}${show ? '?booking=true' : ''}`, { replace: true });
  };

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
