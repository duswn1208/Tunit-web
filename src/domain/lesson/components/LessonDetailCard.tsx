import React from 'react';
import '../../../css/components/lesson-manage.css';
import IconButton from '../../../components/IconButton';
import '../../../css/components/ui-button.css';
import { format } from 'date-fns';

interface LessonDetailCardProps {
  studentName: string;
  date: Date;
  start: Date;
  end: Date;
  status: {
    label: string;
    name: string;
    allowedNextStatuses: { label: string; name: string }[];
  };
  color: string;
  statusText: string;
  onClose: () => void;
  onDelete?: () => void;
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
  onDelete,
}) => {
  // 상태 변경 핸들러 예시 (실제 API 연동 필요)
  const handleChangeStatus = (lessonId: number, nextStatus: string) => {};

  return (
    <div className="lesson-modal-card">
      <IconButton.Close onClick={onClose} className="lesson-modal-close-btn" />
      <div className="lesson-modal-card-title">{studentName}</div>
      <div>
        <b>예약 날짜:</b> {date ? format(date, 'yyyy년 MM월 dd일, ') : ''}{' '}
        {start ? format(start, 'HH시 mm분') : ''} ~ {end ? format(end, 'HH시 mm분') : ''}
      </div>
      <div className="lesson-modal-card-status-row">
        <b>상태:</b>
        <span className="lesson-modal-status-dot" style={{ background: color }} />
        <span className="lesson-modal-status-text" style={{ color }}>
          {statusText}
        </span>
        <div className="lesson-modal-btn-group">
          {status.allowedNextStatuses.map((next) => (
            <button
              key={next.name}
              type="button"
              className="lesson-modal-btn"
              onClick={() => handleChangeStatus(next.name)}
            >
              {next.label}
            </button>
          ))}
        </div>
      </div>
      {onDelete && (
        <button type="button" className="lesson-modal-delete-btn" onClick={onDelete}>
          삭제
        </button>
      )}
    </div>
  );
};

export default LessonDetailCard;
