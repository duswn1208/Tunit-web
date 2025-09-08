import { useState, useEffect } from 'react';
import '../../../css/components/common-calendar.css';
import { api } from '../../../lib/api';
import { ko } from 'date-fns/locale';
import TuCalendar from '../../../components/TuCalendar';
import LessonDetailCard from './LessonDetailCard';
import Modal from '../../../components/Modal';
import '../../../css/components/modal.css';
import LessonCountCard from './LessonCountCard';
import { type LessonEvent, type LessonSummary, colorMap } from '../types/lessonCalendar';

// 캘린더 localizer 설정
const locales = { ko };

export function LessonCalendarLayout() {
  // API에서 받은 전체 레슨 데이터 상태
  const [lessonSummary, setLessonSummary] = useState<LessonSummary | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<LessonEvent | null>(null);

  // 이번달 시작/끝 날짜 구하기
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  // 레슨 목록 불러오기 함수로 분리
  const fetchLessons = () => {
    api(
      `/api/lessons?startDate=${monthStart.toISOString().slice(0, 10)}&endDate=${monthEnd
        .toISOString()
        .slice(0, 10)}`
    ).then((data: any) => {
      const formatTime = (time: string) => time.slice(0, 5); // HH:mm:ss → HH:mm
      const mappedLessonList = (data.lessonList ?? []).map((item: any) => ({
        title: `${item.studentName}(${formatTime(item.startTime)})`,
        status: item.status, // 객체 전체 전달
        studentName: item.studentName,
        date: new Date(item.date),
        start: new Date(`${item.date}T${item.startTime}`),
        end: new Date(`${item.date}T${item.endTime}`),
        allDay: false,
        id: item.lessonReservationNo,
      }));
      setLessonSummary({
        ...data,
        lessonList: mappedLessonList,
      });
    });
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  // 삭제 API 연동 메서드
  const deleteLesson = async (lessonId?: string) => {
    alert('해당 레슨을 삭제하시겠습니까 ?');
    if (!lessonId) return;
    try {
      await api(`/api/lessons/${lessonId}`, { method: 'DELETE' });
      alert('삭제되었습니다.');
      fetchLessons(); // 삭제 후 목록 새로고침
      setSelectedEvent(null); // 카드 닫기
    } catch (err) {
      alert('삭제에 실패했습니다.');
    }
  };

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
      <div style={{ display: 'flex', gap: 16 }}>
        <div style={{ minWidth: '900px', maxWidth: '100%', transition: 'width 0.2s' }}>
          <TuCalendar events={lessonSummary?.lessonList ?? []} onSelectEvent={setSelectedEvent} />
        </div>
        <div
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}
        >
          <LessonCountCard
            todayCount={lessonSummary?.todayLessonCount ?? 0}
            thisWeekAfterTodayLessonCount={lessonSummary?.thisWeekAfterTodayLessonCount ?? 0}
            nextWeekCount={lessonSummary?.nextWeekLessonCount ?? 0}
            totalCount={lessonSummary?.totalLessonCount ?? 0}
          />
        </div>
        <Modal open={!!selectedEvent} onClose={() => setSelectedEvent(null)}>
          {selectedEvent && (
            <LessonDetailCard
              studentName={selectedEvent.studentName}
              date={selectedEvent.date}
              start={selectedEvent.start}
              end={selectedEvent.end}
              status={
                (lessonSummary?.lessonList.find((l) => l.id === (selectedEvent as any).id) as any)
                  ?.status
              }
              color={colorMap[selectedEvent.status.name]}
              statusText={selectedEvent.status.label}
              onDelete={() => deleteLesson((selectedEvent as any).id)}
              onClose={() => setSelectedEvent(null)}
            />
          )}
        </Modal>
      </div>
    </div>
  );
}
