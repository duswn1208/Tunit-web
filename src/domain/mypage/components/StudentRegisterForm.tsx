import SelectBox from '@/shared/components/SelectBox';
import { useState, useEffect, useRef } from 'react';
import Button from '@/shared/components/Button';
import { api } from '../../../shared/lib/api.ts';
import {
  fetchLessonCategories,
  type TutorLessonsCategory,
} from '@/domain/lesson/api/categoryApi.ts';
import { RadioGroup } from '../../../shared/components';
import type { DayOfWeekNumber } from '@/shared/constants/date.ts';
import { CONTRACT_TYPES } from '@/domain/booking/types/types.ts';
import type { ContractTypeCode } from '@/domain/contract/types/contract.ts';
import './StudentRegister.css';

interface StudentForm {
  studentName: string;
  phone: string;
  lesson: string;
  firstLessonDate: string;
  startTime: string;
  dayOfWeekSet: Set<DayOfWeekNumber>;
  reservationStatus: string;
  lessonDate: string;
  contractType: ContractTypeCode;
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
    contractType: CONTRACT_TYPES.TRIAL,
    reservationStatus: 'REQUESTED',
    memo: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async () => {
    try {
      //memo 추가
      setForm((prev) => ({ ...prev, memo: memoRef.current?.value || '' }));

      const uri =
        form.contractType === CONTRACT_TYPES.TRIAL
          ? '/api/lessons/reserve'
          : '/api/fixed-lessons/save';
      const payload =
        form.contractType === CONTRACT_TYPES.TRIAL
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
          contractType: CONTRACT_TYPES.TRIAL,
        });
      });

      if (typeof onSuccess === 'function') onSuccess();
    } catch (err) {
      alert('등록 실패: ' + (err as Error).message);
    }
  };

  return (
    <div className="student-register-form">
      <div className="student-register-form-fields">
        <div className="form-field">
          <label htmlFor="ContractType">
            레슨 유형<span className="required-mark">*</span>
          </label>
          <RadioGroup
            name="ContractType"
            defaultValue="single"
            onChange={(value: string) =>
              setForm((prev) => ({ ...prev, contractType: value as ContractTypeCode }))
            }
            options={[
              { label: '상담/체험 레슨', value: CONTRACT_TYPES.TRIAL },
              { label: '정규 레슨', value: CONTRACT_TYPES.REGULAR },
              { label: '선착순 레슨', value: CONTRACT_TYPES.FIRSTCOME },
            ]}
          />
        </div>
        <div className="form-field">
          <label htmlFor="lesson">
            레슨<span className="required-mark">*</span>
          </label>
          {loadingCategories ? (
            <div style={{ padding: '8px 0' }}>레슨명 불러오는 중...</div>
          ) : categoryError ? (
            <div style={{ color: 'red', padding: '8px 0' }}>
              레슨 불러오기 실패: {categoryError}
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
              placeholder="레슨 선택"
              className="ui-input"
            />
          )}
        </div>
        <div className="student-register-inline-fields">
          <input
            id="studentName"
            name="studentName"
            value={form.studentName}
            onChange={handleChange}
            placeholder="학생 이름"
            className="student-name-input ui-input"
          />
          <input
            id="phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="전화번호"
            className="student-phone-input ui-input"
          />
        </div>
        <div className="form-field">
          <label htmlFor="lessonDate">
            레슨일<span className="required-mark">*</span>
          </label>
          <input
            id="lessonDate"
            name="lessonDate"
            value={form.lessonDate}
            readOnly
            className="ui-input"
          />
        </div>
        {/*
        {form.contractType === CONTRACT_TYPES.REGULAR && (
          <div className="form-field">
            <label>요일<span className="required-mark">*</span></label>
            <DayChips multi={true} selected={form.dayOfWeekSet} onToggle={handleDayToggle} />
          </div>
        )}
        */}
        <div className="form-field">
          <label htmlFor="memo">메모</label>
          <textarea
            id="memo"
            name="memo"
            value={''}
            ref={memoRef}
            placeholder="해당 레슨에 대해 기억해야 할 내용이 있으면 적어주세요"
            className="ui-textarea"
          />
        </div>
        <Button onClick={handleRegister}>등록</Button>
      </div>
    </div>
  );
}
