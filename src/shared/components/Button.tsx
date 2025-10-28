import clsx from 'clsx';
import React from 'react';

type Props = {
  children: React.ReactNode;
  type?: 'button' | 'submit';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  size?: 'sm';
  title?: string;
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
}: Props) {
  return (
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
  );
}
