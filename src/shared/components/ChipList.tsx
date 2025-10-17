import React from 'react';
import Chip, { type ChipStyle } from './Chip.tsx';

export type ChipItem = {
  code: string;
  label: string;
  style?: ChipStyle;
};

type Props<T = ChipItem> = {
  items: T[];
  onRemove?: (code: string) => void;
  emptyText?: React.ReactNode;
  className?: string;
  getCode?: (item: T) => string;
  getLabel?: (item: T) => string;
  getStyle?: (item: T) => ChipStyle;
  defaultStyle?: ChipStyle;
};

export default function ChipList<T = ChipItem>({
  items,
  onRemove,
  emptyText,
  className,
  getCode = (i: any) => i.code,
  getLabel = (i: any) => i.label,
  getStyle = (i: any) => i.style,
  defaultStyle,
}: Props<T>) {
  return (
    <div className={['mls-chips', className].filter(Boolean).join(' ')}>
      {items.length === 0
        ? emptyText
        : items.map((item) => {
            const code = getCode(item);
            const label = getLabel(item);
            const style = getStyle(item);
            return (
              <Chip
                key={code}
                label={label}
                {...defaultStyle}
                {...style}
                onRemove={onRemove ? () => onRemove(code) : undefined}
              />
            );
          })}
    </div>
  );
}
