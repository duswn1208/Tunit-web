import { Calendar as BigCalendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ko } from 'date-fns/locale/ko';
import { useState } from 'react';
import '../css/components/common-calendar.css';

const locales = { ko };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

interface CommonCalendarProps {
  events: any[];
  onSelectEvent?: (event: any) => void;
}

export default function CommonCalendar({ events, onSelectEvent }: CommonCalendarProps) {
  return (
    <div className="common-calendar-card">
      <div className="common-calendar-content">
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          views={[Views.MONTH, Views.WEEK, Views.DAY]}
          defaultView={Views.MONTH}
          culture="ko"
          style={{ height: '100%' }}
          messages={{
            month: '월',
            week: '주',
            day: '일',
            today: '오늘',
            previous: '이전',
            next: '다음',
          }}
          onSelectEvent={onSelectEvent}
        />
      </div>
    </div>
  );
}
