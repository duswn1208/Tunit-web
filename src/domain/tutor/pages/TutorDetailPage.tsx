import { useParams, useNavigate, useLocation, matchPath } from 'react-router-dom';
import { useToast } from '@/shared/contexts/ToastContext';
import TutorLessonInfo from '../components/TutorLessonInfo';
import TutorScheduleInfo from '../components/TutorScheduleInfo';
import TutorProfileCard from '../../profile/components/TutorProfileCard.tsx';
import LessonBookingForm from '../components/LessonBookingForm';
import { useTutorDetail } from '../hooks/useTutorDetail';
import { useReservationState } from '../hooks/useReservationState';
import '../css/tutor-detail.css';
import '../css/tutor-calendar.css';

export default function TutorDetailPage() {
  const { showToast } = useToast();
  const { tutorId: tutorProfileNo } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  // /tutors/:tutorId/booking 경로 여부 확인
  const bookingMatch = matchPath('/tutors/:tutorId/booking', location.pathname);
  const showBookingCalendar = !!bookingMatch;
  // lessonReservationNo 쿼리스트링 추출
  const lessonReservationNo =
    new URLSearchParams(location.search).get('lessonReservationNo') || undefined;
  const { data, isLoading, error } = useTutorDetail(tutorProfileNo!);
  const {
    state: { selectedDate, selectedTime, selectedLesson, requestMessage },
    setDateTime,
    setLesson,
    setMessage,
  } = useReservationState(lessonReservationNo);

  const toggleCalendar = (show: boolean) => {
    if (show) {
      navigate(`/tutors/${tutorProfileNo}/booking`, { replace: true });
    } else {
      navigate(`/tutors/${tutorProfileNo}`, { replace: true });
    }
  };

  if (isLoading) {
    showToast('로딩 중입니다...', 'info');
    return null;
  }

  if (error || !data) {
    showToast('죄송합니다. 튜터 정보를 찾을 수 없습니다.', 'error');
    return null;
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
            lessonReservationNo={lessonReservationNo}
          />
        )}
      </div>
    </div>
  );
}
