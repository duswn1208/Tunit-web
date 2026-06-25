import { useEffect, useState } from 'react';
import { type LessonEvent, type LessonSummary, type LessonStatus, statusStyle } from '@/domain/lesson/types/lessonCalendar.ts';
import { api } from '../../../shared/lib/api.ts';
import LessonCalendarSection from '@/domain/lesson/components/LessonCalendarSection.tsx';
import LessonDrawer from '@/domain/lesson/components/LessonDrawer.tsx';
import Header from '@/shared/components/Header.tsx';
import '@/shared/css/components/lesson-manage.css';
import LessonListSection from '@/domain/lesson/components/LessonListSection.tsx';
import LessonFilterSection from '@/domain/lesson/components/LessonFilterSection.tsx';
import LessonManageViewToggle from '@/domain/lesson/components/LessonManageViewToggle.tsx';
import LessonRegisterModal from '@/domain/lesson/components/LessonRegisterModal.tsx';
import Button from '@/shared/components/Button.tsx';
import { toAmPmFormat } from '@/domain/dayTime/lib/timeUtils.ts';
import { useNavigate } from 'react-router-dom';

const AVATAR_COLORS = ['#4F59D6','#6B4EFF','#0075FF','#00B386','#FF6B35','#F7A300','#F04452'];
function getAvatarColor(name: string) {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}

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

  const pendingCount = (lessonSummary?.lessonList ?? []).filter((l: any) => l.status?.name === 'REQUESTED').length;

  const today = new Date();
  const todayLessons = (lessonSummary?.lessonList ?? []).filter((l: any) => {
    if (l.status === 'CANDIDATE' || l.status?.name === 'CANDIDATE') return false;
    const d = l.date instanceof Date ? l.date : new Date(l.date);
    return d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate();
  });

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
          contractNo: item.contractNo,
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
        <div className="lesson-stat-item" onClick={() => setFilterStatus('')}>
          <span className="lesson-stat-value">{lessonSummary?.todayLessonCount ?? 0}</span>
          <span className="lesson-stat-label">오늘</span>
        </div>
        <div className="lesson-stat-item" onClick={() => setFilterStatus('')}>
          <span className="lesson-stat-value">{lessonSummary?.thisWeekLessonCount ?? 0}</span>
          <span className="lesson-stat-label">이번주 남은</span>
        </div>
        <div className="lesson-stat-item lesson-stat-item--pending" onClick={() => setFilterStatus('REQUESTED')}>
          <span className="lesson-stat-value">{pendingCount}</span>
          <span className="lesson-stat-label">신청 대기</span>
        </div>
        <div className="lesson-stat-item lesson-stat-item--total" onClick={() => setFilterStatus('')}>
          <span className="lesson-stat-value">{lessonSummary?.totalLessonCount ?? 0}</span>
          <span className="lesson-stat-label">이번달 전체</span>
        </div>
      </div>

      {pendingCount > 0 && (
        <div className="lesson-pending-banner">
          <span className="lesson-pending-banner__icon"><i className="fas fa-exclamation-circle" aria-hidden="true"></i></span>
          <span className="lesson-pending-banner__text">
            {pendingCount}개의 레슨 신청이 대기 중입니다
          </span>
          <button
            className="lesson-pending-banner__btn"
            onClick={() => setFilterStatus('REQUESTED')}
          >
            확인하기 <i className="fas fa-arrow-right" aria-hidden="true"></i>
          </button>
        </div>
      )}

      {todayLessons.length > 0 && (
        <div className="lesson-today-strip">
          <div className="lesson-today-strip__header">
            <span className="lesson-today-strip__title">오늘의 레슨</span>
            <span className="lesson-today-strip__count">{todayLessons.length}개</span>
          </div>
          <div className="lesson-today-strip__scroll">
            {todayLessons.map((lesson: any) => (
              <div key={lesson.id} className="lesson-today-card" onClick={() => setSelectedEvent(lesson)}>
                <div className="lesson-today-card__avatar" style={{ background: getAvatarColor(lesson.studentName) + '22', color: getAvatarColor(lesson.studentName) }}>
                  {lesson.studentName.slice(0, 2)}
                </div>
                <div className="lesson-today-card__info">
                  <span className="lesson-today-card__name">{lesson.studentName}</span>
                  <span className="lesson-today-card__time">
                    {lesson.start instanceof Date ? lesson.start.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) : ''} –
                    {lesson.end instanceof Date ? lesson.end.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) : ''}
                  </span>
                </div>
                {lesson.status?.allowedNextStatuses?.find((s: any) => s.name === 'ACTIVE') && (
                  <button className="lesson-today-card__btn lesson-today-card__btn--confirm"
                    onClick={(e) => { e.stopPropagation(); changeLessonStatus(lesson.id, 'ACTIVE'); }}>
                    확정
                  </button>
                )}
                {lesson.status?.allowedNextStatuses?.find((s: any) => s.name === 'CANCELED') && (
                  <button className="lesson-today-card__btn lesson-today-card__btn--cancel"
                    onClick={(e) => { e.stopPropagation(); changeLessonStatus(lesson.id, 'CANCELED'); }}>
                    취소
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

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
      <LessonDrawer
        open={!!selectedEvent}
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onDelete={deleteLesson}
        onChangeStatus={changeLessonStatus}
      />
    </div>
  );
}
