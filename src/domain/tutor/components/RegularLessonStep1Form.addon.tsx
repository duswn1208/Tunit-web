import './css/RegularLessonForm.css';
import { useState, useEffect } from 'react';
import SelectBox from '@/shared/components/SelectBox';
import OnboardingLayout from '@/domain/onboarding/components/OnboardingLayout';
import OnboardingNextButton from '@/domain/onboarding/components/OnboardingNextButton';
import RadioGroup from '@/shared/components/RadioGroup';
import { getMainLessonCategory } from '@/domain/lesson/api/categoryApi';

const LESSON_FREQ_OPTIONS = Array.from({ length: 7 }, (_, i) => ({
  label: `주 ${i + 1}회`,
  value: String(i + 1),
}));
const LESSON_WEEKS = 4;
const LESSON_TYPE_OPTIONS = [
  { label: '정기레슨', value: 'REGULAR' },
  { label: '선착순 신청', value: 'FIRSTCOME' },
];

export interface RegularLessonStep1FormProps {
  defaultPlace?: string;
  pricePerHour: number;
  onNext: (data: {
    lessonPackage: string;
    place: string;
    price: number;
    lessonCategory: string;
    lessonType: string;
  }) => void;
}

export default function RegularLessonStep1Form(props: RegularLessonStep1FormProps) {
  const { defaultPlace = '', pricePerHour, onNext } = props;
  const [lessonFreq, setLessonFreq] = useState('1');
  const [place, setPlace] = useState(defaultPlace);
  const [lessonCategory, setLessonCategory] = useState('');
  const [lessonType, setLessonType] = useState('REGULAR');
  const [categoryOptions, setCategoryOptions] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    getMainLessonCategory().then((list) => {
      setCategoryOptions(list.map((cat: any) => ({ label: cat.label, value: cat.code })));
    });
  }, []);

  const totalCount = Number(lessonFreq) * LESSON_WEEKS;
  const price = totalCount * pricePerHour;

  return (
    <OnboardingLayout
      step={1}
      total={4}
      title="정기레슨 신청"
      subtitle="기본 정보를 입력해 주세요."
      as="form"
      onSubmit={(e) => {
        e.preventDefault();
        onNext({ lessonPackage: lessonFreq, place, price, lessonCategory, lessonType });
      }}
      bodyClassName="flex flex-col"
      footer={<OnboardingNextButton type="submit" label={'다음 →'} />}
    >
      <div>
        <div className="regular-lesson-form-label">어떤 레슨 유형을 원하세요?</div>
        <RadioGroup
          name="lessonType"
          options={LESSON_TYPE_OPTIONS}
          defaultValue={lessonType}
          onChange={setLessonType}
        />
      </div>
      <div>
        <div className="regular-lesson-form-label">레슨 카테고리</div>
        <SelectBox
          name="lessonCategory"
          value={lessonCategory}
          options={categoryOptions}
          onChange={setLessonCategory}
          placeholder="카테고리 선택"
        />
      </div>
      <div>
        <div className="regular-lesson-form-label">어떤 규모의 레슨을 원하세요?</div>
        <div className="regular-lesson-form-row">
          <SelectBox
            name="lessonFreq"
            value={lessonFreq}
            options={LESSON_FREQ_OPTIONS}
            onChange={setLessonFreq}
            className="w-28"
          />
          <span className="regular-lesson-form-subtext">
            (한 달 기준 <b>{totalCount}회</b>)
          </span>
        </div>
      </div>
      <div>
        <div className="regular-lesson-form-label" style={{ fontSize: 16 }}>
          레슨 희망 장소
        </div>
        <input
          type="text"
          value={place}
          onChange={(e) => setPlace(e.target.value)}
          placeholder="예: 강남역 1번 출구 앞 카페"
          className="regular-lesson-form-input"
          required
        />
      </div>
      <div>예상 금액은 {price.toLocaleString()}원입니다.</div>
    </OnboardingLayout>
  );
}
