import React from 'react';
import { type LessonEvent, statusStyle } from '../domain/lesson/types/lessonCalendar';
import { format } from 'date-fns';

export function EventCell({ event }: { event: LessonEvent }) {
  const s = statusStyle[event.status];
  return (
    <div
      title={`상태: ${event.status}
시간: ${format(event.start, 'HH:mm')} - ${format(event.end, 'HH:mm')}
메모: ${event.memo ?? '-'}`}
      style={{ display: 'flex', alignItems: 'center', gap: 6, color: s.text }}
    >
      <span
        aria-hidden
        style={{
          width: 8,
          height: 8,
          background: s.dot,
          borderRadius: 9999,
          display: 'inline-block',
        }}
      />
      <span style={{ fontWeight: 600 }}>{format(event.start, 'HH:mm')}</span>
      <span>{event.title}</span>
    </div>
  );
}
