import { Calendar, Views, dateFnsLocalizer, type View } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ko } from 'date-fns/locale/ko';
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

import { useState } from 'react';

export default function CommonCalendar({ events, onSelectEvent }: CommonCalendarProps) {
  const [view, setView] = useState<View>(Views.MONTH);
  const [date, setDate] = useState(new Date());

  type CalendarEvent = {
    id: number | string;
    title: string;
    start: Date | string;
    end: Date | string;
    [key: string]: any;
  };

  return (
    <div className="common-calendar-card">
      <div className="common-calendar-content">
        <Calendar
          events={events}
          localizer={localizer}
          views={['month', 'week', 'day']}
          startAccessor={(event: CalendarEvent) =>
            typeof event.start === 'string' ? new Date(event.start) : event.start
          }
          endAccessor={(event: CalendarEvent) =>
            typeof event.end === 'string' ? new Date(event.end) : event.end
          }
          view={view}
          onView={(v) => setView(v)}
          date={date}
          onNavigate={setDate}
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
          components={{
            event: ({ event }: { event: any }) => (
              <div>
                <span className="brand-chip-dot"></span>
                <b className="lesson-calendar-name">{event.title}</b>
              </div>
            ),
          }}
        />
      </div>
    </div>
  );
}
