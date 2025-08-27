import React from 'react';

export type ChipItem = { code: string; label: string };

type Props = {
  items: ChipItem[];
  onRemove: (code: string) => void;
  emptyText?: React.ReactNode;
  className?: string;
  /** 칩 색상 변수 오버라이드용 래퍼 클래스(ex. 레슨 페이지에서 레드 칩 쓰기) */
  variantClassName?: string; // 예: "mls-lesson"
};

export default function SelectedChips({
  items,
  onRemove,
  emptyText = <span style={{ fontSize: 13, color: '#6b7280' }}>선택하면 이곳에 표시돼요</span>,
  className,
  variantClassName,
}: Props) {
  return (
    <div className={['mls-chips', className, variantClassName].filter(Boolean).join(' ')}>
      {items.length === 0
        ? emptyText
        : items.map((s) => (
            <span key={s.code} className="mls-chip">
              {s.label}
              <button aria-label="선택 해제" onClick={() => onRemove(s.code)}>
                {/* X 아이콘 대신 텍스트로도 충분; 필요하면 lucide-react X 사용 */}✕
              </button>
            </span>
          ))}
    </div>
  );
}
