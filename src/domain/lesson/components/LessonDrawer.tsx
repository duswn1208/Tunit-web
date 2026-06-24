import React from 'react';
import { format } from 'date-fns';
import { statusStyle, type LessonEvent, type LessonStatus } from '@/domain/lesson/types/lessonCalendar';
import Chip from '@/shared/components/Chip';
import Button from '@/shared/components/Button';
import '../css/lesson-drawer.css';

const ACCENT_COLORS = ['#4F59D6', '#6B4EFF', '#0075FF', '#00B386', '#FF6B35', '#F7A300', '#F04452'];

function getAvatarColor(name: string): string {
  const idx = name.charCodeAt(0) % ACCENT_COLORS.length;
  return ACCENT_COLORS[idx];
}

/** 상태 이름(REQUESTED 등) → Chip variant 매핑 */
const STATUS_TO_CHIP: Record<string, 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'expired'> = {
  REQUESTED: 'pending',
  ACTIVE: 'confirmed',
  COMPLETED: 'completed',
  CANCELED: 'cancelled',
  EXPIRED: 'expired',
};

/** 다음 상태 버튼의 variant */
const NEXT_STATUS_VARIANT: Record<string, 'default' | 'outline' | 'ghost' | 'danger'> = {
  ACTIVE: 'default',
  COMPLETED: 'outline',
  CANCELLED: 'danger',
  CANCELED: 'danger',
};

interface LessonDrawerProps {
  open: boolean;
  event: LessonEvent | null;
  onClose: () => void;
  onDelete?: (lessonId?: number) => void;
  onChangeStatus?: (lessonId: number, nextStatus: string) => void;
}

const LessonDrawer: React.FC<LessonDrawerProps> = ({
  open,
  event,
  onClose,
  onDelete,
  onChangeStatus,
}) => {
  if (!event) return null;

  const avatarColor = getAvatarColor(event.studentName);
  const statusName = event.status?.name ?? '';
  const chipVariant = STATUS_TO_CHIP[statusName] ?? 'expired';
  const statusInfo = statusStyle[statusName as LessonStatus];

  const handleChangeStatus = (next: { name: LessonStatus; label: string }) => {
    if (!event.id || !onChangeStatus) return;
    onChangeStatus(event.id as number, next.name);
  };

  const handleDelete = () => {
    if (onDelete) onDelete(event.id as number);
  };

  return (
    <>
      {/* 배경 오버레이 */}
      <div
        className={`lesson-drawer-overlay${open ? ' lesson-drawer-overlay--open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 드로어 패널 */}
      <div
        className={`lesson-drawer${open ? ' lesson-drawer--open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="레슨 상세"
      >
        {/* 헤더 */}
        <div className="lesson-drawer__header">
          <span className="lesson-drawer__title">레슨 상세</span>
          <button
            type="button"
            className="lesson-drawer__close"
            onClick={onClose}
            aria-label="닫기"
          >
            <i className="fas fa-xmark" aria-hidden="true"></i>
          </button>
        </div>

        {/* 학생 아바타 + 이름 */}
        <div className="lesson-drawer__student">
          <div
            className="lesson-drawer__avatar"
            style={{ background: avatarColor + '22', color: avatarColor }}
          >
            {event.studentName.slice(0, 2)}
          </div>
          <div className="lesson-drawer__student-info">
            <span className="lesson-drawer__student-name">{event.studentName}</span>
            <Chip variant={chipVariant} label={event.status?.label ?? statusName} />
          </div>
        </div>

        {/* 레슨 정보 */}
        <div className="lesson-drawer__info-block">
          <div className="lesson-drawer__info-row">
            <span className="lesson-drawer__info-label">카테고리</span>
            <span className="lesson-drawer__info-value">
              {typeof event.category === 'object' ? event.category.label : event.category} 레슨
            </span>
          </div>
          <div className="lesson-drawer__info-row">
            <span className="lesson-drawer__info-label">날짜</span>
            <span className="lesson-drawer__info-value">
              {event.date ? format(event.date, 'yyyy년 MM월 dd일 (EEE)', { locale: undefined }) : ''}
            </span>
          </div>
          <div className="lesson-drawer__info-row">
            <span className="lesson-drawer__info-label">시간</span>
            <span className="lesson-drawer__info-value">
              {event.start ? format(event.start, 'HH:mm') : ''} –{' '}
              {event.end ? format(event.end, 'HH:mm') : ''}
            </span>
          </div>
          {statusInfo && (
            <div className="lesson-drawer__info-row">
              <span className="lesson-drawer__info-label">상태</span>
              <span className="lesson-drawer__info-value lesson-drawer__info-value--status">
                <span
                  className="lesson-drawer__status-dot"
                  style={{ background: statusInfo.dot }}
                />
                {event.status?.label}
              </span>
            </div>
          )}
        </div>

        {/* 상태 변경 버튼 */}
        {event.status?.allowedNextStatuses && event.status.allowedNextStatuses.length > 0 && (
          <div className="lesson-drawer__status-actions">
            <span className="lesson-drawer__section-label">상태 변경</span>
            <div className="lesson-drawer__status-btn-group">
              {event.status.allowedNextStatuses.map((next) => (
                <Button
                  key={next.name}
                  variant={NEXT_STATUS_VARIANT[next.name] ?? 'outline'}
                  size="sm"
                  onClick={() => handleChangeStatus(next)}
                >
                  {next.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* 삭제 버튼 */}
        {onDelete && (
          <div className="lesson-drawer__footer">
            <Button variant="danger" size="sm" onClick={handleDelete}>
              레슨 삭제
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default LessonDrawer;
