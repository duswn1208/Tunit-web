import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { statusStyle, type LessonEvent, type LessonStatus } from '@/domain/lesson/types/lessonCalendar';
import { categoryIcons } from '@/domain/lesson/lib/categoryIcons';
import Chip from '@/shared/components/Chip';
import { useAuth } from '@/shared/auth/AuthContext';
import { useLessonLog } from '../hooks/useLessonLog';
import { useContractDetail } from '@/domain/contract/hooks/useContractList';
import { LessonLogSection } from './LessonLogSection';
import '../css/lesson-drawer.css';

const STATUS_TO_CHIP: Record<string, 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'expired'> = {
  REQUESTED: 'pending',
  ACTIVE: 'confirmed',
  COMPLETED: 'completed',
  CANCELED: 'cancelled',
  EXPIRED: 'expired',
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
  const { user } = useAuth();
  const isTutor = user?.userRole?.tutor ?? false;
  const [logMode, setLogMode] = useState<'view' | 'write' | 'edit'>('view');

  const isCompleted = event?.status?.name === 'COMPLETED';
  const { data: log } = useLessonLog(isCompleted && event ? event.id : null);
  const { data: contract } = useContractDetail(event?.contractNo);

  useEffect(() => {
    setLogMode('view');
  }, [event?.id]);

  if (!event) return null;

  const statusName = event.status?.name ?? '';
  const chipVariant = STATUS_TO_CHIP[statusName] ?? 'expired';
  const categoryName = typeof event.category === 'object' ? event.category.name : '';
  const categoryLabel = typeof event.category === 'object' ? event.category.label : String(event.category);
  const categoryIcon = categoryIcons[categoryName]?.icon ?? '✨';

  const handleChangeStatus = (next: { name: LessonStatus; label: string }) => {
    if (!event.id || !onChangeStatus) return;
    onChangeStatus(event.id as number, next.name);
  };

  const handleDelete = () => {
    if (onDelete) onDelete(event.id as number);
  };

  const showLogFooterBtn = isCompleted && isTutor && logMode === 'view';

  const lessonProgress = contract
    ? `${contract.currentLessonCount} / ${contract.lessonCount}회`
    : null;
  const progressPct = contract
    ? Math.min(100, Math.round((contract.currentLessonCount / contract.lessonCount) * 100))
    : 0;

  return (
    <>
      <div
        className={`lesson-drawer-overlay${open ? ' lesson-drawer-overlay--open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={`lesson-drawer${open ? ' lesson-drawer--open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="레슨 상세"
      >
        {/* 헤더 */}
        <div className="lesson-drawer__header">
          <div className="lesson-drawer__header-icon">
            <span>{categoryIcon}</span>
          </div>
          <div className="lesson-drawer__header-text">
            <span className="lesson-drawer__header-title">{categoryLabel} 레슨</span>
            <span className="lesson-drawer__header-subtitle">레슨 상세</span>
          </div>
          <button
            type="button"
            className="lesson-drawer__close"
            onClick={onClose}
            aria-label="닫기"
          >
            <i className="fas fa-xmark" aria-hidden="true" />
          </button>
        </div>

        {/* 스크롤 본문 */}
        <div className="lesson-drawer__body">

          {/* 학생 + 상태 요약 */}
          <div className="lesson-drawer__summary">
            <span className="lesson-drawer__summary-student">{event.studentName}</span>
            <Chip variant={chipVariant} label={event.status?.label ?? statusName} />
          </div>

          {/* 날짜 + 시간 (한 줄) */}
          <div className="lesson-drawer__datetime">
            <i className="far fa-calendar lesson-drawer__datetime-icon" aria-hidden="true" />
            {event.date ? format(event.date, 'yyyy년 M월 d일 (EEE)', { locale: ko }) : ''}
            <span className="lesson-drawer__datetime-sep">·</span>
            {event.start ? format(event.start, 'HH:mm') : ''}–{event.end ? format(event.end, 'HH:mm') : ''}
          </div>

          {/* 계약 진행 정보 */}
          {contract && (
            <div className="lesson-drawer__contract-section">
              {/* 회차 진행 */}
              <div className="lesson-drawer__contract-progress">
                <div className="lesson-drawer__contract-progress-header">
                  <span className="lesson-drawer__contract-label">레슨 진행</span>
                  <span className="lesson-drawer__contract-count">{lessonProgress} 완료</span>
                </div>
                <div className="lesson-drawer__progress-bar">
                  <div
                    className="lesson-drawer__progress-fill"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>

              {/* 기타 계약 정보 */}
              <div className="lesson-drawer__contract-rows">
                {contract.place && (
                  <div className="lesson-drawer__contract-row">
                    <i className="fas fa-location-dot lesson-drawer__contract-icon" aria-hidden="true" />
                    <span>{contract.place}</span>
                  </div>
                )}
                {contract.emergencyContact && (
                  <div className="lesson-drawer__contract-row">
                    <i className="fas fa-phone lesson-drawer__contract-icon" aria-hidden="true" />
                    <span>{contract.emergencyContact}</span>
                  </div>
                )}
                {contract.memo && (
                  <div className="lesson-drawer__contract-row lesson-drawer__contract-row--memo">
                    <i className="fas fa-note-sticky lesson-drawer__contract-icon" aria-hidden="true" />
                    <span>{contract.memo}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 상태 변경 */}
          {event.status?.allowedNextStatuses && event.status.allowedNextStatuses.length > 0 && (
            <div className="lesson-drawer__status-actions">
              <span className="lesson-drawer__section-label">상태 변경</span>
              <div className="lesson-drawer__status-btn-group">
                {event.status.allowedNextStatuses.map((next) => {
                  const style = statusStyle[next.name as LessonStatus];
                  return (
                    <button
                      key={next.name}
                      type="button"
                      className="lesson-drawer__status-btn"
                      style={style ? { color: style.text, borderColor: style.border, background: style.bg } : undefined}
                      onClick={() => handleChangeStatus(next)}
                    >
                      {next.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 레슨 일지 (완료 상태만) */}
          {isCompleted && (
            <div className="lesson-drawer__log-section">
              <LessonLogSection
                lessonReservationNo={event.id as number}
                isTutor={isTutor}
                externalMode={logMode}
                onExternalModeChange={setLogMode}
                hideTriggerButtons={true}
              />
            </div>
          )}

        </div>

        {/* 고정 푸터 */}
        <div className="lesson-drawer__footer">
          {onDelete && (
            <button
              type="button"
              className="lesson-drawer__delete-btn"
              onClick={handleDelete}
            >
              <i className="fas fa-trash-can" aria-hidden="true" />
              삭제
            </button>
          )}
          {showLogFooterBtn && (
            <button
              type="button"
              className="lesson-drawer__log-btn"
              onClick={() => setLogMode(log ? 'edit' : 'write')}
            >
              <i className="fas fa-pencil" aria-hidden="true" />
              {log ? '일지 수정' : '일지 작성'}
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default LessonDrawer;
