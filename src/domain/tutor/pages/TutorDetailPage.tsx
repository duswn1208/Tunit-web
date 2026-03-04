import { useParams, useNavigate, useLocation } from 'react-router-dom';
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
import { useEffect, useState } from 'react';
import useMediaQuery from '@/shared/hooks/useMediaQuery';
import { useAuth } from '@/shared/auth/AuthContext';

export default function TutorDetailPage() {
  const { tutorId: tutorProfileNo } = useParams();
  if (!tutorProfileNo) return null;

  const { showToast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState('레슨정보');
  const tabList = ['레슨정보', '레슨시간', '레슨후기', 'FAQ'];
  const { data, isLoading, error } = useTutorDetail(tutorProfileNo);

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
      if (!user) {
        showToast('로그인이 필요한 서비스입니다.', 'info');
        navigate('/auth/login', { state: { from: `/tutors/${tutorProfileNo}` } });
        return;
      }
      navigate(`/tutors/${tutorProfileNo}/lesson-booking?type=trial`, {
        state: { tutor: data },
      });
    }
    function handleRegular() {
      if (!user) {
        showToast('로그인이 필요한 서비스입니다.', 'info');
        navigate('/auth/login', { state: { from: `/tutors/${tutorProfileNo}` } });
        return;
      }
      navigate(`/tutors/${tutorProfileNo}/lesson-booking?type=regular`, {
        state: { tutor: data },
      });
    }
    function handleFast() {
      if (!user) {
        showToast('로그인이 필요한 서비스입니다.', 'info');
        navigate('/auth/login', { state: { from: `/tutors/${tutorProfileNo}` } });
        return;
      }
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
  }, [navigate, tutorProfileNo, data, user, showToast]);

  if (isLoading || error || !data) {
    return null;
  }

  return (
    <div className="tutor-detail-page">
      {/* 뒤로 가기 버튼 */}
      <div style={{ padding: '16px 16px 0', maxWidth: '1200px', margin: '0 auto' }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 16px',
            border: '1px solid #ddd',
            borderRadius: 8,
            background: 'white',
            cursor: 'pointer',
            fontSize: 15,
            color: '#333',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#f5f5f5';
            e.currentTarget.style.borderColor = '#999';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'white';
            e.currentTarget.style.borderColor = '#ddd';
          }}
        >
          ← 목록으로
        </button>
      </div>
      
      <div className="tutor-detail-container">
        <TutorProfileCard tutor={data} variant="full" isMobile={isMobile} />
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
          {selectedTab === '레슨후기' && (
            <TutorReviewSection tutorId={parseInt(tutorProfileNo, 10)} />
          )}
          {selectedTab === 'FAQ' && <TutorFaqSection faqData={data.tutorFaqList} />}
        </div>
        {/* 모바일: 하단 플로팅 버튼 */}
        {isMobile && (
          <div className="floating-booking-buttons">
            <Button
              className="booking-button"
              onClick={() => {
                if (!user) {
                  // 비로그인 사용자는 게스트 예약 페이지로 이동
                  navigate(`/tutors/${tutorProfileNo}/guest-reservation`);
                  return;
                }
                navigate(`/tutors/${tutorProfileNo}/lesson-booking?type=trial`, {
                  state: { tutor: data },
                });
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
                navigate(`/tutors/${tutorProfileNo}/lesson-booking?type=regular`, {
                  state: { tutor: data },
                });
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
                navigate(`/tutors/${tutorProfileNo}/lesson-booking?type=firstcome`, {
                  state: { tutor: data },
                });
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
