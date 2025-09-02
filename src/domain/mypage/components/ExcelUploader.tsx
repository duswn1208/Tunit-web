import { useState } from 'react';
import { api } from '../../../lib/api';
import FailedLessonTable from './FailedLessonTable';
import type { FailResult } from '../types';

export default function ExcelUploader() {
  const [failedResult, setFailedResult] = useState<FailResult | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    let result;
    try {
      result = await api<FailResult>('/api/fixed-lessons/upload/excel', {
        method: 'POST',
        body: formData,
      });
      setFailedResult(result);
      if (result.failCount === 0) {
        alert('업로드 성공! 모든 회원이 정상 등록되었습니다.');
      }
    } catch (err) {
      alert('업로드 실패: ' + (err as Error).message);
    }
  };

  // 직접입력 버튼 클릭 시 동작(예시)
  const handleDirectInput = () => {
    alert('직접입력 폼으로 이동(구현 필요)');
    // TODO: 직접입력 폼으로 라우팅 또는 모달 등 구현
  };

  return (
    <div style={{ marginTop: 24, padding: 24, background: '#f8f8f8', borderRadius: 8 }}>
      <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 16 }}>학생등록</h3>
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <label htmlFor="excel-upload" style={{ display: 'block' }}>
          <button
            type="button"
            style={{
              padding: '8px 16px',
              background: '#1976d2',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            엑셀 업로드
          </button>
        </label>
        <button
          type="button"
          onClick={handleDirectInput}
          style={{
            padding: '8px 16px',
            background: '#43a047',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            fontWeight: 500,
          }}
        >
          직접입력
        </button>
      </div>
      <input
        id="excel-upload"
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />
      <FailedLessonTable failList={failedResult?.failList || []} />
    </div>
  );
}
