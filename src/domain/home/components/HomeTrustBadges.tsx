import '../css/home.css';

const badges = [
  { icon: '🔒', label: '안전 결제' },
  { icon: '🛡️', label: '개인정보 보호' },
  { icon: '✅', label: '검증된 튜터' },
  { icon: '💬', label: '실시간 고객지원' },
];

export default function HomeTrustBadges() {
  return (
    <div className="trust-badges">
      {badges.map((b) => (
        <div key={b.label} className="trust-badge">
          <span className="trust-badge-icon">{b.icon}</span>
          <span className="trust-badge-label">{b.label}</span>
        </div>
      ))}
    </div>
  );
}
