import clsx from 'clsx';
import React from 'react';
import './css/button-tooltip.css';

type Props = {
  children: React.ReactNode;
  type?: 'button' | 'submit';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  size?: 'sm';
  title?: string;
  tooltip?: string;
};

export default function Button({
  children,
  type = 'button',
  disabled,
  loading,
  className,
  onClick,
  size,
  title,
  tooltip,
}: Props) {
  return (
    <div
      className={tooltip ? 'button-with-tooltip' : undefined}
      style={{ display: 'inline-block', position: 'relative' }}
    >
      <button
        type={type}
        disabled={disabled || loading}
        className={clsx('ui-btn', className, size === 'sm' && 'ui-btn--sm')}
        onClick={onClick}
        aria-busy={loading || undefined}
        title={title}
      >
        {loading ? '처리 중…' : children}
      </button>
      {tooltip && <span className="button-tooltip">{tooltip}</span>}
    </div>
  );
}
