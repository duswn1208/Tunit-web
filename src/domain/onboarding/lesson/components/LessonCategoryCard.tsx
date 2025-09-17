interface LessonCategoryCardProps {
  code: string;
  label: string;
  active: boolean;
  onClick: () => void;
}

export default function LessonCategoryCard({
  code,
  label,
  active,
  onClick,
}: LessonCategoryCardProps) {
  return (
    <div
      className={`mls-card-item ${active ? 'active' : ''}`}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
    >
      <span style={{ fontWeight: 700, color: '#000' }}>{label}</span>
      <span className="mls-check" />
    </div>
  );
}
