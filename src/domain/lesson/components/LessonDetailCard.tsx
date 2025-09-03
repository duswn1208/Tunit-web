import React from 'react';
import Card from '../../../components/Card';
import '../../../css/components/lesson-calendar-card.css';
import { format } from 'date-fns';

type LessonEvent = {
  studentName: string;
  status: string;
  date: Date;
  start: Date;
  end: Date;
  allDay?: boolean;
};

interface LessonDetailCardProps {
  event: LessonEvent;
  onClose: () => void;
}

const LessonDetailCard: React.FC<LessonDetailCardProps> = ({ event, onClose }) => {
  return (
    <Card
      title={event.studentName}
      className="lesson-calendar-card"
      footer={
        <button type="button" className="lesson-calendar-card-btn" onClick={onClose}>
          닫기
        </button>
      }
    >
      <div>
        <b>날짜:</b> {event.date ? format(event.date, 'yyyy-MM-dd').toString() : ''}
      </div>
      <div>
        <b>시간:</b> {event.start ? format(event.start, 'HH:mm') : ''}~{' '}
        {event.end ? format(event.end, 'HH:mm') : ''}
      </div>
      <div>
        <b>상태:</b> {event.status}
      </div>
    </Card>
  );
};

export default LessonDetailCard;
