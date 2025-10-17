import { categoryIcons } from '../lib/categoryIcons';
import './css/lesson-category.css';

interface LessonCategoryCardProps {
  code: string;
  label: string;
  active: boolean;
  onClick: () => void;
  isMainCategory?: boolean;
}

export default function LessonCategoryCard({
  code,
  label,
  active,
  onClick,
  isMainCategory = false,
}: LessonCategoryCardProps) {
  const iconInfo = isMainCategory ? categoryIcons[code] : null;

  return (
    <div
      className={`mls-card-item ${active ? 'active' : ''}`}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
    >
      {iconInfo && (
        <span className="category-icon" role="img" aria-label={iconInfo.label}>
          {iconInfo.icon}
        </span>
      )}
      <span
        style={{
          fontWeight: 600,
          color: active ? '#fff' : '#000',
          marginLeft: iconInfo ? '8px' : '0',
        }}
      >
        {label}
      </span>
    </div>
  );
}
