import clsx from 'clsx';
import React from 'react';

type Props = {
  children: React.ReactNode;
  type?: 'button' | 'submit';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export default function Button({
  children,
  type = 'button',
  disabled,
  loading,
  className,
  onClick,
}: Props) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={clsx('ui-btn', className)}
      onClick={onClick}
      aria-busy={loading || undefined}
    >
      {loading ? '처리 중…' : children}
    </button>
  );
}
