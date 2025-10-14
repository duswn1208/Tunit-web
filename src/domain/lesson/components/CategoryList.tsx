import LessonCategoryCard from './LessonCategoryCard.tsx';

interface CategoryListProps {
  title: string;
  loading: boolean;
  loadingText: string;
  emptyText: string;
  items: { code: string; label: string }[];
  isActive: (code: string) => boolean;
  onClick: (code: string, label: string) => void;
  style?: React.CSSProperties;
}

export default function CategoryList({
  title,
  loading,
  loadingText,
  emptyText,
  items,
  isActive,
  onClick,
  style,
}: CategoryListProps) {
  return (
    <div style={style}>
      <div style={{ fontSize: 14, fontWeight: 700, margin: '8px 0 8px 2px' }}>{title}</div>
      {loading ? (
        <div style={{ padding: '6px 2px' }}>{loadingText}</div>
      ) : items.length ? (
        <div className="mls-grid">
          {items.map((item) => (
            <LessonCategoryCard
              key={item.code}
              code={item.code}
              label={item.label}
              active={isActive(item.code)}
              onClick={() => onClick(item.code, item.label)}
            />
          ))}
        </div>
      ) : (
        <div style={{ opacity: 0.7, padding: '6px 2px' }}>{emptyText}</div>
      )}
    </div>
  );
}
