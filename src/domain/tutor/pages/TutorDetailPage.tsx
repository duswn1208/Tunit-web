import { useParams, useNavigate, useLocation, matchPath } from 'react-router-dom';
import { useToast } from '@/shared/contexts/ToastContext';
import TutorLessonInfo from '../components/TutorLessonInfo';
import TutorScheduleInfo from '../components/TutorScheduleInfo';
import TutorReviewSection from '../components/TutorReviewSection';
import TutorQnaSection from '../components/TutorQnaSection';
import Tab from '@/shared/components/Tab';
import { TutorProfileCard } from '../../profile/components/TutorProfileCard.tsx';
import { Button } from '@/shared/components';
import LessonBookingForm from '../components/LessonBookingForm';
import { useTutorDetail } from '../hooks/useTutorDetail';
import { useReservationState } from '../hooks/useReservationState';
import '../css/tutor-detail.css';
import '../css/tutor-calendar.css';
import { useEffect, useState } from 'react';
import useMediaQuery from '@/shared/hooks/useMediaQuery';

export default function TutorDetailPage() {
  const { tutorId: tutorProfileNo } = useParams();
  if (!tutorProfileNo) return null;

  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState('레슨정보');
  const tabList = ['레슨정보', '레슨시간', '레슨후기', 'Q&A'];
  // /tutors/:tutorId/booking 경로 여부 확인
  const bookingMatch = matchPath('/tutors/:tutorId/booking', location.pathname);
  const showBookingCalendar = !!bookingMatch;
  // lessonReservationNo 쿼리스트링 추출
  const lessonReservationNo =
    new URLSearchParams(location.search).get('lessonReservationNo') || undefined;
  const { data, isLoading, error } = useTutorDetail(tutorProfileNo);
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

  // 로딩/에러 토스트는 useEffect에서 처리
  useEffect(() => {
    if (isLoading) {
      showToast('로딩 중입니다...', 'info');
    }
  }, [isLoading, showToast]);

  useEffect(() => {
    if (error) {
      showToast('죄송합니다. 튜터 정보를 찾을 수 없습니다.', 'error');
    }
  }, [error, showToast]);

  // 모든 hook은 조건문보다 위에!
  const isMobile = useMediaQuery('(max-width: 768px)');

  // 프로필 카드 버튼 클릭 이벤트 리스너 등록 (예약/신청)
  useEffect(() => {
    function handleTrial() {
      toggleCalendar(true);
    }
    function handleRegular() {
      navigate(`/tutors/${tutorProfileNo}/regular-lesson`);
    }
    function handleFast() {
      // 처음(상세페이지)에서 클릭 시 상세로 이동
      navigate(`/tutors/${tutorProfileNo}`);
    }
    window.addEventListener('tutor-booking-trial', handleTrial);
    window.addEventListener('tutor-booking-regular', handleRegular);
    window.addEventListener('tutor-booking-fast', handleFast);
    return () => {
      window.removeEventListener('tutor-booking-trial', handleTrial);
      window.removeEventListener('tutor-booking-regular', handleRegular);
      window.removeEventListener('tutor-booking-fast', handleFast);
    };
  }, [navigate, toggleCalendar]);

  if (isLoading || error || !data) {
    return null;
  }

  return (
    <div className="tutor-detail-page">
      <div className="tutor-detail-container">
        <TutorProfileCard
          tutor={{ ...data, tutorId: parseInt(tutorProfileNo!, 10) }}
          variant="full"
          isMobile={isMobile}
        />
      </div>

      <Tab tabs={tabList} selected={selectedTab} onSelect={setSelectedTab} />

      {/* info-card wrapper + 버튼 그룹 */}
      <div style={{ position: 'relative' }}>
        {/* 데스크탑: info-card-action-buttons는 TutorProfileCard로 이동됨 */}
        <div className="info-grid">
          {!showBookingCalendar ? (
            <>
              {selectedTab === '레슨정보' && <TutorLessonInfo lessonData={data} />}
              {selectedTab === '레슨시간' && (
                <TutorScheduleInfo scheduleData={data.tutorAvailableTimeList} />
              )}
              {selectedTab === '레슨후기' && <TutorReviewSection />}
              {selectedTab === 'Q&A' && <TutorQnaSection />}
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
        {/* 모바일: 하단 플로팅 버튼 */}
        {isMobile && (
          <div className="floating-booking-buttons">
            <Button className="booking-button" onClick={() => toggleCalendar(true)}>
              상담/체험 레슨 예약
            </Button>
            <Button
              className="booking-button booking-button--outline"
              onClick={() => navigate(`/tutors/${tutorProfileNo}/regular-lesson`)}
            >
              정기레슨 신청
            </Button>
            <Button
              className="booking-button booking-button--fast"
              onClick={() => navigate(`/tutors/${tutorProfileNo}/regular-lesson?type=firstcome`)}
            >
              선착순 레슨 신청
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
