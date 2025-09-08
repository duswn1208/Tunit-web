import { useState } from 'react';
import FormField from '../../../components/FormField';
import Button from '../../../components/Button';
import DayChips from '../../onboarding/availability/components/DayChips';
import type { DayOfWeek } from '../../onboarding/availability/types/availability';
import { api } from '../../../lib/api';
import { RadioGroup } from '../../../components';
import type { LessonStatus } from '../../lesson/types/lessonCalendar';

interface StudentForm {
  studentName: string;
  phone: string;
  lesson: string;
  firstLessonDate: string;
  startTime: string;
  dayOfWeekSet: Set<DayOfWeek>;
  reservationStatus: LessonStatus;
  lessonDate: string;
  lessonType: 'single' | 'fixed';
}

// Props 타입 중복 제거
export default function StudentRegisterForm({ onSuccess }: { onSuccess?: () => void }) {
  const [form, setForm] = useState<StudentForm>({
    studentName: '',
    phone: '',
    lesson: '',
    firstLessonDate: '',
    startTime: '',
    dayOfWeekSet: new Set<DayOfWeek>(),
    reservationStatus: 'TRIAL_REQUESTED',
    lessonDate: '',
    lessonType: 'single',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDayToggle = (d: DayOfWeek) => {
    setForm((prev) => {
      const next = new Set(prev.dayOfWeekSet);
      if (next.has(d)) next.delete(d);
      else next.add(d);
      return { ...prev, dayOfWeekSet: next };
    });
  };

  const handleRegister = async () => {
    const payload = {};
    try {
      const uri = form.lessonType === 'single' ? '/api/lessons/reserve' : '/api/fixed-lessons/save';
      if (form.lessonType === 'single') {
        await api(uri, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...form,
          }),
        });
      } else {
        await api(uri, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...form,
            dayOfWeekSet: Array.from(form.dayOfWeekSet),
          }),
        });
      }

      alert('레슨 등록 성공!');
      setForm({
        studentName: '',
        phone: '',
        lesson: '',
        firstLessonDate: '',
        startTime: '',
        dayOfWeekSet: new Set<DayOfWeek>(),
        reservationStatus: 'TRIAL_REQUESTED',
        lessonDate: '',
        lessonType: 'single',
      });
      if (typeof onSuccess === 'function') onSuccess();
    } catch (err) {
      alert('등록 실패: ' + (err as Error).message);
    }
  };

  return (
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
        <FormField label="레슨 유형" htmlFor="lessonType" required>
          <label style={{ marginRight: 16 }}>
            <input
              type="radio"
              name="lessonType"
              value="single"
              checked={form.lessonType === 'single'}
              onChange={handleChange}
              style={{ marginRight: 4 }}
            />
            일회성 레슨
          </label>
          <label>
            <input
              type="radio"
              name="lessonType"
              value="fixed"
              checked={form.lessonType === 'fixed'}
              onChange={handleChange}
              style={{ marginRight: 4 }}
            />
            고정 레슨
          </label>
        </FormField>
        {/* 공통 입력 */}
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
            id="lesson"
            name="lesson"
            value={form.lesson}
            onChange={handleChange}
            placeholder="레슨명"
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
        {/* 일회성 레슨 입력 */}
        {form.lessonType === 'single' && (
          <>
            <FormField label="레슨일" htmlFor="lessonDate" required>
              <input
                id="lessonDate"
                name="lessonDate"
                value={form.lessonDate}
                onChange={handleChange}
                type="date"
                className="ui-input"
              />
            </FormField>
            <FormField label="레슨 유형" htmlFor="reservationStatus" required>
              <RadioGroup
                name="reservationStatus"
                defaultValue={form.reservationStatus}
                onChange={(value: string) =>
                  setForm((prev) => ({ ...prev, reservationStatus: value as LessonStatus }))
                }
                options={[
                  { label: '레슨 신청', value: 'REQUESTED' },
                  { label: '상담/체험레슨 신청', value: 'TRIAL_REQUESTED' },
                ]}
              />
            </FormField>
          </>
        )}
        {/* 고정 레슨 입력 */}
        {form.lessonType === 'fixed' && (
          <>
            <FormField label="첫 시작 날짜" htmlFor="startDate" required>
              <input
                id="firstLessonDate"
                name="firstLessonDate"
                value={form.firstLessonDate}
                onChange={handleChange}
                type="date"
                className="ui-input"
              />
            </FormField>
            <FormField label="요일" required>
              <DayChips multi={true} selected={form.dayOfWeekSet} onToggle={handleDayToggle} />
            </FormField>
          </>
        )}
        <Button onClick={handleRegister}>등록</Button>
      </div>
    </div>
  );
}
