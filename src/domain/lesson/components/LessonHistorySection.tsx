import { useLessonHistorySection } from '../hooks/useLessonHistorySection';
import Button from '@/shared/components/Button';
import Tab from '@/shared/components/Tab';
import LessonCalendarSection from './LessonCalendarSection';
import { LessonCard } from './LessonCard';
import './css/LessonHistorySection.css';
import { toAmPmFormat } from '@/domain/dayTime/lib/timeUtils';
import { useState } from 'react';
import useMediaQuery from '@/shared/hooks/useMediaQuery';
import LessonManageViewToggle from './LessonManageViewToggle';
import { ReviewModal } from '@/shared/components/ReviewModal';

export default function LessonHistorySection() {
  const {
    lessons,
    activeTab,
    setActiveTab,
    handleCancelLesson,
    handleChangeLesson,
    handleWriteReview,
    handleReserveLesson,
    handleChatWithTutor,
    handleBookNewLesson,
  } = useLessonHistorySection();

  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);
  const isMobile = useMediaQuery('(max-width: 600px)');
  const [mobileView, setMobileView] = useState<'calendar' | 'list'>('calendar');
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewModalData, setReviewModalData] = useState<{
    lessonReservationNo: number;
    tutorName: string;
    lessonDate: string;
  } | null>(null);

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
      const hideReviewBtn =
        ['CANCELED', 'EXPIRED'].includes(lesson.status.name) || lesson.isReviewed;
      return (
        <div>
          {!hideReviewBtn && (
            <Button
              className="ui-btn ui-btn--accent mr-8"
              size="sm"
              onClick={() => {
                setReviewModalData({
                  lessonReservationNo: lesson.lessonReservationNo,
                  tutorName: lesson.tutorInfo?.nickname || '',
                  lessonDate: lesson.lessonDate || '',
                });
                setReviewModalOpen(true);
              }}
            >
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
    const isSelected = selectedLessonId === lesson.lessonReservationNo;
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
        className={isSelected ? 'lesson-card-highlighted' : ''}
        onClick={() => setSelectedLessonId(lesson.lessonReservationNo)}
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
              handleBookNewLesson();
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
      {/* 탭 + 레슨 예약 버튼 */}
      <div
        className="lesson-header-row"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
        aria-label="레슨 내역 필터"
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
        <Button className="ui-btn ui-btn--accent" size="sm" onClick={handleBookNewLesson}>
          + 레슨 예약
        </Button>
      </div>

      {/* 모바일: 캘린더/리스트 토글 */}
      {isMobile && (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '12px 0 8px 0' }}>
          <LessonManageViewToggle viewType={mobileView} setViewType={setMobileView} />
        </div>
      )}

      {/* 본문: PC는 분할, 모바일은 토글 */}
      {isMobile ? (
        mobileView === 'calendar' ? (
          <div className="lesson-calendar-container">
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
              onSelectEvent={(event: any) => {
                setSelectedLessonId(event.id);
                const element = document.querySelector(`[data-lesson-id="${event.id}"]`);
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }}
              size="medium"
            />
          </div>
        ) : (
          <div className="lesson-list-container">{renderLessonList(lessons)}</div>
        )
      ) : (
        <div className="lesson-split-layout">
          {/* 왼쪽: 캘린더 */}
          <div className="lesson-calendar-container">
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
              onSelectEvent={(event: any) => {
                setSelectedLessonId(event.id);
                // 리스트로 스크롤
                const element = document.querySelector(`[data-lesson-id="${event.id}"]`);
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }}
              size="medium"
            />
          </div>

          {/* 오른쪽: 리스트 */}
          <div className="lesson-list-container">{renderLessonList(lessons)}</div>
        </div>
      )}

      {/* 후기 작성 모달 */}
      {reviewModalData && (
        <ReviewModal
          isOpen={reviewModalOpen}
          onClose={() => {
            setReviewModalOpen(false);
            setReviewModalData(null);
          }}
          onSubmit={async (data) => {
            await handleWriteReview(
              reviewModalData.lessonReservationNo,
              reviewModalData.tutorName,
              reviewModalData.lessonDate
            ).then((handler) => handler.submit(data));
          }}
          lessonReservationNo={reviewModalData.lessonReservationNo}
          tutorName={reviewModalData.tutorName}
          lessonDate={reviewModalData.lessonDate}
        />
      )}
    </section>
  );
}

// 날짜/시간 기준 남은 시간 텍스트 반환 함수
