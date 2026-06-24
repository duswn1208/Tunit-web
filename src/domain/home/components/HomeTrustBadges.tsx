import '../css/home.css';

const badges = [
  { icon: 'fas fa-lock', label: '안전 결제' },
  { icon: 'fas fa-shield-halved', label: '개인정보 보호' },
  { icon: 'fas fa-circle-check', label: '검증된 튜터' },
  { icon: 'fas fa-comment-dots', label: '실시간 고객지원' },
];

export default function HomeTrustBadges() {
  return (
    <div className="trust-badges">
      {badges.map((b) => (
        <div key={b.label} className="trust-badge">
          <span className="trust-badge-icon"><i className={b.icon} aria-hidden="true"></i></span>
          <span className="trust-badge-label">{b.label}</span>
        </div>
      ))}
    </div>
  );
}
