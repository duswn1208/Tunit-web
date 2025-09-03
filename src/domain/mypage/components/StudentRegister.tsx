import { useState } from 'react';
import FormField from '../../../components/FormField';
import Button from '../../../components/Button';
import DayChips from '../../onboarding/availability/components/DayChips';
import type { DayOfWeek } from '../../onboarding/availability/types/availability';
import { api } from '../../../lib/api';
import FailedLessonTable from './FailedLessonTable';
import type { FailResult } from '../types';

export default function StudentRegister() {
  const [failedResult, setFailedResult] = useState<FailResult | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    studentName: '',
    phone: '',
    lessonName: '',
    startDate: '',
    startTime: '',
    dayOfWeek: new Set<DayOfWeek>(),
  });

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

  const handleDirectInput = () => {
    setShowForm((prev) => !prev);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDayToggle = (d: DayOfWeek) => {
    setForm((prev) => {
      const next = new Set(prev.dayOfWeek);
      if (next.has(d)) next.delete(d);
      else next.add(d);
      return { ...prev, dayOfWeek: next };
    });
  };

  const handleRegister = async () => {
    // dayOfWeek를 배열로 변환해서 전송
    const payload = {
      ...form,
      dayOfWeek: Array.from(form.dayOfWeek),
    };
    try {
      await api('/api/fixed-lessons/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      alert('레슨 등록 성공!');
      setShowForm(false);
      setForm({
        studentName: '',
        phone: '',
        lessonName: '',
        startDate: '',
        startTime: '',
        dayOfWeek: new Set<DayOfWeek>(),
      });
    } catch (err) {
      alert('등록 실패: ' + (err as Error).message);
    }
  };

  return (
    <div style={{ marginTop: 24, padding: 24, background: '#f8f8f8', borderRadius: 8 }}>
      <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 16 }}>학생등록</h3>
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <input
          id="excel-upload"
          type="file"
          accept=".xlsx,.xls"
          style={{ display: 'none' }}
          onChange={handleFileUpload}
        />
        <button
          type="button"
          onClick={() => document.getElementById('excel-upload')?.click()}
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
      {showForm && (
        <div
          style={{
            marginBottom: 24,
            padding: 16,
            background: '#fff',
            borderRadius: 8,
            boxShadow: '0 2px 8px #eee',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <FormField label="학생 이름" htmlFor="studentName" required>
              <input
                id="studentName"
                name="studentName"
                value={form.studentName}
                onChange={handleChange}
                placeholder="학생 이름"
                className="ui-input"
              />
            </FormField>
            <FormField label="전화번호" htmlFor="phone" required>
              <input
                id="phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="전화번호"
                className="ui-input"
              />
            </FormField>
            <FormField label="레슨명" htmlFor="lessonName" required>
              <input
                id="lessonName"
                name="lessonName"
                value={form.lessonName}
                onChange={handleChange}
                placeholder="레슨명"
                className="ui-input"
              />
            </FormField>
            <FormField label="첫 시작 날짜" htmlFor="startDate" required>
              <input
                id="startDate"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                type="date"
                className="ui-input"
              />
            </FormField>
            <FormField label="시작 시간" htmlFor="startTime" required>
              <input
                id="startTime"
                name="startTime"
                value={form.startTime}
                onChange={handleChange}
                type="time"
                className="ui-input"
              />
            </FormField>
            <FormField label="요일" required>
              <DayChips multi={false} selected={form.dayOfWeek} onToggle={handleDayToggle} />
            </FormField>
            <Button
              type="button"
              onClick={handleRegister}
              className="ui-btn ui-btn-success"
              style={{ fontWeight: 600, fontSize: 16 }}
            >
              등록
            </Button>
          </div>
        </div>
      )}
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
