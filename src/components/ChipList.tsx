import React from 'react';
export type ChipItem = { code: string; label: string };

type Props<T = ChipItem> = {
  items: T[];
  onRemove: (code: string) => void;
  emptyText?: React.ReactNode;
  className?: string;
  getCode?: (item: T) => string;
  getLabel?: (item: T) => string;
};

export default function ChipList<T = ChipItem>({
  items,
  onRemove,
  emptyText,
  className,
  getCode = (i: any) => i.code,
  getLabel = (i: any) => i.label,
}: Props<T>) {
  return (
    <div className={['mls-chips', className].filter(Boolean).join(' ')}>
      {items.length === 0
        ? emptyText ?? (
            <span style={{ fontSize: 13, color: '#6b7280' }}>선택하면 이곳에 표시돼요</span>
          )
        : items.map((item) => {
            const code = getCode(item);
            const label = getLabel(item);
            return (
              <span key={code} className="mls-chip">
                {label}
                <button aria-label="선택 해제" onClick={() => onRemove(code)}>
                  ✕
                </button>
              </span>
            );
          })}
    </div>
  );
}
