import { useState } from 'react';
import { LessonStatus } from '@/domain/lesson/types/lesson';
import useLessonHistory from '../hooks/useLessonHistory';
import './LessonHistorySection.css';

type TabType = 'upcoming' | 'past' | 'pending';

export default function LessonHistorySection() {
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');
  const { upcomingLessons, pastLessons, pendingLessons, isLoading, error } = useLessonHistory();

  if (isLoading) {
    return <div className="lesson-history-loading">로딩 중...</div>;
  }

  if (error) {
    return <div className="lesson-history-error">데이터를 불러오는 중 문제가 발생했습니다.</div>;
  }

  const renderLessonList = (lessons: any[]) => {
    if (lessons.length === 0) {
      return <div className="no-lessons">레슨 내역이 없습니다.</div>;
    }

    return (
      <div className="lesson-list">
        {lessons.map((lesson) => (
          <div key={lesson.lessonNo} className="lesson-card">
            <div className="lesson-header">
              <h3>{lesson.lessonTitle}</h3>
              <span className={`status-badge ${lesson.status.toLowerCase()}`}>
                {getStatusLabel(lesson.status)}
              </span>
            </div>
            <div className="lesson-info">
              <div className="tutor-info">
                <span className="label">튜터</span>
                <span>{lesson.tutorName}</span>
              </div>
              <div className="schedule-info">
                <span className="label">일시</span>
                <span>{formatDateTime(lesson.lessonDate, lesson.startTime)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const getStatusLabel = (status: LessonStatus) => {
    switch (status) {
      case LessonStatus.TRIAL_REQUESTED:
        return '체험 레슨 요청';
      case LessonStatus.TRIAL_CONFIRMED:
        return '체험 레슨 확정';
      case LessonStatus.TRIAL_COMPLETED:
        return '체험 레슨 완료';
      case LessonStatus.REGULAR_REQUESTED:
        return '정규 레슨 요청';
      case LessonStatus.REGULAR_CONFIRMED:
        return '정규 레슨 확정';
      case LessonStatus.REGULAR_COMPLETED:
        return '정규 레슨 완료';
      case LessonStatus.CANCELED:
        return '취소됨';
      default:
        return '알 수 없음';
    }
  };

  const formatDateTime = (date: string, time: string) => {
    return `${date} ${time}`;
  };

  return (
    <section className="lesson-history-section">
      <div className="tab-buttons">
        <button
          className={`tab-button ${activeTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          예정된 레슨
        </button>
        <button
          className={`tab-button ${activeTab === 'past' ? 'active' : ''}`}
          onClick={() => setActiveTab('past')}
        >
          지난 레슨
        </button>
        <button
          className={`tab-button ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          예약 요청
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'upcoming' && renderLessonList(upcomingLessons)}
        {activeTab === 'past' && renderLessonList(pastLessons)}
        {activeTab === 'pending' && renderLessonList(pendingLessons)}
      </div>
    </section>
  );
}
