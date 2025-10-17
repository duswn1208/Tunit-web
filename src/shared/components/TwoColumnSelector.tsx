import React from 'react';
import '@/shared/css/components/two-column-selector.css';

export interface TwoColumnSelectorProps {
  leftOptions: Array<{ code: string; label: string }>;
  rightOptionsMap: Record<string, Array<{ code: string; label: string }>>;
  leftTitle?: string;
  rightTitle?: string;
  selectedLeft: string | null;
  setSelectedLeft: (code: string) => void;
  selectedRight: string[];
  toggleRight: (code: string, label: string) => void;
  loading?: boolean;
  error?: string | null;
  minHeight?: number;
  // 바텀시트/모달용 옵션 (튜터찾기에서만 사용)
  showSheetUI?: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
  confirmText?: string;
}

const TwoColumnSelector: React.FC<TwoColumnSelectorProps> = ({
  leftOptions,
  rightOptionsMap,
  leftTitle = '',
  rightTitle = '',
  selectedLeft,
  setSelectedLeft,
  selectedRight,
  toggleRight,
  loading,
  error,
  minHeight = 320,
  showSheetUI = false,
  onClose,
  onConfirm,
  confirmText = '확인',
}) => {
  const rightOptions = selectedLeft ? rightOptionsMap[selectedLeft] || [] : [];

  const content = (
    <div className="two-col-selector-root" style={{ minHeight }}>
      <div className="two-col-cols">
        {/* 왼쪽 리스트 */}
        <div className="two-col-left">
          <div className="sheet-title">{leftTitle}</div>
          {leftOptions.map((item) => (
            <div
              key={item.code}
              className={'sheet-option' + (selectedLeft === item.code ? ' selected' : '')}
              onClick={() => setSelectedLeft(item.code)}
            >
              {item.label}
            </div>
          ))}
        </div>
        {/* 오른쪽 리스트 */}
        <div className="two-col-right">
          <div className="sheet-title">{rightTitle}</div>
          {loading && <div style={{ padding: 12, color: '#888' }}>불러오는 중…</div>}
          {error && <div style={{ padding: 12, color: 'red' }}>{error}</div>}
          {rightOptions.map((item) => (
            <div
              key={item.code}
              className={'sheet-option' + (selectedRight.includes(item.code) ? ' selected' : '')}
              onClick={() => toggleRight(item.code, item.label)}
            >
              {item.label}
            </div>
          ))}
        </div>
      </div>
      {/* 하단 확인 버튼 (바텀시트에서만) */}
      {showSheetUI && onConfirm && (
        <button className="sheet-confirm-btn" onClick={onConfirm} type="button">
          {confirmText}
        </button>
      )}
    </div>
  );

  if (showSheetUI) {
    return (
      <div className="bottom-sheet" style={{ minHeight }} onClick={onClose}>
        <div
          className="bottom-sheet-content"
          style={{ display: 'flex', minHeight, position: 'relative', flexDirection: 'column' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 닫기 버튼 */}
          {onClose && (
            <button
              className="sheet-close-btn"
              style={{ position: 'absolute', top: 12, right: 16, zIndex: 2 }}
              onClick={onClose}
              aria-label="닫기"
            >
              ×
            </button>
          )}
          {content}
        </div>
      </div>
    );
  }
  // 일반 2단 선택 UI (온보딩 등)
  return content;
};

export default TwoColumnSelector;
