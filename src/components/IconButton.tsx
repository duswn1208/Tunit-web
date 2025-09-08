import React from 'react';

interface IconButtonProps {
  icon: React.ReactNode;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  ariaLabel?: string;
}

function IconButton({ icon, onClick, className = '', style, ariaLabel }: IconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`icon-btn ${className}`}
      style={style}
      aria-label={ariaLabel}
    >
      {icon}
    </button>
  );
}

export default IconButton;

interface CloseButtonProps {
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  ariaLabel?: string;
}

IconButton.Close = function CloseButton({
  onClick,
  className = '',
  style,
  ariaLabel = '닫기',
}: CloseButtonProps) {
  return (
    <IconButton
      icon={<span style={{ fontSize: 24 }}>×</span>}
      onClick={onClick}
      className={className}
      style={style}
      ariaLabel={ariaLabel}
    />
  );
};
