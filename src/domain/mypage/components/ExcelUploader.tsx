import { useState } from 'react';
import { HiUpload, HiDocumentText } from 'react-icons/hi';
import { api } from '../../../shared/lib/api.ts';
import { useToast } from '@/shared/contexts/ToastContext';
import FailedLessonTable from './FailedLessonTable';
import type { FailResult } from '../types';

export default function ExcelUploader() {
  const { showToast } = useToast();
  const [failedResult, setFailedResult] = useState<FailResult | null>(null);
  const [fileName, setFileName] = useState<string>('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const result = await api.post<FailResult>('/api/contract/excel/upload', formData);
      setFailedResult(result);
      if (result.failCount === 0) {
        showToast('업로드 성공! 모든 회원이 정상 등록되었습니다.', 'success');
      }
    } catch (err) {
      showToast('업로드 실패: ' + (err as Error).message, 'error');
    }
  };

  return (
    <div className="excel-uploader-wrapper">
      <input
        id="excel-upload"
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />
      <label htmlFor="excel-upload" className="excel-dropzone">
        <div className="excel-dropzone-icon">
          <HiUpload />
        </div>
        <span className="excel-dropzone-text">엑셀 파일을 클릭하여 업로드하세요</span>
        <span className="excel-dropzone-hint">.xlsx, .xls 형식 지원</span>
      </label>

      {fileName && (
        <div className="excel-file-badge">
          <HiDocumentText />
          {fileName}
        </div>
      )}

      <FailedLessonTable failList={failedResult?.failList || []} />
    </div>
  );
}
