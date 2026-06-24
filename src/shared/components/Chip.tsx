import React from 'react';
import clsx from 'clsx';
import './css/chip.css';

export type ChipVariant =
  | 'default'
  | 'blue'
  | 'green'
  | 'yellow'
  | 'red'
  | 'gray'
  | 'purple'
  | 'pending'
  | 'confirmed'
  | 'completed'
  | 'cancelled'
  | 'expired'
  | 'trial'
  | 'firstcome'
  | 'recurring';

export type ChipSize = 'sm' | 'md' | 'lg';

export interface ChipStyle {
  variant?: ChipVariant;
  size?: ChipSize;
  selected?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

interface Props extends Omit<ChipStyle, 'style' | 'className'> {
  label: React.ReactNode;
  onRemove?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const LESSON_VARIANTS = new Set([
  'pending', 'confirmed', 'completed', 'cancelled', 'expired', 'trial', 'firstcome', 'recurring',
]);

export default function Chip({
  label,
  variant = 'default',
  size = 'md',
  selected,
  onRemove,
  className,
  style,
}: Props) {
  const isLessonVariant = LESSON_VARIANTS.has(variant);

  return (
    <span
      className={clsx(
        isLessonVariant
          ? ['lesson-chip', `lesson-chip--${variant}`]
          : [
              'mls-chip',
              variant !== 'default' && `mls-chip-${variant}`,
              `mls-chip-${size}`,
              selected && 'selected',
            ],
        className,
      )}
      style={style}
    >
      {label}
      {onRemove && (
        <button
          type="button"
          className="mls-chip-remove"
          onClick={onRemove}
          aria-label="선택 해제"
        >
          ✕
        </button>
      )}
    </span>
  );
}
