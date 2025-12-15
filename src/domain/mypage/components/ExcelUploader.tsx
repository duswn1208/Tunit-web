import { useState } from 'react';
import { HiUpload } from 'react-icons/hi';
import { api } from '../../../shared/lib/api.ts';
import FailedLessonTable from './FailedLessonTable';
import type { FailResult } from '../types';
import type { RefObject } from 'react';

interface ExcelUploaderProps {
  inputRef: RefObject<HTMLInputElement | null>;
}

export default function ExcelUploader({ inputRef }: ExcelUploaderProps) {
  const [failedResult, setFailedResult] = useState<FailResult | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const formData = new FormData();
    formData.append('file', file);
    let result;
    try {
      // FormData의 경우 api.post가 자동으로 Content-Type을 처리
      result = await api.post<FailResult>('/api/contract/excel/upload', formData);
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
    <div>
      <div className="flex items-center gap-3 mb-6">
        <input
          ref={inputRef}
          id="excel-upload"
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileUpload}
          className="hidden"
        />
        <label
          htmlFor="excel-upload"
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white rounded cursor-pointer text-sm hover:bg-blue-600 transition"
        >
          <HiUpload className="text-lg" />
          엑셀 파일 업로드
        </label>
        {fileName && (
          <span className="ml-2 text-xs text-gray-700 truncate max-w-xs">{fileName}</span>
        )}
      </div>
      <FailedLessonTable failList={failedResult?.failList || []} />
    </div>
  );
}
