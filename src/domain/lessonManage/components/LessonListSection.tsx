import React from 'react';
import { statusStyle, type LessonEvent } from '../types/lessonCalendar';

interface LessonListSectionProps {
  lessonEvents: LessonEvent[];
  onSelectEvent: (event: LessonEvent) => void;
}

const LessonListSection: React.FC<LessonListSectionProps> = ({ lessonEvents, onSelectEvent }) => {
  return (
    <div className="lesson-list-view">
      <table className="lesson-list-table">
        <thead>
          <tr>
            <th className="lesson-list-th">학생명</th>
            <th className="lesson-list-th">날짜</th>
            <th className="lesson-list-th">시작</th>
            <th className="lesson-list-th">종료</th>
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
              </td>
              <td className="lesson-list-td">
                {lesson.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </td>
              <td
                className="lesson-list-td"
                style={{ color: statusStyle[lesson?.status?.name].text }}
              >
                {lesson?.status?.label}
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
