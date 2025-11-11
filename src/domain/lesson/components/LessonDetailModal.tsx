import React from 'react';
import Modal from '@/shared/components/Modal';
import LessonDetailCard from './LessonDetailCard';
import { type LessonEvent } from '../types/lessonCalendar';

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
  if (!event) return null;
  console.log('LessonDetailModal event:', event);
  return (
    <Modal open={open} onClose={onClose}>
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
    </Modal>
  );
};

export default LessonDetailModal;
