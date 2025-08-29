import { useRequireAuth } from '../lib/auth';
import { api } from '../lib/api';

export default function MyPage() {
  useRequireAuth({ requiredRole: 'TUTOR' });

  // 파일 업로드 핸들러
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      await api('/api/tutor/lessons/upload', {
        method: 'POST',
        body: formData,
      });
      alert('업로드 성공!');
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
    </div>
  );
}
