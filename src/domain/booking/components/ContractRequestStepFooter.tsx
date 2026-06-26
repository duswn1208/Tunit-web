interface ContractRequestStepFooterProps {
  onPrev?: () => void;
  onNext: () => void;
  nextLabel: string;
  nextDisabled?: boolean;
  prevLabel?: string;
  nextType?: 'button' | 'submit';
  nextFlex?: number;
}

export default function ContractRequestStepFooter({
  onPrev,
  onNext,
  nextLabel,
  nextDisabled = false,
  prevLabel = '이전',
  nextType = 'button',
  nextFlex = 1,
}: ContractRequestStepFooterProps) {
  return (
    <div style={{ display: 'flex', gap: 8, marginTop: 32 }}>
      {onPrev && (
        <button
          type="button"
          onClick={onPrev}
          style={{
            flex: 1,
            padding: '12px 0',
            borderRadius: 8,
            border: '1px solid #ddd',
            background: '#fff',
            color: '#333',
            fontWeight: 500,
          }}
        >
          {prevLabel}
        </button>
      )}
      <button
        type={nextType}
        onClick={onNext}
        disabled={nextDisabled}
        style={{
          flex: nextFlex,
          padding: '12px 0',
          borderRadius: 8,
          border: 'none',
          background: nextDisabled ? '#eee' : 'var(--color-primary)',
          color: nextDisabled ? '#aaa' : '#fff',
          fontWeight: 600,
        }}
      >
        {nextLabel}
      </button>
    </div>
  );
}
