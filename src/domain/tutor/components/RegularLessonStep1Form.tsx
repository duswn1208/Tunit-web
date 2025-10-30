import './css/RegularLessonForm.css';
import { useState } from 'react';
import Header from '@/shared/components/Header';
// import RadioGroup from '@/shared/components/RadioGroup';
import SelectBox from '@/shared/components/SelectBox';
import OnboardingLayout from '@/domain/onboarding/components/OnboardingLayout';
import RegularLessonStepFooter from './RegularLessonStepFooter';

const LESSON_FREQ_OPTIONS = Array.from({ length: 7 }, (_, i) => ({
  label: `주 ${i + 1}회`,
  value: String(i + 1),
}));
// 레슨유형 옵션 제거 (상위에서 결정)
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
    contractType: string;
  }) => void;
  onFirst?: () => void;
}

export default function RegularLessonStep1Form(
  props: RegularLessonStep1FormProps & { contractType: string }
) {
  const { defaultPlace = '', pricePerHour, lessonCategoryOptions, onNext, contractType } = props;
  const [lessonFreq, setLessonFreq] = useState('1');
  const [place, setPlace] = useState(defaultPlace);
  const [lessonCategory, setLessonCategory] = useState('');

  const getTitle = () => {
    if (contractType === 'FIRSTCOME') return '선착순 레슨 신청';
    if (contractType === 'REGULAR') return '정기레슨 신청';
    return '레슨 신청';
  };

  const totalCount = Number(lessonFreq) * LESSON_WEEKS;
  const price = totalCount * pricePerHour;

  const handleNext = () => {
    props.onNext({
      lessonPackage: lessonFreq,
      place,
      price,
      lessonCategory,
      contractType,
    });
  };

  return (
    <OnboardingLayout
      title={getTitle()}
      step={1}
      total={6}
      bodyClassName="regular-lesson-form-layout"
    >
      <div className="regular-lesson-form-field">
        <Header title="레슨 횟수 선택" addClass="mb-2" />

        <div className="regular-lesson-form-row regular-lesson-form-row--lesson-count">
          <SelectBox
            name="lessonFreq"
            value={lessonFreq}
            options={LESSON_FREQ_OPTIONS}
            onChange={setLessonFreq}
            className="lesson-count-selectbox"
          />

          {/* <span className="regular-lesson-form-subtext lesson-count-text">
          (한 달 기준 <b>{totalCount}회</b>)
        </span> */}
        </div>
      </div>
      <div className="regular-lesson-form-field">
        <Header title="레슨 희망 장소" addClass="mb-2" />
        <input
          type="text"
          value={place}
          onChange={(e) => setPlace(e.target.value)}
          placeholder="예: 강남역 1번 출구 앞 카페"
          className="regular-lesson-form-input place-input"
          required
        />
      </div>
      <div
        className="regular-lesson-form-pricebox"
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
      >
        <span
          style={{
            fontSize: 13,
            color: 'var(--brand-mint)',
            fontWeight: 700,
            marginBottom: 2,
            letterSpacing: '-0.01em',
          }}
        >
          예상 금액
        </span>
        <span
          style={{
            fontSize: 32,
            color: '#FF4757',
            fontWeight: 900,
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            textShadow: '0 2px 8px #ffeaea',
          }}
        >
          {price.toLocaleString()}원
        </span>
        <span
          style={{
            fontSize: 14,
            color: 'var(--brand-mint)',
            fontWeight: 600,
            marginTop: 2,
            letterSpacing: '-0.01em',
          }}
        >
          (선택한 주 {lessonFreq}회, 총 {totalCount}회 기준입니다.)
        </span>
      </div>
      <div className="regular-lesson-form-footer">
        <RegularLessonStepFooter
          onPrev={props.onFirst}
          prevLabel="처음으로"
          nextType="button"
          nextLabel="다음"
          nextSize={undefined}
          onNext={handleNext}
        />
      </div>
      <span
        style={{
          fontSize: 11,
          color: '#333',
          marginTop: 2,
          fontWeight: 400,
          letterSpacing: '-0.01em',
        }}
      >
        * 최종 금액은 튜터와 스케줄 조율 후 확정됩니다. (출장비, 장소 대여료 등 변동 요인 포함)
      </span>
    </OnboardingLayout>
  );
}
