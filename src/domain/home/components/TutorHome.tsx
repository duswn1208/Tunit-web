import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/shared/auth/AuthContext';
import '../css/tutor-home.css';

const quickActions = [
  {
    icon: '📋',
    title: '내 레슨 관리',
    desc: '등록한 레슨을 확인하고 관리해요.',
    to: '/tutor/my/lessons',
  },
  {
    icon: '📅',
    title: '스케줄 관리',
    desc: '레슨 가능한 시간을 설정해요.',
    to: '/tutor/schedule',
  },
  {
    icon: '👥',
    title: '내 학생',
    desc: '계약된 학생들을 확인해요.',
    to: '/tutor/my/students',
  },
  {
    icon: '👤',
    title: '내 프로필',
    desc: '프로필과 소개를 관리해요.',
    to: '/mypage',
  },
];

const manageLinks = [
  { label: 'FAQ 관리', to: '/mypage/tutor/faq' },
  { label: '경력 관리', to: '/mypage/tutor/career-history' },
];

export default function TutorHome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const displayName = user?.nickname || user?.name || '튜터';

  return (
    <div className="tutor-home">
      <div className="tutor-home-hero">
        <h1 className="tutor-home-greeting">
          안녕하세요, {displayName}님 👋
        </h1>
        <p className="tutor-home-sub">오늘도 멋진 레슨을 만들어볼까요?</p>
      </div>

      <div className="tutor-home-actions">
        {quickActions.map((a) => (
          <button key={a.to} className="tutor-home-action-card" onClick={() => navigate(a.to)}>
            <span className="tutor-home-action-icon">{a.icon}</span>
            <span className="tutor-home-action-title">{a.title}</span>
            <span className="tutor-home-action-desc">{a.desc}</span>
          </button>
        ))}
      </div>

      <section className="tutor-home-manage">
        <h2 className="tutor-home-manage-title">프로필 관리</h2>
        <div className="tutor-home-manage-links">
          {manageLinks.map((l) => (
            <button key={l.to} className="tutor-home-manage-link" onClick={() => navigate(l.to)}>
              {l.label}
              <span className="tutor-home-manage-arrow">→</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
