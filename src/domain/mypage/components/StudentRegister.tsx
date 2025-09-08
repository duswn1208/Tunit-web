import { useState } from 'react';
import Header from '../../../components/Header';
import ExcelUploader from './ExcelUploader';
import StudentRegisterButtonGroup from './StudentRegisterButtonGroup';
import StudentRegisterForm from './StudentRegisterForm';

export default function StudentRegister() {
  const [mode, setMode] = useState<'excel' | 'manual'>('excel');

  return (
    <div style={{ marginTop: 24, padding: 24, background: '#f8f8f8', borderRadius: 8 }}>
      <Header title="학생등록" />
      <StudentRegisterButtonGroup mode={mode} onChange={setMode} />
      {mode === 'excel' && <ExcelUploader />}
      {mode === 'manual' && <StudentRegisterForm />}
    </div>
  );
}
