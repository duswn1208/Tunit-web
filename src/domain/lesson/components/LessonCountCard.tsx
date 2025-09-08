import React, { memo } from 'react';
import '../../../css/components/lesson-manage.css';

interface LessonCountCardProps {
  todayCount: number;
  thisWeekAfterTodayLessonCount: number;
  nextWeekCount: number;
  totalCount: number;
  className?: string;
  style?: React.CSSProperties;
}

const LessonCountCard = memo(
  ({
    todayCount,
    thisWeekAfterTodayLessonCount,
    nextWeekCount,
    totalCount,
    className,
    style,
  }: LessonCountCardProps) => {
    const items = [
      { label: '오늘 예정 레슨', count: todayCount },
      { label: '이번주 남은 레슨', count: thisWeekAfterTodayLessonCount },
      { label: '다음주 예정 레슨', count: nextWeekCount },
      { label: '이번달 전체 레슨', count: totalCount },
    ];
    return (
      <div className={`lesson-count-card${className ? ' ' + className : ''}`} style={style}>
        {items.map(({ label, count }) => (
          <div key={label} style={{ marginBottom: 4 }}>
            {label}: <b>{count}</b>개
          </div>
        ))}
      </div>
    );
  }
);

export default LessonCountCard;
