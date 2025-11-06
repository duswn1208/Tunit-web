import SelectBox from '@/shared/components/SelectBox';
import { useState, useEffect, useRef } from 'react';
import FormField from '@/shared/components/FormField';
import Button from '@/shared/components/Button';
import DayChips from '@/domain/dayTime/components/DayChips';
import { api } from '../../../shared/lib/api.ts';
import {
  fetchLessonCategories,
  type TutorLessonsCategory,
} from '@/domain/lesson/api/categoryApi.ts';
import { RadioGroup } from '../../../shared/components';
import { LessonStatus, LessonType } from '@/domain/lesson/types/lesson';
import type { DayOfWeekNumber } from '@/shared/constants/date.ts';

interface StudentForm {
  studentName: string;
  phone: string;
  lesson: string;
  firstLessonDate: string;
  startTime: string;
  dayOfWeekSet: Set<DayOfWeekNumber>;
  reservationStatus: LessonStatus;
  lessonDate: string;
  lessonType: LessonType;
  memo?: string;
}

// Props 타입 중복 제거
export default function StudentRegisterForm({ onSuccess }: { onSuccess?: () => void }) {
  const [lessonCategories, setLessonCategories] = useState<TutorLessonsCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const memoRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setLoadingCategories(true);
    fetchLessonCategories()
      .then((data) => {
        setLessonCategories(data);
        setCategoryError(null);
      })
      .catch((err) => {
        setCategoryError(err.message);
        setLessonCategories([]);
      })
      .finally(() => setLoadingCategories(false));
  }, []);
  const getToday = () => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  };
  const [form, setForm] = useState<StudentForm>({
    studentName: '',
    phone: '',
    lesson: '',
    firstLessonDate: '',
    startTime: '',
    dayOfWeekSet: new Set<DayOfWeekNumber>(),
    lessonDate: getToday(),
    lessonType: LessonType.SINGLE,
    reservationStatus: LessonStatus.REQUESTED,
    memo: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDayToggle = (d: DayOfWeekNumber) => {
    setForm((prev) => {
      const next = new Set(prev.dayOfWeekSet);
      if (next.has(d)) next.delete(d);
      else next.add(d);
      return { ...prev, dayOfWeekSet: next };
    });
  };

  const handleRegister = async () => {
    try {
      //memo 추가
      setForm((prev) => ({ ...prev, memo: memoRef.current?.value || '' }));

      const uri =
        form.lessonType === LessonType.SINGLE ? '/api/lessons/reserve' : '/api/fixed-lessons/save';
      const payload =
        form.lessonType === LessonType.SINGLE
          ? { ...form }
          : {
              ...form,
              firstLessonDate: form.lessonDate,
              dayOfWeekSet: Array.from(form.dayOfWeekSet),
            };

      await api.post(uri, payload).then((res) => {
        alert(res);
        setForm({
          studentName: '',
          phone: '',
          lesson: '',
          firstLessonDate: '',
          startTime: '',
          dayOfWeekSet: new Set<DayOfWeekNumber>(),
          reservationStatus: 'REQUESTED',
          lessonDate: '',
          lessonType: 'single',
        });
      });

      if (typeof onSuccess === 'function') onSuccess();
    } catch (err) {
      alert('등록 실패: ' + (err as Error).message);
    }
  };

  return (
    <div className="student-register-form">
      <div className="student-register-fields">
        <FormField label="레슨 유형" htmlFor="lessonType" required>
          <RadioGroup
            name="lessonType"
            defaultValue="single"
            onChange={(value: string) =>
              setForm((prev) => ({ ...prev, lessonType: value as LessonType }))
            }
            options={[
              { label: '일회성 레슨', value: LessonType.SINGLE },
              { label: '고정 레슨', value: LessonType.FIXED },
            ]}
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
              { label: '상담/체험레슨 신청', value: 'REQUESTED' },
            ]}
          />
        </FormField>
        <FormField label="레슨명" htmlFor="lesson" required>
          {loadingCategories ? (
            <div style={{ padding: '8px 0' }}>레슨명 불러오는 중...</div>
          ) : categoryError ? (
            <div style={{ color: 'red', padding: '8px 0' }}>
              레슨명 불러오기 실패: {categoryError}
            </div>
          ) : (
            <SelectBox
              id="lesson"
              name="lesson"
              value={form.lesson}
              options={lessonCategories.map((cat) => ({
                value: cat.lessonCategory.code,
                label: cat.lessonCategory.label,
              }))}
              onChange={(value) => setForm((prev) => ({ ...prev, lesson: value }))}
              placeholder="레슨명 선택"
              className="ui-input"
            />
          )}
        </FormField>
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
        <FormField label="레슨일" htmlFor="lessonDate" required>
          <input
            id="lessonDate"
            name="lessonDate"
            value={form.lessonDate}
            readOnly
            className="ui-input"
          />
        </FormField>

        {form.lessonType === 'fixed' && (
          <FormField label="요일" required>
            <DayChips multi={true} selected={form.dayOfWeekSet} onToggle={handleDayToggle} />
          </FormField>
        )}

        <FormField label="메모" htmlFor="memo">
          <textarea
            id="memo"
            name="memo"
            value={''}
            ref={memoRef}
            placeholder="해당 레슨에 대해 기억해야 할 내용이 있으면 적어주세요"
            className="ui-textarea"
          />
        </FormField>

        <Button onClick={handleRegister}>등록</Button>
      </div>
    </div>
  );
}
