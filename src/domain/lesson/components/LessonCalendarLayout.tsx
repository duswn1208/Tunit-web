import { Calendar as BigCalendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ko } from 'date-fns/locale/ko';
import { useState, useEffect } from 'react';
import '../../../css/components/common-calendar.css';
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
          parsed.map((e: any) => ({ ...e, start: new Date(e.start), end: new Date(e.end) }))
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
        <div className="common-calendar-card" style={{ flex: 1 }}>
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
              onSelectEvent={(event) => setSelectedEvent(event)}
            />
          </div>
        </div>
        {selectedEvent && (
          <div
            style={{
              minWidth: 280,
              maxWidth: 340,
              background: '#fff',
              borderRadius: 16,
              boxShadow: '0 4px 24px 0 rgba(30,201,187,0.10)',
              border: '2px solid var(--brand-mint)',
              padding: 24,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              alignSelf: 'flex-start',
              color: '#222',
            }}
          >
            <div
              style={{ fontSize: 20, fontWeight: 700, color: 'var(--brand-mint)', marginBottom: 8 }}
            >
              {selectedEvent.studentName}
            </div>
            <div>
              <b>날짜:</b> {selectedEvent.date.toLocaleDateString()}
            </div>
            <div>
              <b>시간:</b> {selectedEvent.start.toLocaleTimeString()} ~{' '}
              {selectedEvent.end.toLocaleTimeString()}
            </div>
            <div>
              <b>상태:</b> {selectedEvent.status}
            </div>
            <div style={{ marginTop: 16 }}>
              <button
                type="button"
                style={{
                  background: 'var(--brand-mint)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '8px 0',
                  cursor: 'pointer',
                  width: '100%',
                  fontWeight: 600,
                  fontSize: 16,
                  transition: 'background 0.2s',
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = '#159e99')}
                onMouseOut={(e) => (e.currentTarget.style.background = 'var(--brand-mint)')}
                onClick={() => setSelectedEvent(null)}
              >
                닫기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
