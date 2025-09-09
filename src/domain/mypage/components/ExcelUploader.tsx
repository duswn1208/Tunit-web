import { useState } from 'react';
import { api } from '../../../lib/api';
import FailedLessonTable from './FailedLessonTable';
import type { FailResult } from '../types';
import type { RefObject } from 'react';

interface ExcelUploaderProps {
  inputRef: RefObject<HTMLInputElement | null>;
}

export default function ExcelUploader({ inputRef }: ExcelUploaderProps) {
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
  // ButtonGroup에서 호출할 수 있도록 트리거 함수 제공
  // onExcelButtonClick은 StudentRegister에서 처리

  return (
    <div style={{ marginTop: 24, padding: 24, background: '#f8f8f8', borderRadius: 8 }}>
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <input
          ref={inputRef}
          id="excel-upload"
          type="file"
          accept=".xlsx,.xls"
          style={{ display: 'none' }}
          onChange={handleFileUpload}
        />
      </div>
      <FailedLessonTable failList={failedResult?.failList || []} />
    </div>
  );
}
