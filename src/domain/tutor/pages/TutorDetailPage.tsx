import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/shared/contexts/ToastContext';
import TutorLessonInfo from '../components/TutorLessonInfo';
import TutorScheduleInfo from '../components/TutorScheduleInfo';
import TutorReviewSection from '../components/TutorReviewSection';
import TutorQnaSection from '../components/TutorQnaSection';
import Tab from '@/shared/components/Tab.tsx';
import { TutorProfileCard } from '../../profile/components/TutorProfileCard.tsx';
import { Button } from '@/shared/components';
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

  // lessonCategoryOptions 생성
  const lessonCategoryOptions = (data?.lessonSubcategoryList ?? []).map((cat) => ({
    label: cat.lessonCategory.label,
    value: cat.lessonCategory.code,
  }));

  // 프로필 카드 버튼 클릭 이벤트 리스너 등록 (예약/신청)
  useEffect(() => {
    function handleTrial() {
      navigate(`/tutors/${tutorProfileNo}/lesson-booking?type=trial`, {
        state: { tutor: data },
      });
    }
    function handleRegular() {
      navigate(`/tutors/${tutorProfileNo}/lesson-booking?type=regular`, {
        state: { tutor: data },
      });
    }
    function handleFast() {
      navigate(`/tutors/${tutorProfileNo}/lesson-booking?type=firstcome`, {
        state: { tutor: data },
      });
    }
    window.addEventListener('tutor-booking-trial', handleTrial);
    window.addEventListener('tutor-booking-regular', handleRegular);
    window.addEventListener('tutor-booking-fast', handleFast);
    return () => {
      window.removeEventListener('tutor-booking-trial', handleTrial);
      window.removeEventListener('tutor-booking-regular', handleRegular);
      window.removeEventListener('tutor-booking-fast', handleFast);
    };
  }, [navigate, tutorProfileNo, data]);

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
          {selectedTab === '레슨정보' && <TutorLessonInfo lessonData={data} />}
          {selectedTab === '레슨시간' && (
            <TutorScheduleInfo scheduleData={data.tutorAvailableTimeList} />
          )}
          {selectedTab === '레슨후기' && <TutorReviewSection />}
          {selectedTab === 'Q&A' && <TutorQnaSection />}
        </div>
        {/* 모바일: 하단 플로팅 버튼 */}
        {isMobile && (
          <div className="floating-booking-buttons">
            <Button
              className="booking-button"
              onClick={() =>
                navigate(`/tutors/${tutorProfileNo}/lesson-booking?type=trial`, {
                  state: { tutor: data },
                })
              }
            >
              상담/체험 레슨 예약
            </Button>
            <Button
              className="booking-button booking-button--outline"
              onClick={() =>
                navigate(`/tutors/${tutorProfileNo}/lesson-booking?type=regular`, {
                  state: { tutor: data },
                })
              }
            >
              정기레슨 신청
            </Button>
            <Button
              className="booking-button booking-button--fast"
              onClick={() =>
                navigate(`/tutors/${tutorProfileNo}/lesson-booking?type=firstcome`, {
                  state: { tutor: data },
                })
              }
            >
              선착순 레슨 신청
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
