import React from 'react';
import { statusStyle, type LessonEvent } from '../types/lessonCalendar';
import TuCalendar from '../../../components/TuCalendar';

interface LessonCalendarSectionProps {
  lessonEvents: LessonEvent[];
  onSelectEvent: (event: LessonEvent) => void;
  onSelectSlot?: (slotInfo: any) => void;
  statusStyleMap?: Record<string, { dot: string; text: string }>;
}

const LessonCalendarSection: React.FC<LessonCalendarSectionProps> = ({
  lessonEvents,
  onSelectEvent,
  onSelectSlot,
  statusStyleMap = statusStyle,
}) => {
  return (
    <div className="lesson-calendar-section">
      <TuCalendar
        events={lessonEvents}
        onSelectEvent={onSelectEvent}
        onSelectSlot={onSelectSlot}
        statusStyleMap={statusStyleMap}
      />
    </div>
  );
};

export default LessonCalendarSection;
