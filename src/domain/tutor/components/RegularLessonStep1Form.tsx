import './css/RegularLessonForm.css';
import { useState } from 'react';
import Header from '@/shared/components/Header';
import RadioGroup from '@/shared/components/RadioGroup';
import SelectBox from '@/shared/components/SelectBox';
import OnboardingLayout from '@/domain/onboarding/components/OnboardingLayout';
import OnboardingNextButton from '@/domain/onboarding/components/OnboardingNextButton';

const LESSON_FREQ_OPTIONS = Array.from({ length: 7 }, (_, i) => ({
  label: `주 ${i + 1}회`,
  value: String(i + 1),
}));
const LESSON_TYPE_OPTIONS = [
  { label: '정기레슨', value: 'REGULAR' },
  { label: '선착순 신청', value: 'FIRSTCOME' },
];
const LESSON_WEEKS = 4; // 한달 기준

export interface RegularLessonStep1FormProps {
  defaultPlace?: string;
  pricePerHour: number;
  lessonCategoryOptions: { label: string; value: string }[];
  onNext: (data: {
    lessonPackage: string;
    place: string;
    price: number;
    lessonCategory: string;
    lessonType: string;
  }) => void;
}

export default function RegularLessonStep1Form(props: RegularLessonStep1FormProps) {
  const { defaultPlace = '', pricePerHour, lessonCategoryOptions, onNext } = props;
  const [lessonFreq, setLessonFreq] = useState('1');
  const [place, setPlace] = useState(defaultPlace);
  const [lessonCategory, setLessonCategory] = useState('');
  const [lessonType, setLessonType] = useState('REGULAR');

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
        <Header
          title="레슨 유형"
          subtitle={
            lessonType === 'REGULAR'
              ? '정기레슨은 매주 같은 요일과 시간에 자동으로 예약됩니다. 추후에도 언제든 스케줄 변경이 가능합니다.'
              : lessonType === 'FIRSTCOME'
              ? '선착순 신청은 원하는 날짜와 시간에 직접 예약할 수 있어, 매번 유동적으로 스케줄을 정할 수 있습니다.'
              : undefined
          }
          addClass="mb-2"
        />
        <RadioGroup
          name="lessonType"
          options={LESSON_TYPE_OPTIONS}
          defaultValue={lessonType}
          onChange={setLessonType}
        />
      </div>
      <div>
        <Header title="레슨 카테고리" addClass="mb-2" />
        <SelectBox
          name="lessonCategory"
          value={lessonCategory}
          options={lessonCategoryOptions}
          onChange={setLessonCategory}
          placeholder="카테고리 선택"
        />
      </div>
      <div>
        <Header title="레슨 횟수" addClass="mb-2" />
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
        <Header title="레슨 희망 장소" addClass="mb-2" />
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
