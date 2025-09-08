import React from 'react';
import LessonCountCard from './LessonCountCard';
import { type LessonSummary } from '../types/lessonCalendar';

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
    </div>
  );
};

export default LessonCardSection;
