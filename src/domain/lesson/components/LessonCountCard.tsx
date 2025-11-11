import { memo } from 'react';
import '@/shared/css/components/lesson-manage.css';

interface LessonCountCardProps {
  todayCount: number;
  thisWeekAfterTodayLessonCount: number;
  nextWeekCount: number;
  totalCount: number;
  className?: string;
}

const LessonCountCard = memo(
  ({
    todayCount,
    thisWeekAfterTodayLessonCount,
    nextWeekCount,
    totalCount,
    className,
  }: LessonCountCardProps) => {
    // 긍정적 지표 (민트/청록색)
    const positiveItems = [{ label: '이번달 전체 레슨', count: totalCount }];

    // 액션 필요 지표 (코랄-레드)
    const actionItems = [
      { label: '오늘 예정 레슨', count: todayCount },
      { label: '이번주 남은 레슨', count: thisWeekAfterTodayLessonCount },
      { label: '다음주 예정 레슨', count: nextWeekCount },
    ];

    return (
      <div className={`lesson-count-cards-wrapper${className ? ' ' + className : ''}`}>
        {/* 긍정적 지표 - 민트색 */}
        <div className="lesson-count-card lesson-count-card--positive">
          {positiveItems.map(({ label, count }) => (
            <div key={label} className="lesson-count-item">
              <span className="lesson-count-label">{label}</span>
              <span className="lesson-count-value">{count}개</span>
            </div>
          ))}
        </div>

        {/* 액션 필요 지표 - 코랄-레드 */}
        <div className="lesson-count-card lesson-count-card--action">
          {actionItems.map(({ label, count }) => (
            <div key={label} className="lesson-count-item">
              <span className="lesson-count-label">{label}</span>
              <span className="lesson-count-value">{count}개</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
);

export default LessonCountCard;
