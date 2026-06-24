import clsx from 'clsx';
import React from 'react';
import './css/button-tooltip.css';

type Variant = 'default' | 'outline' | 'ghost' | 'soft' | 'danger';

type Props = {
  children: React.ReactNode;
  type?: 'button' | 'submit';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: Variant;
  full?: boolean;
  title?: string;
  tooltip?: string;
};

const VARIANT_CLASS: Record<Variant, string> = {
  default: '',
  outline: 'ui-btn--outline',
  ghost: 'ui-btn--ghost',
  soft: 'ui-btn--soft',
  danger: 'ui-btn--danger',
};

export default function Button({
  children,
  type = 'button',
  disabled,
  loading,
  className,
  onClick,
  size,
  variant = 'default',
  full,
  title,
  tooltip,
}: Props) {
  return (
    <div
      className={tooltip ? 'button-with-tooltip' : undefined}
      style={{ display: full ? 'block' : 'inline-block', position: 'relative' }}
    >
      <button
        type={type}
        disabled={disabled || loading}
        className={clsx(
          'ui-btn',
          VARIANT_CLASS[variant],
          size === 'sm' && 'ui-btn--sm',
          (size === 'lg' || full) && 'ui-btn--full',
          className,
        )}
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
