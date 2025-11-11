import { useEffect, useState } from 'react';
import { type LessonEvent, type LessonSummary } from '@/domain/lesson/types/lessonCalendar.ts';
import { api } from '../../../shared/lib/api.ts';
import LessonCalendarSection from '@/domain/lesson/components/LessonCalendarSection.tsx';
import LessonCardSection from '@/domain/lesson/components/LessonCardSection.tsx';
import LessonDetailModal from '@/domain/lesson/components/LessonDetailModal.tsx';
import Header from '@/shared/components/Header.tsx';
import '@/shared/css/components/lesson-manage.css';
import LessonListSection from '@/domain/lesson/components/LessonListSection.tsx';
import LessonFilterSection from '@/domain/lesson/components/LessonFilterSection.tsx';
import LessonManageViewToggle from '@/domain/lesson/components/LessonManageViewToggle.tsx';
import LessonRegisterModal from '@/domain/lesson/components/LessonRegisterModal.tsx';
import Button from '@/shared/components/Button.tsx';
import { toAmPmFormat } from '@/domain/dayTime/lib/timeUtils.ts';

export default function LessonManageLayout() {
  const [filterStudent, setFilterStudent] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [lessonSummary, setLessonSummary] = useState<LessonSummary | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<LessonEvent | null>(null);
  const [viewType, setViewType] = useState<'calendar' | 'list'>('calendar');
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const fetchLessons = () => {
    api
      .get(`/api/lessons`, {
        params: {
          startDate: monthStart.toISOString().slice(0, 10),
          endDate: monthEnd.toISOString().slice(0, 10),
        },
      })
      .then((data: any) => {
        console.log('Fetched lesson data:', data);
        let mappedLessonList = (data.lessonList ?? []).map((item: any) => ({
          title: `${item.studentName}(${toAmPmFormat(item.startTime)})`,
          status: item.status,
          studentName: item.studentName,
          date: new Date(item.date),
          start: new Date(`${item.date}T${item.startTime}`),
          end: new Date(`${item.date}T${item.endTime}`),
          allDay: false,
          id: item.lessonReservationNo,
          category: item.category,
        }));
        // 필터 적용
        if (filterStudent) {
          mappedLessonList = mappedLessonList.filter((l: { studentName: string | string[] }) =>
            l.studentName.includes(filterStudent)
          );
        }
        if (filterStatus) {
          console.log(mappedLessonList);
          mappedLessonList = mappedLessonList.filter(
            (l: { status: { name: string } }) => l.status.name === filterStatus
          );
        }
        setLessonSummary({
          ...data,
          lessonList: mappedLessonList,
        });
      });
  };

  useEffect(() => {
    fetchLessons();
  }, [filterStudent, filterStatus]);

  const deleteLesson = async (lessonId?: number) => {
    if (!lessonId) return;
    try {
      await api.delete(`/api/lessons/${lessonId}`);
      fetchLessons();
      setSelectedEvent(null);
    } catch (err) {
      alert('삭제에 실패했습니다.');
    }
  };

  // 상태변경 메서드: 상위에서 API 호출 및 리패치
  const changeLessonStatus = async (lessonId: number, nextStatus: string) => {
    try {
      await api.post(`/api/lessons/${lessonId}/status`, { status: nextStatus });
      fetchLessons();
      setSelectedEvent(null);
      alert('변경되었습니다.');
    } catch (err) {
      alert('상태 변경에 실패했습니다.');
    }
  };

  return (
    <div className="lesson-manage-layout">
      <Header title="레슨 관리" />
      <div className="lesson-manage-sub-header">
        <LessonFilterSection
          filterStudent={filterStudent}
          setFilterStudent={setFilterStudent}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
        />
        <Button onClick={() => setShowRegisterModal(true)}>레슨 등록</Button>
      </div>

      <LessonManageViewToggle viewType={viewType} setViewType={setViewType} />
      <div className="lesson-manage-content">
        <div className="lesson-manage-main">
          {viewType === 'calendar' ? (
            <LessonCalendarSection
              lessonEvents={lessonSummary?.lessonList ?? []}
              onSelectEvent={setSelectedEvent}
              onSelectSlot={() => setShowRegisterModal(true)}
              size="medium"
            />
          ) : (
            <LessonListSection
              lessonEvents={lessonSummary?.lessonList ?? []}
              onSelectEvent={setSelectedEvent}
            />
          )}
        </div>
        <div className="lesson-manage-sidebar">
          <LessonCardSection lessonSummary={lessonSummary} />
        </div>
      </div>
      <LessonRegisterModal open={showRegisterModal} onClose={() => setShowRegisterModal(false)} />
      <LessonDetailModal
        open={!!selectedEvent}
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onDelete={deleteLesson}
        onChangeStatus={changeLessonStatus}
      />
    </div>
  );
}
