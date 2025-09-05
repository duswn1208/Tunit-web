import { type LessonEvent, statusStyle } from '../domain/lesson/types/lessonCalendar';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale/ko';

interface Props {
  open: boolean;
  date: Date | null;
  items: LessonEvent[];
  onClose: () => void;
}

export function DayEventsModal({ open, date, items, onClose }: Props) {
  if (!open) return null;
  return (
    <div className="rbc-modal-mask" onClick={onClose}>
      <div className="rbc-modal" onClick={(e) => e.stopPropagation()}>
        <div className="rbc-modal-header">
          <div className="rbc-modal-title">
            {date && format(date, 'yyyy.MM.dd (EEE)', { locale: ko })}
          </div>
          <button className="rbc-btn" onClick={onClose}>
            닫기
          </button>
        </div>
        <div className="rbc-modal-body">
          {items.map((ev) => {
            const s = statusStyle[ev.status];
            return (
              <div key={ev.id} className="rbc-modal-row" style={{ borderColor: s.border }}>
                <div className="rbc-modal-row-main" style={{ color: s.text }}>
                  <span className="rbc-dot" style={{ background: s.dot }} />
                  <div className="rbc-modal-row-text">
                    <strong>
                      {format(ev.start, 'HH:mm')}–{format(ev.end, 'HH:mm')}
                    </strong>
                    <span> · {ev.title}</span>
                  </div>
                </div>
                <div className="rbc-modal-row-actions">
                  <button className="rbc-btn">변경</button>
                  <button className="rbc-btn">취소</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
