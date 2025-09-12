import { useEffect, useState } from 'react';
import { type LessonEvent, type LessonSummary } from '../domain/lessonManage/types/lessonCalendar';
import { api } from '../lib/api';
import LessonCalendarSection from '../domain/lessonManage/components/LessonCalendarSection';
import LessonCardSection from '../domain/lessonManage/components/LessonCardSection';
import LessonDetailModal from '../domain/lessonManage/components/LessonDetailModal';
import Header from '../components/Header';
import '../css/components/lesson-manage.css';
import SelectBox from '../components/SelectBox';
import LessonListSection from '../domain/lessonManage/components/LessonListSection';
import LessonFilterSection from '../domain/lessonManage/components/LessonFilterSection';
import LessonManageViewToggle from '../domain/lessonManage/components/LessonManageViewToggle';
import LessonRegisterModal from '../domain/lessonManage/components/LessonRegisterModal';

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
    api(
      `/api/lessons?startDate=${monthStart.toISOString().slice(0, 10)}&endDate=${monthEnd
        .toISOString()
        .slice(0, 10)}`
    ).then((data: any) => {
      const formatTime = (time: string) => time.slice(0, 5);
      let mappedLessonList = (data.lessonList ?? []).map((item: any) => ({
        title: `${item.studentName}(${formatTime(item.startTime)})`,
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
        mappedLessonList = mappedLessonList.filter((l) => l.studentName.includes(filterStudent));
      }
      if (filterStatus) {
        console.log(mappedLessonList);

        mappedLessonList = mappedLessonList.filter((l) => l.status.name === filterStatus);
      }
      setLessonSummary({
        ...data,
        lessonList: mappedLessonList,
      });
    });
  };

  useEffect(() => {
    fetchLessons();
    // 필터 변경 시에도 리패치
  }, [filterStudent, filterStatus]);

  const deleteLesson = async (lessonId?: number) => {
    if (!lessonId) return;
    try {
      await api(`/api/lessons/${lessonId}`, { method: 'DELETE' });
      fetchLessons();
      setSelectedEvent(null);
    } catch (err) {
      alert('삭제에 실패했습니다.');
    }
  };

  // 상태변경 메서드: 상위에서 API 호출 및 리패치
  const changeLessonStatus = async (lessonId: number, nextStatus: string) => {
    try {
      await api(`/api/lessons/${lessonId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
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
        <LessonManageViewToggle viewType={viewType} setViewType={setViewType} />
      </div>
      <button
        type="button"
        className="ui-button"
        style={{ height: 36 }}
        onClick={() => setShowRegisterModal(true)}
      >
        레슨 등록
      </button>
      <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
        {viewType === 'calendar' ? (
          <LessonCalendarSection
            lessonEvents={lessonSummary?.lessonList ?? []}
            onSelectEvent={setSelectedEvent}
            onSelectSlot={() => setShowRegisterModal(true)}
          />
        ) : (
          <LessonListSection
            lessonEvents={lessonSummary?.lessonList ?? []}
            onSelectEvent={setSelectedEvent}
          />
        )}
        <LessonCardSection lessonSummary={lessonSummary} />
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
