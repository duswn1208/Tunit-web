import React from 'react';
import StudentRegisterForm from '../../mypage/components/StudentRegisterForm';
import Modal from '@/shared/components/Modal';
import '../../mypage/components/StudentRegister.css';

interface LessonRegisterModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialDate?: string;
  children?: React.ReactNode;
}

const LessonRegisterModal: React.FC<LessonRegisterModalProps> = ({ open, onClose, onSuccess, initialDate, children }) => {
  if (!open) return null;
  return (
    <Modal open={open} onClose={onClose} className="modal-content--sm">
      <div className="lesson-register-modal-header">
        <h2 className="lesson-register-modal-title">레슨 등록</h2>
        <button className="lesson-register-modal-close" onClick={onClose} aria-label="닫기">✕</button>
      </div>
      <StudentRegisterForm onSuccess={onSuccess ?? onClose} initialDate={initialDate} />
      {children}
    </Modal>
  );
};

export default LessonRegisterModal;
