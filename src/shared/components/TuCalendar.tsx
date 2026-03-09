import { Calendar, Views, dateFnsLocalizer, type View } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ko } from 'date-fns/locale/ko';
import '@/shared/css/components/common-calendar.css';

const locales = { ko };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

// 커스텀 툴바 컴포넌트
const CustomToolbar = ({ date, onNavigate, view, onView }: any) => {
  const goToPrevMonth = () => {
    onNavigate('PREV');
  };

  const goToNextMonth = () => {
    onNavigate('NEXT');
  };

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  if (view === 'day') {
    return (
      <div className="custom-calendar-toolbar custom-calendar-toolbar--day">
        <button className="calendar-back-button" onClick={() => onView('month')}>
          ← 캘린더
        </button>
        <span className="calendar-toolbar-label calendar-toolbar-label--day">
          {year}년 {month}월 {day}일
        </span>
      </div>
    );
  }

  return (
    <div className="custom-calendar-toolbar">
      <button onClick={goToPrevMonth} className="calendar-nav-button">
        &lt;
      </button>
      <span className="calendar-toolbar-label">
        {year}년 {month}월
      </span>
      <button onClick={goToNextMonth} className="calendar-nav-button">
        &gt;
      </button>
    </div>
  );
};

interface TuCalendarProps {
  events: any[];
  onSelectEvent?: (event: any) => void;
  onSelectSlot?: (slotInfo: any) => void;
  onNavigate?: (date: Date) => void;
  statusStyleMap?: Record<string, { dot: string; text: string }>;
  size?: 'small' | 'medium' | 'large';
}

import { useState } from 'react';

export default function TuCalendar({
  events,
  onSelectEvent,
  onSelectSlot,
  onNavigate,
  statusStyleMap,
  size = 'medium',
}: TuCalendarProps) {
  const [view, setView] = useState<View>(Views.MONTH);
  const [date, setDate] = useState(new Date());

  const handleNavigate = (newDate: Date) => {
    setDate(newDate);
    onNavigate?.(newDate);
  };

  type CalendarEvent = {
    id: number | string;
    title: string;
    start: Date | string;
    end: Date | string;
    [key: string]: any;
  };

  return (
    <div className="common-calendar-card">
      <div className={`common-calendar-content tunit-calendar ${size}`}>
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
          onNavigate={handleNavigate}
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
          onSelectSlot={onSelectSlot}
          selectable={!!onSelectSlot}
          components={{
            toolbar: CustomToolbar,
            event: ({ event }: { event: any }) => {
              const status = event.status?.name || event.status;
              const style = statusStyleMap?.[status] || { dot: '#636e72', text: '#636e72' };
              return (
                <div>
                  <span
                    className="brand-chip-dot"
                    style={{ background: style.dot, marginRight: 6, verticalAlign: 'middle' }}
                  ></span>
                  <b
                    className="lesson-calendar-name"
                    style={{
                      color: style.text,
                      textDecoration: status === 'CANCELED' ? 'line-through' : undefined,
                    }}
                  >
                    {event.title}
                  </b>
                </div>
              );
            },
          }}
        />
      </div>
    </div>
  );
}
