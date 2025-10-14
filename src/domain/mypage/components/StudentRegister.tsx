import { useState } from 'react';
import Header from '@/shared/components/Header';
import ExcelUploader from './ExcelUploader';
import { useRef } from 'react';
import StudentRegisterButtonGroup from './StudentRegisterButtonGroup';
import StudentRegisterForm from './StudentRegisterForm';

export default function StudentRegister() {
  const [mode, setMode] = useState<'excel' | 'manual'>('excel');
  const excelInputRef = useRef<HTMLInputElement>(null);

  // 엑셀 업로드 버튼 클릭 시 input 트리거
  const handleExcelButtonClick = () => {
    excelInputRef.current?.click();
  };

  return (
    <div style={{ marginTop: 24, padding: 24, background: '#f8f8f8', borderRadius: 8 }}>
      <Header title="학생등록" />
      <StudentRegisterButtonGroup
        mode={mode}
        onChange={setMode}
        onExcelClick={handleExcelButtonClick}
      />
      {mode === 'excel' && <ExcelUploader inputRef={excelInputRef} />}
      {mode === 'manual' && <StudentRegisterForm />}
    </div>
  );
}
