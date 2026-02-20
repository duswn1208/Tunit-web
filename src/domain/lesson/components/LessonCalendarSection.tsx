import React from 'react';
import { statusStyle, type LessonEvent } from '../types/lessonCalendar';
import TuCalendar from '@/shared/components/TuCalendar';

interface LessonCalendarSectionProps {
  lessonEvents: LessonEvent[];
  onSelectEvent: (event: LessonEvent) => void;
  onSelectSlot?: (slotInfo: any) => void;
  onNavigate?: (date: Date) => void;
  statusStyleMap?: Record<string, { dot: string; text: string }>;
  size?: 'small' | 'medium' | 'large';
}

const LessonCalendarSection: React.FC<LessonCalendarSectionProps> = ({
  lessonEvents,
  onSelectEvent,
  onSelectSlot,
  onNavigate,
  statusStyleMap = statusStyle,
  size = 'medium',
}) => {
  return (
    <div className="lesson-calendar-section">
      <TuCalendar
        size={size}
        events={lessonEvents}
        onSelectEvent={onSelectEvent}
        onSelectSlot={onSelectSlot}
        onNavigate={onNavigate}
        statusStyleMap={statusStyleMap}
      />
    </div>
  );
};

export default LessonCalendarSection;
