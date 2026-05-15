import React from 'react';
import { createPortal } from 'react-dom';
import '@/shared/css/components/modal.css';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, children, className }) => {
  if (!open) return null;
  // 카드 등 부모에 transform/filter가 걸려있어도 viewport 기준으로 뜨도록 body에 포털 렌더
  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`modal-content${className ? ` ${className}` : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
