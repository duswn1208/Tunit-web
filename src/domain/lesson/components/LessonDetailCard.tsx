import React from 'react';
import Card from '../../../components/Card';
import '../../../css/components/lesson-calendar-card.css';
import { format } from 'date-fns';

interface LessonDetailCardProps {
  studentName: string;
  date: Date;
  start: Date;
  end: Date;
  status: string;
  color: string;
  statusText: string;
  onClose: () => void;
}

const LessonDetailCard: React.FC<LessonDetailCardProps> = ({
  studentName,
  date,
  start,
  end,
  status,
  color,
  statusText,
  onClose,
}) => {
  return (
    <Card
      title={studentName}
      className="lesson-calendar-card"
      footer={
        <button type="button" className="lesson-calendar-card-btn" onClick={onClose}>
          닫기
        </button>
      }
    >
      <div>
        <b>날짜:</b> {date ? format(date, 'yyyy-MM-dd') : ''}
      </div>
      <div>
        <b>시간:</b> {start ? format(start, 'HH:mm') : ''}~ {end ? format(end, 'HH:mm') : ''}
      </div>
      <div>
        <b>상태:</b>
        <span
          style={{
            display: 'inline-block',
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: color,
            marginRight: 8,
            verticalAlign: 'middle',
          }}
        />
        <span style={{ color, fontWeight: 600 }}>{statusText}</span>
      </div>
    </Card>
  );
};

export default LessonDetailCard;
