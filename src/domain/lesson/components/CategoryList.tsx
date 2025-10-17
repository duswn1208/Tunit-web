import { useRef, useState, useEffect } from 'react';
import LessonCategoryCard from './LessonCategoryCard.tsx';
import './css/category-list.css';
import './css/category-scroll.css';

interface CategoryListProps {
  title: string;
  loading: boolean;
  loadingText: string;
  emptyText: string;
  items: { code: string; label: string }[];
  isActive: (code: string) => boolean;
  onClick: (code: string, label: string) => void;
  style?: React.CSSProperties;
  isMainCategory?: boolean;
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
  isMainCategory = false,
}: CategoryListProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  const handleScroll = () => {
    if (!gridRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = gridRef.current;
    setShowLeftButton(scrollLeft > 0);
    setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (!gridRef.current) return;

    const scrollAmount = 200;
    const newScrollLeft =
      gridRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
    gridRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const grid = gridRef.current;
    if (grid) {
      grid.addEventListener('scroll', handleScroll);
      // 초기 상태 체크
      handleScroll();
    }
    return () => {
      if (grid) {
        grid.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <div
      className={`${isMainCategory ? 'lesson-main-category' : 'lesson-sub-category'}`}
      style={{ ...style, position: 'relative' }}
    >
      <div style={{ fontSize: 14, fontWeight: 700, margin: '8px 0 8px 2px' }}>{title}</div>
      {loading ? (
        <div style={{ padding: '6px 2px' }}>{loadingText}</div>
      ) : items.length ? (
        <>
          {isMainCategory && (
            <>
              <button
                className={`category-scroll-button left ${!showLeftButton ? 'hidden' : ''}`}
                onClick={() => scroll('left')}
                aria-label="이전 카테고리"
              >
                ‹
              </button>
              <button
                className={`category-scroll-button right ${!showRightButton ? 'hidden' : ''}`}
                onClick={() => scroll('right')}
                aria-label="다음 카테고리"
              >
                ›
              </button>
            </>
          )}
          <div className="mls-grid" ref={gridRef}>
            {items.map((item) => (
              <LessonCategoryCard
                key={item.code}
                code={item.code}
                label={item.label}
                active={isActive(item.code)}
                onClick={() => onClick(item.code, item.label)}
                isMainCategory={isMainCategory}
              />
            ))}
          </div>
        </>
      ) : (
        <div style={{ opacity: 0.7, padding: '6px 2px' }}>{emptyText}</div>
      )}
    </div>
  );
}
