import './css/BottomTabBar.css';

// 아이콘은 예시로 SVG 인라인 사용, 실제로는 별도 파일/라이브러리 사용 권장
const icons = {
  home: (
    <svg
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M3 12l9-9 9 9" />
      <path d="M9 21V9h6v12" />
    </svg>
  ),
  search: (
    <svg
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  lesson: (
    <svg
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M16 2v4M8 2v4" />
    </svg>
  ),
  lounge: (
    <svg
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M8 15s1.5 2 4 2 4-2 4-2" />
    </svg>
  ),
  my: (
    <svg
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M6 20v-2a4 4 0 0 1 4-4h0a4 4 0 0 1 4 4v2" />
    </svg>
  ),
};

const tabs = [
  { key: 'home', label: '홈', icon: icons.home, link: '/' },
  { key: 'search', label: '찾기', icon: icons.search, link: '/find/lessons' },
  { key: 'lesson', label: '내 레슨', icon: icons.lesson, link: '/student/my/lessons' },
  { key: 'tutors', label: '내 튜터', icon: icons.lesson, link: '/student/my/tutors' },
  // { key: 'lounge', label: '라운지', icon: icons.lounge },
  { key: 'my', label: '마이', icon: icons.my, link: '/mypage' },
];

export default function BottomTabBar() {
  // TODO: 실제 라우팅/선택 상태 연동 필요
  return (
    <nav className="bottom-tab-bar">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className="tab-btn"
          type="button"
          onClick={() => {
            if (tab.link) {
              window.location.href = tab.link;
            }
          }}
        >
          <span className="tab-icon">{tab.icon}</span>
          <span className="tab-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
