import { useState } from 'react';
import { api } from '../lib/api';
import FailedLessonTable from '../domain/mypage/components/FailedLessonTable';
import type { FailResult } from '../domain/mypage/types';

export default function MyPage() {
  const [failedResult, setFailedResult] = useState<FailResult | null>(null);
  // 파일 업로드 핸들러
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

  return (
    <div style={{ maxWidth: 560, margin: '40px auto' }}>
      <h1>마이페이지</h1>
      <div style={{ marginTop: 24 }}>
        <label htmlFor="excel-upload" style={{ display: 'block', marginBottom: 8 }}>
          엑셀 업로드
        </label>
        <input id="excel-upload" type="file" accept=".xlsx,.xls" onChange={handleFileUpload} />
      </div>
      <FailedLessonTable failList={failedResult?.failList || []} />
    </div>
  );
}
