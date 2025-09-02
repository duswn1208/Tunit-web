import { Calendar, View, DateLocalizer, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

export interface CalendarEvent {
  title: string;
  allDay: boolean;
  start: Date;
  end: Date;
  desc: string;
  resourceId?: string;
  tooltip?: string;
  userId: string;
  calenderType: number;
}

export interface CalendarModalData {
  title: string;
  start: Date;
  end: Date;
  calendarType: number;
}

export function Calendar() {
  const localizer = momentLocalizer(moment);
  return (
    <Calendar
      selectable
      localizer={localizer}
      events={[]}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 500 }}
    />
  );
}
