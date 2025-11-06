import { useLessonHistorySection } from '../hooks/useLessonHistorySection';
import Button from '@/shared/components/Button';
import Tab from '@/shared/components/Tab';
import LessonCalendarSection from './LessonCalendarSection';
import { LessonCard } from './LessonCard';
import './css/LessonHistorySection.css';
import LessonManageViewToggle from './LessonManageViewToggle';
import { toAmPmFormat } from '@/domain/dayTime/lib/timeUtils';

// 임시 상수
export default function LessonHistorySection() {
  const {
    lessons,
    activeTab,
    setActiveTab,
    viewType,
    setViewType,
    handleCancelLesson,
    handleChangeLesson,
    handleWriteReview,
    handleReserveLesson,
    handleChatWithTutor,
  } = useLessonHistorySection();

  function renderActionButton(lesson: any) {
    if (activeTab === 'upcoming') {
      return (
        <div>
          <Button
            className="ui-btn ui-btn--accent mr-8"
            size="sm"
            onClick={() => handleCancelLesson(lesson.lessonReservationNo)}
          >
            레슨 취소
          </Button>
          <Button className="ui-btn" size="sm" onClick={() => handleChangeLesson(lesson)}>
            레슨 변경
          </Button>
        </div>
      );
    }
    if (activeTab === 'past') {
      const hideReview = ['CANCELED', 'EXPIRED'].includes(lesson.status.name);
      return (
        <div>
          {!hideReview && (
            <Button className="ui-btn ui-btn--accent mr-8" size="sm" onClick={handleWriteReview}>
              후기 작성
            </Button>
          )}
          <Button className="ui-btn" size="sm" onClick={handleReserveLesson}>
            레슨 재예약
          </Button>
        </div>
      );
    }
    if (activeTab === 'pending') {
      return (
        <div>
          <Button
            className="ui-btn ui-btn--accent mr-8"
            size="sm"
            onClick={() => handleCancelLesson(lesson.lessonReservationNo)}
          >
            레슨 취소
          </Button>
          <Button className="ui-btn" size="sm" onClick={() => handleChangeLesson(lesson)}>
            레슨 변경
          </Button>
        </div>
      );
    }
    return null;
  }

  function renderLessonCard(lesson: any) {
    return (
      <LessonCard
        key={lesson.lessonReservationNo}
        lesson={lesson}
        actionButton={renderActionButton(lesson)}
        onClickTutor={() => {
          if (lesson.tutorProfileNo) {
            window.location.href = `/tutor/${lesson.tutorProfileNo}`;
          }
        }}
        onClickChat={handleChatWithTutor}
      />
    );
  }

  function renderLessonList(lessons: any[]) {
    if (!lessons || lessons.length === 0) {
      return (
        <div className="no-lessons">
          <p style={{ marginBottom: '20%' }}>레슨 내역이 없습니다.</p>
          <Button
            className="ui-btn ui-btn--accent"
            onClick={() => {
              window.location.href = '/search';
            }}
          >
            레슨 예약하러 가볼까요?
          </Button>
        </div>
      );
    }
    return <div className="lesson-list">{lessons.map(renderLessonCard)}</div>;
  }

  return (
    <section className="lesson-history-section">
      {/* 탭 + 뷰 전환 버튼 한 줄 배치 */}
      <div
        className="lesson-header-row"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
        aria-label="레슨 내역 필터 및 뷰 전환"
      >
        <Tab
          tabs={['예정된 레슨', '지난 레슨', '예약 요청']}
          selected={
            activeTab === 'upcoming'
              ? '예정된 레슨'
              : activeTab === 'past'
              ? '지난 레슨'
              : '예약 요청'
          }
          onSelect={(selected) => {
            if (selected === '예정된 레슨') setActiveTab('upcoming');
            else if (selected === '지난 레슨') setActiveTab('past');
            else if (selected === '예약 요청') setActiveTab('pending');
          }}
        />
        <LessonManageViewToggle viewType={viewType} setViewType={setViewType} />
      </div>
      <div className="tab-content">
        {viewType === 'list'
          ? renderLessonList(lessons)
          : (console.log('Rendering LessonCalendarSection with lessons:', lessons),
            (
              <LessonCalendarSection
                lessonEvents={lessons.map((lesson) => ({
                  id: lesson.lessonReservationNo,
                  title: `${lesson.lessonCategory?.label} (${toAmPmFormat(lesson.startTime)})`,
                  start: new Date(lesson.lessonDate + 'T' + lesson.startTime),
                  end: new Date(lesson.lessonDate + 'T' + lesson.startTime),
                  date: new Date(lesson.lessonDate + 'T' + lesson.startTime),
                  status: lesson.status,
                  studentName: '',
                  category: {
                    label: lesson.lessonCategory?.label || '',
                    name: lesson.lessonCategory?.code || '',
                  },
                }))}
                onSelectEvent={() => {}}
                size="medium"
              />
            ))}
      </div>
    </section>
  );
}

// 날짜/시간 기준 남은 시간 텍스트 반환 함수
