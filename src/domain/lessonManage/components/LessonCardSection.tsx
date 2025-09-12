import React from 'react';
import LessonCountCard from './LessonCountCard';
import { type LessonSummary, statusStyle, type LessonStatus } from '../types/lessonCalendar';

interface LessonCardSectionProps {
  lessonSummary: LessonSummary | null;
}

const LessonCardSection: React.FC<LessonCardSectionProps> = ({ lessonSummary }) => {
  return (
    <div className="lesson-card-section">
      <LessonCountCard
        todayCount={lessonSummary?.todayLessonCount ?? 0}
        thisWeekAfterTodayLessonCount={lessonSummary?.thisWeekAfterTodayLessonCount ?? 0}
        nextWeekCount={lessonSummary?.nextWeekLessonCount ?? 0}
        totalCount={lessonSummary?.totalLessonCount ?? 0}
      />
      <div className="lesson-status-color-desc">
        {Object.keys(statusStyle).map((key) => (
          <span key={key} style={{ color: statusStyle[key as LessonStatus].text }}>
            ● {statusStyle[key as LessonStatus].label}
          </span>
        ))}
      </div>
    </div>
  );
};

export default LessonCardSection;
