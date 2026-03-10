import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/shared/contexts/ToastContext';
import TutorLessonInfo from '../components/TutorLessonInfo';
import TutorScheduleInfo from '../components/TutorScheduleInfo';
import TutorReviewSection from '../components/TutorReviewSection';
import TutorFaqSection from '../components/TutorFaqSection.tsx';
import Tab from '@/shared/components/Tab.tsx';
import { TutorProfileCard } from '../../profile/components/TutorProfileCard.tsx';
import { Button } from '@/shared/components';
import { useTutorDetail } from '../hooks/useTutorDetail';
import '../css/tutor-detail.css';
import '../css/tutor-calendar.css';
import { useEffect, useRef, useState } from 'react';
import useMediaQuery from '@/shared/hooks/useMediaQuery';
import { useAuth } from '@/shared/auth/AuthContext';

const TAB_LIST = ['레슨정보', '레슨시간', '레슨후기', 'FAQ'];
const SECTION_IDS = ['section-lesson-info', 'section-schedule', 'section-review', 'section-faq'];

export default function TutorDetailPage() {
  const { tutorId: tutorProfileNo } = useParams();
  if (!tutorProfileNo) return null;

  const { showToast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { data, isLoading, error } = useTutorDetail(tutorProfileNo);

  const [activeSection, setActiveSection] = useState('레슨정보');
  const isScrollingToSection = useRef(false);

  useEffect(() => {
    if (isLoading) showToast('로딩 중입니다...', 'info');
  }, [isLoading, showToast]);

  useEffect(() => {
    if (error) showToast('죄송합니다. 튜터 정보를 찾을 수 없습니다.', 'error');
  }, [error, showToast]);

  // 스크롤 스파이: 현재 보이는 섹션을 활성 탭으로 표시
  useEffect(() => {
    if (!data) return;

    const observers = SECTION_IDS.map((id, index) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !isScrollingToSection.current) {
            setActiveSection(TAB_LIST[index]);
          }
        },
        { rootMargin: '-60px 0px -45% 0px', threshold: 0 },
      );
      observer.observe(el);
      return observer;
    });

    return () => observers.forEach((obs) => obs?.disconnect());
  }, [data]);

  // 탭 클릭 → 해당 섹션으로 스크롤
  const handleTabSelect = (tab: string) => {
    const index = TAB_LIST.indexOf(tab);
    const el = document.getElementById(SECTION_IDS[index]);
    if (!el) return;
    setActiveSection(tab);
    isScrollingToSection.current = true;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => {
      isScrollingToSection.current = false;
    }, 800);
  };

  // 예약 이벤트 리스너
  useEffect(() => {
    function handleTrial() {
      if (!user) {
        showToast('로그인이 필요한 서비스입니다.', 'info');
        navigate('/auth/login', { state: { from: `/tutors/${tutorProfileNo}` } });
        return;
      }
      navigate(`/tutors/${tutorProfileNo}/lesson-booking?type=trial`, { state: { tutor: data } });
    }
    function handleRegular() {
      if (!user) {
        showToast('로그인이 필요한 서비스입니다.', 'info');
        navigate('/auth/login', { state: { from: `/tutors/${tutorProfileNo}` } });
        return;
      }
      navigate(`/tutors/${tutorProfileNo}/lesson-booking?type=regular`, { state: { tutor: data } });
    }
    function handleFast() {
      if (!user) {
        showToast('로그인이 필요한 서비스입니다.', 'info');
        navigate('/auth/login', { state: { from: `/tutors/${tutorProfileNo}` } });
        return;
      }
      navigate(`/tutors/${tutorProfileNo}/lesson-booking?type=firstcome`, { state: { tutor: data } });
    }
    window.addEventListener('tutor-booking-trial', handleTrial);
    window.addEventListener('tutor-booking-regular', handleRegular);
    window.addEventListener('tutor-booking-fast', handleFast);
    return () => {
      window.removeEventListener('tutor-booking-trial', handleTrial);
      window.removeEventListener('tutor-booking-regular', handleRegular);
      window.removeEventListener('tutor-booking-fast', handleFast);
    };
  }, [navigate, tutorProfileNo, data, user, showToast]);

  if (isLoading || error || !data) {
    return null;
  }

  return (
    <div className="tutor-detail-page">
      {/* 뒤로 가기 버튼 */}
      <div className="detail-back-button-wrap">
        <button className="detail-back-button" onClick={() => navigate(-1)}>
          ← 목록으로
        </button>
      </div>

      <div className="tutor-detail-container">
        <TutorProfileCard tutor={data} variant="full" isMobile={isMobile} />
      </div>

      {/* 섹션 이동 탭 (sticky) */}
      <Tab tabs={TAB_LIST} selected={activeSection} onSelect={handleTabSelect} />

      <div className="info-grid-wrap">
        <div className="info-grid">
          <div id="section-lesson-info" className="tutor-section">
            <TutorLessonInfo lessonData={data} />
          </div>
          <div id="section-schedule" className="tutor-section">
            <TutorScheduleInfo scheduleData={data.tutorAvailableTimeList} />
          </div>
          <div id="section-review" className="tutor-section">
            <TutorReviewSection tutorId={parseInt(tutorProfileNo, 10)} />
          </div>
          <div id="section-faq" className="tutor-section">
            <TutorFaqSection faqData={data.tutorFaqList} />
          </div>
        </div>

        {/* 모바일: 하단 플로팅 버튼 */}
        {isMobile && (
          <div className="floating-booking-buttons">
            <Button
              className="booking-button"
              onClick={() => {
                if (!user) {
                  navigate(`/tutors/${tutorProfileNo}/guest-reservation`);
                  return;
                }
                navigate(`/tutors/${tutorProfileNo}/lesson-booking?type=trial`, { state: { tutor: data } });
              }}
            >
              상담/체험 레슨 예약
            </Button>
            <Button
              className="booking-button booking-button--outline"
              onClick={() => {
                if (!user) {
                  showToast('로그인이 필요한 서비스입니다.', 'info');
                  navigate('/auth/login', { state: { from: `/tutors/${tutorProfileNo}` } });
                  return;
                }
                navigate(`/tutors/${tutorProfileNo}/lesson-booking?type=regular`, { state: { tutor: data } });
              }}
            >
              정기레슨 신청
            </Button>
            <Button
              className="booking-button booking-button--fast"
              onClick={() => {
                if (!user) {
                  showToast('로그인이 필요한 서비스입니다.', 'info');
                  navigate('/auth/login', { state: { from: `/tutors/${tutorProfileNo}` } });
                  return;
                }
                navigate(`/tutors/${tutorProfileNo}/lesson-booking?type=firstcome`, { state: { tutor: data } });
              }}
            >
              선착순 레슨 신청
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
