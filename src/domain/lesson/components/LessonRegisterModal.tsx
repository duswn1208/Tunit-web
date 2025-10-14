import React from 'react';
import StudentRegisterForm from '../../mypage/components/StudentRegisterForm';
import Modal from '../../../components/Modal';

interface LessonRegisterModalProps {
  open: boolean;
  onClose: () => void;
  // lessonDate prop 제거
  children?: React.ReactNode;
}

const LessonRegisterModal: React.FC<LessonRegisterModalProps> = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <Modal open={open} onClose={onClose}>
      <StudentRegisterForm />
      {children}
    </Modal>
  );
};

export default LessonRegisterModal;
