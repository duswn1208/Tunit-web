import LessonDetailCard from './LessonDetailCard';
import CommonCalendar from '../../../components/CommonCalendar';
import { useState, useEffect } from 'react';
import '../../../css/components/common-calendar.css';
import '../../../css/components/lesson-calendar-card.css';
import { api } from '../../../lib/api';

// 캘린더 localizer 설정
const locales = { ko };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

type LessonEvent = {
  studentName: string;
  status: string;
  date: Date;
  start: Date;
  end: Date;
  allDay?: boolean;
};

export default function LessonCalendarLayout() {
  const [events, setEvents] = useState<LessonEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<LessonEvent | null>(null);

  // 이번달 시작/끝 날짜 구하기
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  useEffect(() => {
    const cached = localStorage.getItem('lessonEvents');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setEvents(
          parsed.map((e: any) => ({
            ...e,
            date: new Date(e.date),
            start: new Date(e.start),
            end: new Date(e.end),
          }))
        );
        return;
      } catch {}
    }
    // API 호출(예시: /api/lessons?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD)
    api(
      `/api/lessons?startDate=${monthStart.toISOString().slice(0, 10)}&endDate=${monthEnd
        .toISOString()
        .slice(0, 10)}`
    ).then((data) => {
      // 응답값 확인
      // 서버 응답을 LessonEvent[]로 변환
      const lessonEvents = data.map((item: any) => {
        // item: { lessonReservationNo, studentName, startTime, endTime, date, status }
        const start = new Date(`${item.date}T${item.startTime}`);
        const end = new Date(`${item.date}T${item.endTime}`);
        const date = new Date(item.date);
        return {
          studentName: `${item.studentName}`,
          status: `${item.status}`,
          date,
          start,
          end,
          allDay: false,
        };
      });
      setEvents(lessonEvents);
      localStorage.setItem('lessonEvents', JSON.stringify(lessonEvents));
    });
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '80vh',
      }}
    >
      <h2 style={{ fontSize: 28, fontWeight: 700, color: 'var(--brand-mint)', marginBottom: 32 }}>
        레슨 일정관리
      </h2>

      <div style={{ display: 'flex', gap: 32 }}>
        <div style={{ flex: 1 }}>
          <CommonCalendar
            events={events}
            onSelectEvent={(event) => setSelectedEvent(event as LessonEvent)}
          />
        </div>
        {selectedEvent && (
          <LessonDetailCard event={selectedEvent} onClose={() => setSelectedEvent(null)} />
        )}
      </div>
    </div>
  );
}
