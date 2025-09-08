import React from 'react';
import { statusStyle, type LessonEvent } from '../types/lessonCalendar';
import TuCalendar from '../../../components/TuCalendar';

interface LessonCalendarSectionProps {
  lessonEvents: LessonEvent[];
  onSelectEvent: (event: LessonEvent) => void;
  statusStyleMap?: Record<string, { dot: string; text: string }>;
}

const LessonCalendarSection: React.FC<LessonCalendarSectionProps> = ({
  lessonEvents,
  onSelectEvent,
  statusStyleMap = statusStyle,
}) => {
  return (
    <div className="lesson-calendar-section">
      <TuCalendar
        events={lessonEvents}
        onSelectEvent={onSelectEvent}
        statusStyleMap={statusStyleMap}
      />
    </div>
  );
};

export default LessonCalendarSection;
