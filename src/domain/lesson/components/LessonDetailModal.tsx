import React from 'react';
import Modal from '@/shared/components/Modal';
import LessonDetailCard from './LessonDetailCard';
import { type LessonEvent } from '../types/lessonCalendar';
import { useAuth } from '@/shared/auth/AuthContext';
import { LessonLogSection } from './LessonLogSection';

interface LessonDetailModalProps {
  open: boolean;
  event: LessonEvent | null;
  onClose: () => void;
  onDelete: (lessonId?: number) => void;
  onChangeStatus?: (lessonId: number, nextStatus: string) => void;
}

const LessonDetailModal: React.FC<LessonDetailModalProps> = ({
  open,
  event,
  onClose,
  onDelete,
  onChangeStatus,
}) => {
  const { user } = useAuth();
  const isTutor = user?.userRole?.tutor ?? false;

  if (!event) return null;
  console.log('LessonDetailModal event:', event);

  const isCompleted = event.status.name === 'COMPLETED';

  return (
    <Modal open={open} onClose={onClose} className={isCompleted ? 'lesson-log-modal-scroll' : undefined}>
      <LessonDetailCard
        studentName={event.studentName}
        category={event.category.label}
        date={event.date}
        start={event.start}
        end={event.end}
        status={event.status}
        color={event.status?.name ? event.status.name : ''}
        statusText={event.status?.label ?? ''}
        lessonId={event.id}
        onChangeStatus={onChangeStatus}
        onDelete={onDelete}
        onClose={onClose}
      />
      {isCompleted && (
        <LessonLogSection lessonReservationNo={event.id} isTutor={isTutor} />
      )}
    </Modal>
  );
};

export default LessonDetailModal;
