import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/shared/contexts/ToastContext';
import TutorScheduleInfo from '../components/TutorScheduleInfo';
import TutorReviewSection from '../components/TutorReviewSection';
import TutorFaqSection from '../components/TutorFaqSection.tsx';
import TutorCareerHistorySection from '../components/TutorCareerHistorySection';
import Tab from '@/shared/components/Tab.tsx';
import { useTutorDetail } from '../hooks/useTutorDetail';
import '../css/tutor-detail.css';
import '../css/tutor-calendar.css';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/shared/auth/AuthContext';

const ACCENT_COLORS = ['#4F59D6', '#6B4EFF', '#0075FF', '#00B386', '#FF6B35', '#F7A300', '#F04452'];
function getAvatarColor(name: string) {
  return ACCENT_COLORS[name.charCodeAt(0) % ACCENT_COLORS.length];
}

const TAB_LIST = ['튜터소개', '레슨시간', '레슨후기', 'FAQ'];
const SECTION_IDS = ['section-intro', 'section-schedule', 'section-review', 'section-faq'];

export default function TutorDetailPage() {
  const { tutorId: tutorProfileNo } = useParams();
  if (!tutorProfileNo) return null;

  const { showToast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
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

  const tutorName = data.userInfo?.nickname || '튜터';
  const avatarColor = getAvatarColor(tutorName);
  const visibleLessons = data.lessonSubcategoryList?.slice(0, 4) ?? [];
  const extraLessons = (data.lessonSubcategoryList?.length ?? 0) - visibleLessons.length;

  return (
    <div className="tutor-detail-page">
      {/* 뒤로 가기 버튼 */}
      <div className="detail-back-button-wrap">
        <button className="tutor-detail-back-btn" onClick={() => navigate(-1)}>
          <i className="fas fa-arrow-left" aria-hidden="true"></i> 목록으로
        </button>
      </div>

      {/* 히어로 카드 */}
      <div className="tutor-detail-container">
        <div className="tutor-hero-card">
          <div className="tutor-hero-header">
            {data.photoUrl ? (
              <div className="tutor-hero-avatar">
                <img src={data.photoUrl} alt={tutorName} />
              </div>
            ) : (
              <div
                className="tutor-hero-avatar"
                style={{ background: avatarColor + '22', color: avatarColor }}
              >
                {tutorName.slice(0, 2)}
              </div>
            )}
            <div className="tutor-hero-info">
              <div className="tutor-hero-name">{tutorName}</div>
              {data.rating && (
                <div className="tutor-hero-rating"><i className="fas fa-star" aria-hidden="true"></i> {data.rating}</div>
              )}
              <div className="tutor-hero-badges">
                <span className="tutor-hero-badge tutor-hero-badge--career">경력 {data.careerYears}년</span>
                <span className="tutor-hero-badge tutor-hero-badge--price">시간당 {data.pricePerHour.toLocaleString()}원</span>
              </div>
              {visibleLessons.length > 0 && (
                <div className="tutor-hero-tags">
                  {visibleLessons.map((lesson) => (
                    <span key={lesson.tutorLessonNo} className="tutor-hero-tag">
                      {lesson.lessonCategory.label}
                    </span>
                  ))}
                  {extraLessons > 0 && <span className="tutor-hero-tag">+{extraLessons}</span>}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 섹션 이동 탭 (sticky) */}
      <div className="tutor-detail-tabs">
        <Tab tabs={TAB_LIST} selected={activeSection} onSelect={handleTabSelect} />
      </div>

      <div className="info-grid-wrap">
        <div className="info-grid">
          <div id="section-intro" className="tutor-section">
            <div className="info-card">
              <h2 className="info-title">튜터 소개</h2>
              <p className="tutor-intro-text">{data.introduce || '아직 소개글이 없습니다.'}</p>
            </div>
            <TutorCareerHistorySection careerHistoryList={data.careerHistoryList} />
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

        {/* 하단 CTA 버튼 */}
        <div className="tutor-detail-cta">
          <button
            className="ui-btn ui-btn--full"
            onClick={() => {
              if (!user) {
                navigate(`/tutors/${tutorProfileNo}/guest-reservation`);
                return;
              }
              navigate(`/tutors/${tutorProfileNo}/lesson-booking?type=trial`, { state: { tutor: data } });
            }}
          >
            상담 / 체험 레슨 예약
          </button>
          <button
            className="ui-btn ui-btn--outline ui-btn--full"
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
          </button>
          <button
            className="ui-btn ui-btn--soft ui-btn--full"
            onClick={() => {
              if (!user) {
                showToast('로그인이 필요한 서비스입니다.', 'info');
                navigate('/auth/login', { state: { from: `/tutors/${tutorProfileNo}` } });
                return;
              }
              navigate(`/tutors/${tutorProfileNo}/lesson-booking?type=firstcome`, { state: { tutor: data } });
            }}
          >
            선착순 레슨 예약
          </button>
        </div>
      </div>
    </div>
  );
}
