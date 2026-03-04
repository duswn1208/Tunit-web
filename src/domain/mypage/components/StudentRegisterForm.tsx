import './StudentRegister.css';
import SelectBox from '@/shared/components/SelectBox';
import { useState, useEffect } from 'react';
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
import { CONTRACT_TYPES, getContractTypeLabel } from '@/domain/booking/types/types.ts';
import { useProfileData } from '../hooks/useProfileData';
import { fetchTutorSchedule } from '@/domain/lesson/api/scheduleApi';
import { format, addMonths } from 'date-fns';
import type { LessonCalendarStatusDto } from '@/domain/lesson/types/lessonCalendar.types';

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

function generateSlots(startTime: string, endTime: string): string[] {
  const slots: string[] = [];
  let [h, m] = startTime.slice(0, 5).split(':').map(Number);
  const [endH, endM] = endTime.slice(0, 5).split(':').map(Number);
  while (h < endH || (h === endH && m < endM)) {
    slots.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
    m += 30;
    if (m >= 60) { m = 0; h += 1; }
  }
  return slots;
}

export default function StudentRegisterForm({ onSuccess, initialDate }: { onSuccess?: () => void; initialDate?: string }) {
  const [lessonCategories, setLessonCategories] = useState<TutorLessonsCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const { profileData } = useProfileData();
  const tutorProfileNo = profileData?.tutorProfile?.tutorProfileNo;
  const [schedule, setSchedule] = useState<LessonCalendarStatusDto | null>(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [lessonDate, setLessonDate] = useState(initialDate || new Date().toISOString().slice(0, 10));

  useEffect(() => {
    if (!tutorProfileNo) return;
    const today = format(new Date(), 'yyyy-MM-dd');
    const twoMonthsLater = format(addMonths(new Date(), 2), 'yyyy-MM-dd');
    fetchTutorSchedule({ startDate: today, endDate: twoMonthsLater }, tutorProfileNo)
      .then(setSchedule)
      .catch(() => setSchedule(null));
  }, [tutorProfileNo]);

  useEffect(() => {
    if (!schedule || !lessonDate) {
      setAvailableTimeSlots([]);
      return;
    }
    const [y, mo, d] = lessonDate.split('-').map(Number);
    const jsDay = new Date(y, mo - 1, d).getDay();
    const dayOfWeekNum = jsDay === 0 ? 7 : jsDay;
    const available = schedule.availableTimes?.find((v) => v.dayOfWeekNum === dayOfWeekNum);
    if (!available) { setAvailableTimeSlots([]); return; }

    const reservedSlots = [
      ...(schedule.fixedLessonReservations ?? [])
        .filter((r) => r.dayOfWeekNum === dayOfWeekNum)
        .flatMap((r) => generateSlots(r.startTime, r.endTime)),
      ...(schedule.lessonReservations ?? [])
        .filter((r) => r.date === lessonDate)
        .flatMap((r) => generateSlots(r.startTime, r.endTime)),
    ];
    const allSlots = generateSlots(available.startTime, available.endTime);
    setAvailableTimeSlots(allSlots.filter((t) => !reservedSlots.includes(t)));
  }, [schedule, lessonDate]);

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
    lessonDate: initialDate || getToday(),
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
      const payload = {
        studentName: form.studentName,
        phone: form.phone,
        lesson: form.lesson,
        lessonDate: form.lessonDate,
        startTime: form.startTime,
        reservationStatus: form.reservationStatus,
        memo: form.memo,
      };

      await api.post('/api/lessons/tutor/create', payload);
      alert('레슨이 등록되었습니다.');
      setForm({
        studentName: '',
        phone: '',
        lesson: '',
        firstLessonDate: '',
        startTime: '',
        dayOfWeekSet: new Set<DayOfWeekNumber>(),
        reservationStatus: LessonStatus.REQUESTED,
        lessonDate: lessonDate,
        lessonType: LessonType.SINGLE,
        memo: '',
      });

      if (typeof onSuccess === 'function') onSuccess();
    } catch (err) {
      alert('등록 실패: ' + (err as Error).message);
    }
  };

  return (
    <div className="student-register-form">
      <div className="student-register-fields">
        <FormField label="계약 형태" htmlFor="lessonType" required>
          <RadioGroup
            name="lessonType"
            defaultValue="single"
            onChange={(value: string) =>
              setForm((prev) => ({ ...prev, lessonType: value as LessonType }))
            }
            options={Object.values(CONTRACT_TYPES).map((type) => ({
              label: getContractTypeLabel(type),
              value: type,
            }))}
          />
        </FormField>
        <FormField label="레슨 유형" htmlFor="lesson" required>
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
            type="date"
            value={lessonDate}
            min={format(new Date(), 'yyyy-MM-dd')}
            onChange={(e) => {
              setLessonDate(e.target.value);
              setForm((prev) => ({ ...prev, lessonDate: e.target.value, startTime: '' }));
            }}
            className="ui-input"
          />
        </FormField>

        {lessonDate && (
          <FormField label="시작 시간" required>
            {availableTimeSlots.length > 0 ? (
              <div className="time-chips">
                {availableTimeSlots.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, startTime: t }))}
                    className={`time-chip${form.startTime === t ? ' time-chip--selected' : ''}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            ) : (
              <span className="time-chips-empty">해당 날짜에 가능한 시간이 없습니다</span>
            )}
          </FormField>
        )}

        {form.lessonType === 'fixed' && (
          <FormField label="요일" required>
            <DayChips multi={true} selected={form.dayOfWeekSet} onToggle={handleDayToggle} />
          </FormField>
        )}

        <FormField label="메모" htmlFor="memo">
          <textarea
            id="memo"
            name="memo"
            value={form.memo}
            onChange={(e) => setForm((prev) => ({ ...prev, memo: e.target.value }))}
            placeholder="해당 레슨에 대해 기억해야 할 내용이 있으면 적어주세요"
            className="ui-textarea"
          />
        </FormField>

        <Button onClick={handleRegister}>등록</Button>
      </div>
    </div>
  );
}
