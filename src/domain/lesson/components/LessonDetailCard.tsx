import React from 'react';
import '@/shared/css/components/lesson-manage.css';
import IconButton from '@/shared/components/IconButton';
import { format } from 'date-fns';
import { statusStyle, type LessonStatus } from '@/domain/lesson/types/lessonCalendar';

interface LessonDetailCardProps {
  studentName: string;
  category: string;
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
  lessonId?: number;
  onChangeStatus?: (lessonId: number, nextStatus: string) => void;
}

const LessonDetailCard: React.FC<LessonDetailCardProps> = ({
  studentName,
  category,
  date,
  start,
  end,
  status,
  color,
  statusText,
  onClose,
  onDelete,
  lessonId,
  onChangeStatus,
}) => {
  const handleChangeStatus = (nextStatus: { label: string; name: string }) => {
    if (lessonId && onChangeStatus) {
      if (window.confirm(`레슨 상태를 '${nextStatus.label}'(으)로 변경하시겠습니까?`)) {
        onChangeStatus(lessonId, nextStatus.name);
      }
    }
  };

  const dotColor = statusStyle[color as LessonStatus]?.dot ?? '#ccc';

  return (
    <div className="lesson-modal-card">
      <div className="lesson-modal-header-row">
        <span className="lesson-modal-card-title">{category} 레슨</span>
        <IconButton.Close onClick={onClose} className="lesson-modal-close-btn" />
      </div>

      <div className="lesson-modal-info">
        <div className="lesson-modal-info-row">
          <span className="lesson-modal-info-label">학생</span>
          <span className="lesson-modal-info-value">{studentName}</span>
        </div>
        <div className="lesson-modal-info-row">
          <span className="lesson-modal-info-label">날짜</span>
          <span className="lesson-modal-info-value">
            {date ? format(date, 'yyyy년 MM월 dd일') : ''}
          </span>
        </div>
        <div className="lesson-modal-info-row">
          <span className="lesson-modal-info-label">시간</span>
          <span className="lesson-modal-info-value">
            {start ? format(start, 'HH시 mm분') : ''} ~ {end ? format(end, 'HH시 mm분') : ''}
          </span>
        </div>
        <div className="lesson-modal-info-row lesson-modal-info-row--status">
          <span className="lesson-modal-info-label">상태</span>
          <div className="lesson-modal-status-row">
            <span className="lesson-modal-status-dot" style={{ backgroundColor: dotColor }} />
            <span className="lesson-modal-status-text">{statusText}</span>
            <div className="lesson-modal-btn-group">
              {status.allowedNextStatuses.map((next) => (
                <button
                  key={next.name}
                  type="button"
                  className="lesson-modal-btn"
                  onClick={() => handleChangeStatus(next)}
                >
                  {next.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {onDelete && (
        <div className="lesson-modal-footer">
          <button type="button" className="lesson-modal-delete-btn" onClick={onDelete}>
            레슨 삭제
          </button>
        </div>
      )}
    </div>
  );
};

export default LessonDetailCard;
