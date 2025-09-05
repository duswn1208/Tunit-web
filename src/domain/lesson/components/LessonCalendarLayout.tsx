import TuCalendar from '../../../components/TuCalendar';
import { format } from 'date-fns';
// 상태별 컬러/네이밍 매핑 상수
const colorMap: Record<string, string> = {
  REQUESTED: 'var(--brand-mint)',
  ACTIVE: 'var(--brand-chip)',
  CANCELED: 'var(--brand-gray)',
  EXPIRED: 'var(--brand-gray)',
  NOSHOW: 'var(--brand-gray)',
};

const statusText: Record<string, string> = {
  REQUESTED: '예약요청',
  ACTIVE: '진행중',
  CANCELED: '취소됨',
  EXPIRED: '만료됨',
  NOSHOW: '결석',
};
import { useState, useEffect } from 'react';
import '../../../css/components/common-calendar.css';
import { api } from '../../../lib/api';
import { ko } from 'date-fns/locale';
import LessonDetailCard from './LessonDetailCard';

// 캘린더 localizer 설정
const locales = { ko };

export type LessonEvent = {
  studentName: string;
  status: 'REQUESTED | ACTIVE | CANCELED | EXPIRED | NOSHOW';
  date: Date;
  start: Date;
  end: Date;
  allDay?: boolean;
  title: string;
};

export default function LessonCalendarLayout() {
  const [events, setEvents] = useState<LessonEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<LessonEvent | null>(null);

  // 이번달 시작/끝 날짜 구하기
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  useEffect(() => {
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
          id: item.lessonReservationNo,
          studentName: item.studentName,
          status: item.status,
          date,
          start,
          end,
          allDay: false,
          title: `${format(start, 'HH:mm')}(${item.studentName})`,
        };
      });
      setEvents(lessonEvents);
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
        <div
          style={{ width: '1200px', minWidth: '900px', maxWidth: '100%', transition: 'width 0.2s' }}
        >
          <TuCalendar events={events} onSelectEvent={setSelectedEvent} />
        </div>
        {selectedEvent && (
          <LessonDetailCard
            studentName={selectedEvent.studentName}
            date={selectedEvent.date}
            start={selectedEvent.start}
            end={selectedEvent.end}
            status={selectedEvent.status}
            color={colorMap[selectedEvent.status]}
            statusText={statusText[selectedEvent.status]}
            onClose={() => setSelectedEvent(null)}
          />
        )}
      </div>
    </div>
  );
}
