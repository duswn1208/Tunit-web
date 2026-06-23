import { useEffect, useState } from 'react';
import { type LessonEvent, type LessonSummary, type LessonStatus, statusStyle } from '@/domain/lesson/types/lessonCalendar.ts';
import { api } from '../../../shared/lib/api.ts';
import LessonCalendarSection from '@/domain/lesson/components/LessonCalendarSection.tsx';
import LessonDetailModal from '@/domain/lesson/components/LessonDetailModal.tsx';
import Header from '@/shared/components/Header.tsx';
import '@/shared/css/components/lesson-manage.css';
import LessonListSection from '@/domain/lesson/components/LessonListSection.tsx';
import LessonFilterSection from '@/domain/lesson/components/LessonFilterSection.tsx';
import LessonManageViewToggle from '@/domain/lesson/components/LessonManageViewToggle.tsx';
import LessonRegisterModal from '@/domain/lesson/components/LessonRegisterModal.tsx';
import Button from '@/shared/components/Button.tsx';
import { toAmPmFormat } from '@/domain/dayTime/lib/timeUtils.ts';
import { useNavigate } from 'react-router-dom';

export default function LessonManageLayout() {
  const navigate = useNavigate();
  const [filterStudent, setFilterStudent] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [lessonSummary, setLessonSummary] = useState<LessonSummary | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<LessonEvent | null>(null);
  const [viewType, setViewType] = useState<'calendar' | 'list'>('calendar');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59);

  const fetchLessons = () => {
    api
      .get(`/api/lessons`, {
        params: {
          startDate: monthStart.toISOString().slice(0, 10),
          endDate: monthEnd.toISOString().slice(0, 10),
        },
      })
      .then((data: any) => {
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
        // 미확정 체험의 1순위 후보 시간을 "잠정(점선)" 이벤트로 변환
        let candidateEvents = (data.trialCandidates ?? []).map((item: any) => ({
          title: `${item.studentName}(체험·잠정)`,
          status: 'CANDIDATE',
          studentName: item.studentName,
          date: new Date(item.date),
          start: new Date(`${item.date}T${item.startTime}`),
          end: new Date(`${item.date}T${item.endTime}`),
          allDay: false,
          id: `trial-${item.contractNo}`,
          contractNo: item.contractNo,
        }));

        // 필터 적용
        if (filterStudent) {
          mappedLessonList = mappedLessonList.filter((l: { studentName: string | string[] }) =>
            l.studentName.includes(filterStudent)
          );
          candidateEvents = candidateEvents.filter((c: { studentName: string }) =>
            c.studentName.includes(filterStudent)
          );
        }
        if (filterStatus) {
          mappedLessonList = mappedLessonList.filter(
            (l: { status: { name: string } }) => l.status.name === filterStatus
          );
        }
        // 상태 필터가 없을 때만 잠정 후보를 함께 노출(특정 상태로 필터 시 제외)
        const lessonList = filterStatus ? mappedLessonList : [...mappedLessonList, ...candidateEvents];
        setLessonSummary({
          ...data,
          lessonList,
        });
      });
  };

  useEffect(() => {
    fetchLessons();
  }, [filterStudent, filterStatus, currentDate]);

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
      <div className="lesson-manage-top">
        <Header title="레슨 관리" />
        <div className="lesson-manage-top-actions">
          <Button onClick={() => setShowRegisterModal(true)} size="sm">레슨 등록</Button>
          <Button onClick={() => navigate('/tutor/schedule')} className="ui-btn--accent" size="sm">
            스케줄 설정
          </Button>
        </div>
      </div>

      <div className="lesson-stats-bar">
        <div className="lesson-stat-item">
          <span className="lesson-stat-value">{lessonSummary?.todayLessonCount ?? 0}</span>
          <span className="lesson-stat-label">오늘</span>
        </div>
        <div className="lesson-stat-item">
          <span className="lesson-stat-value">{lessonSummary?.thisWeekLessonCount ?? 0}</span>
          <span className="lesson-stat-label">이번주 남은</span>
        </div>
        <div className="lesson-stat-item">
          <span className="lesson-stat-value">{lessonSummary?.nextWeekLessonCount ?? 0}</span>
          <span className="lesson-stat-label">다음주 예정</span>
        </div>
        <div className="lesson-stat-item lesson-stat-item--total">
          <span className="lesson-stat-value">{lessonSummary?.totalLessonCount ?? 0}</span>
          <span className="lesson-stat-label">이번달 전체</span>
        </div>
      </div>

      <div className="lesson-manage-controls">
        <div className="lesson-manage-controls-left">
          <LessonManageViewToggle viewType={viewType} setViewType={setViewType} />
          <div className="lesson-status-color-desc">
            {(Object.keys(statusStyle) as LessonStatus[]).map((key) => (
              <span key={key} style={{ color: statusStyle[key].dot }}>
                ● {statusStyle[key].label}
              </span>
            ))}
          </div>
        </div>
        <div className="lesson-manage-controls-right">
          <LessonFilterSection
            filterStudent={filterStudent}
            setFilterStudent={setFilterStudent}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
          />
        </div>
      </div>

      <div className="lesson-manage-content">
        {viewType === 'calendar' ? (
          <LessonCalendarSection
            lessonEvents={lessonSummary?.lessonList ?? []}
            onSelectEvent={(event: any) => {
              // 잠정(체험 후보) 이벤트는 실제 예약이 아니므로 상세 모달을 열지 않음
              if (event?.status === 'CANDIDATE') return;
              setSelectedEvent(event);
            }}
            onSelectSlot={(slotInfo: any) => {
              const d = slotInfo?.start instanceof Date ? slotInfo.start : null;
              const date = d
                ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
                : '';
              setSelectedDate(date);
              setShowRegisterModal(true);
            }}
            onNavigate={setCurrentDate}
            size="medium"
          />
        ) : (
          <LessonListSection
            lessonEvents={(lessonSummary?.lessonList ?? []).filter(
              (l: any) => l.status !== 'CANDIDATE'
            )}
            onSelectEvent={setSelectedEvent}
          />
        )}
      </div>
      <LessonRegisterModal
        open={showRegisterModal}
        initialDate={selectedDate}
        onClose={() => setShowRegisterModal(false)}
        onSuccess={() => { setShowRegisterModal(false); fetchLessons(); }}
      />
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
