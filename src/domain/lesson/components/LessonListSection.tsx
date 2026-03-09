import React from 'react';
import { statusStyle, type LessonEvent } from '../types/lessonCalendar';

interface LessonListSectionProps {
  lessonEvents: LessonEvent[];
  onSelectEvent: (event: LessonEvent) => void;
}

const LessonListSection: React.FC<LessonListSectionProps> = ({ lessonEvents, onSelectEvent }) => {
  if (lessonEvents.length === 0) {
    return (
      <div className="lesson-list-empty">
        <span className="lesson-list-empty-icon">📋</span>
        <p>이번 달 레슨이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="lesson-list-view">
      <table className="lesson-list-table">
        <thead>
          <tr>
            <th className="lesson-list-th">학생명</th>
            <th className="lesson-list-th">날짜</th>
            <th className="lesson-list-th">시간</th>
            <th className="lesson-list-th">상태</th>
            <th className="lesson-list-th">카테고리</th>
          </tr>
        </thead>
        <tbody>
          {lessonEvents.map((lesson) => (
            <tr key={lesson.id} className="lesson-list-tr" onClick={() => onSelectEvent(lesson)}>
              <td className="lesson-list-td">{lesson.studentName}</td>
              <td className="lesson-list-td">{lesson.date.toLocaleDateString()}</td>
              <td className="lesson-list-td">
                {lesson.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                {' ~ '}
                {lesson.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </td>
              <td className="lesson-list-td">
                <span
                  className="lesson-list-status-chip"
                  style={{
                    color: statusStyle[lesson?.status?.name].text,
                    backgroundColor: statusStyle[lesson?.status?.name].bg,
                  }}
                >
                  {lesson?.status?.label}
                </span>
              </td>
              <td className="lesson-list-td">
                {typeof lesson.category === 'object' && lesson?.category?.label}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LessonListSection;
