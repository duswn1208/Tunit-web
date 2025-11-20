import React from 'react';
import './css/alert.css';
import Button from './Button';

interface AlertProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  // 기본 모드: confirmText만 있으면 확인 버튼만, confirmText + cancelText 있으면 두 버튼
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  // 커스텀 버튼 모드
  customButtons?: Array<{
    text: string;
    onClick: () => void;
    className?: string;
  }>;
}

const Alert: React.FC<AlertProps> = ({
  open,
  onClose,
  title,
  message,
  confirmText = '확인',
  cancelText,
  onConfirm,
  onCancel,
  customButtons,
}) => {
  if (!open) return null;

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onClose();
  };

  const handleCustomButtonClick = (onClick: () => void) => {
    onClick();
    onClose();
  };

  return (
    <div className="alert-overlay" onClick={onClose}>
      <div className="alert-content" onClick={(e) => e.stopPropagation()}>
        {title && <h3 className="alert-title">{title}</h3>}
        <p className="alert-message">{message}</p>
        <div className="alert-buttons">
          {customButtons ? (
            // 커스텀 버튼 모드
            customButtons.map((button, index) => (
              <Button
                key={index}
                onClick={() => handleCustomButtonClick(button.onClick)}
                className={button.className || 'ui-btn--primary'}
              >
                {button.text}
              </Button>
            ))
          ) : (
            // 기본 모드
            <>
              {cancelText && (
                <Button onClick={handleCancel} className="ui-btn--outline">
                  {cancelText}
                </Button>
              )}
              <Button onClick={handleConfirm} className="ui-btn--primary">
                {confirmText}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Alert;
