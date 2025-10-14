import React from 'react';
import '@/shared/css/components/lesson-manage.css';
import IconButton from '@/shared/components/IconButton';
import '@/shared/css/components/ui-button.css';
import { format } from 'date-fns';
import Header from '@/shared/components/Header';

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
  // 상태 변경 핸들러: 상위에서 onChangeStatus prop으로 전달받아 처리
  const handleChangeStatus = (nextStatus: { label: string; name: string }) => {
    if (lessonId && onChangeStatus) {
      alert(`레슨 상태를 ${nextStatus.label}(으)로 변경하시겠습니까?`);
      onChangeStatus(lessonId, nextStatus.name);
    }
  };

  return (
    <div className="lesson-modal-card">
      <div className="lesson-modal-header-row">
        <Header title={category + ' 레슨'} addClass="lesson-modal-card-title" />
        <IconButton.Close onClick={onClose} className="lesson-modal-close-btn" />
      </div>
      <div>
        <b>학생 이름:</b> {studentName}
      </div>
      <div>
        <b>날짜:</b> {date ? format(date, 'yyyy년 MM월 dd일') : ''}
      </div>
      <div>
        <b>시간:</b> {start ? format(start, 'HH시 mm분') : ''} ~{' '}
        {end ? format(end, 'HH시 mm분') : ''}
      </div>
      <div className="lesson-modal-card-status-row">
        <b>상태:</b>
        <span className="lesson-modal-status-dot" />
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
      {onDelete && (
        <button type="button" className="lesson-modal-delete-btn" onClick={onDelete}>
          삭제
        </button>
      )}
    </div>
  );
};

export default LessonDetailCard;
