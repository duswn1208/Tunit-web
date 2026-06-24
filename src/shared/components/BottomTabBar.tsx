import { useNavigate, useLocation } from 'react-router-dom';
import './css/BottomTabBar.css';

const tabs = [
  { key: 'home',    label: '홈',     icon: 'fa-house',             link: '/' },
  { key: 'search',  label: '찾기',   icon: 'fa-magnifying-glass',  link: '/find/lessons' },
  { key: 'lesson',  label: '내 레슨', icon: 'fa-calendar-check',   link: '/student/my/lessons' },
  { key: 'tutors',  label: '내 튜터', icon: 'fa-chalkboard-user',  link: '/student/my/tutors' },
  { key: 'my',      label: '마이',   icon: 'fa-circle-user',       link: '/mypage' },
];

export default function BottomTabBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (link: string) => {
    if (link === '/') return location.pathname === '/';
    return location.pathname.startsWith(link);
  };

  return (
    <nav className="bottom-tab-bar">
      {tabs.map((tab) => {
        const active = isActive(tab.link);
        return (
          <button
            key={tab.key}
            className={`tab-btn${active ? ' active' : ''}`}
            type="button"
            onClick={() => navigate(tab.link)}
          >
            <span className="tab-icon">
              <i className={`fas ${tab.icon}`} aria-hidden="true" />
            </span>
            <span className="tab-label">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
