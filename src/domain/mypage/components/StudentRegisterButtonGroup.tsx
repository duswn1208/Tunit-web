import React from 'react';

interface Props {
  mode: 'excel' | 'manual';
  onChange: (mode: 'excel' | 'manual') => void;
}

export default function StudentRegisterButtonGroup({ mode, onChange }: Props) {
  return (
    <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
      <button
        type="button"
        style={{
          padding: '8px 16px',
          background: mode === 'excel' ? '#1976d2' : '#eee',
          color: mode === 'excel' ? '#fff' : '#333',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer',
          fontWeight: 500,
        }}
        onClick={() => onChange('excel')}
      >
        엑셀 업로드
      </button>
      <button
        type="button"
        style={{
          padding: '8px 16px',
          background: mode === 'manual' ? '#1976d2' : '#eee',
          color: mode === 'manual' ? '#fff' : '#333',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer',
          fontWeight: 500,
        }}
        onClick={() => onChange('manual')}
      >
        직접 입력
      </button>
    </div>
  );
}
