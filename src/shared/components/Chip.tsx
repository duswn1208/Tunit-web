import React from 'react';
import clsx from 'clsx';
import './css/chip.css';

export type ChipVariant = 'default' | 'blue' | 'green' | 'yellow' | 'red' | 'gray';
export type ChipSize = 'sm' | 'md';

export interface ChipStyle {
  /**
   * 칩의 배경색과 텍스트 색상을 결정하는 variant
   * @default 'default'
   */
  variant?: ChipVariant;
  /**
   * 칩의 크기
   * @default 'md'
   */
  size?: ChipSize;
  /**
   * 선택 상태일 때 보여줄 색상. variant 색상을 따라감
   * @default false
   */
  selected?: boolean;
  /**
   * 커스텀 테두리 색상. selected가 true일 때만 적용
   */
  borderColor?: string;
  /**
   * 추가 스타일
   */
  style?: React.CSSProperties;
  /**
   * 추가 클래스
   */
  className?: string;
}

interface Props extends Omit<ChipStyle, 'style' | 'className'> {
  label: React.ReactNode;
  onRemove?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Chip 컴포넌트
 * @example
 * // 기본 칩
 * <Chip label="기본" />
 *
 * // 파란색 칩
 * <Chip label="주요" variant="blue" />
 *
 * // 삭제 버튼이 있는 칩
 * <Chip label="삭제 가능" onRemove={() => console.log('삭제')} />
 */
export default function Chip({
  label,
  variant = 'default',
  size = 'md',
  selected,
  onRemove,
  className,
  style,
}: Props) {
  return (
    <span
      className={clsx(
        'mls-chip',
        {
          selected,
          [`mls-chip-${variant}`]: variant !== 'default',
          [`mls-chip-${size}`]: true,
        },
        className
      )}
      style={style}
    >
      {label}
      {onRemove && (
        <button type="button" className="mls-chip-remove" onClick={onRemove} aria-label="선택 해제">
          ✕
        </button>
      )}
    </span>
  );
}
