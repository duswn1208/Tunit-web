import { useState } from 'react';
import OnboardingLayout from '../../onboarding/components/OnboardingLayout';
import RegularLessonStepFooter from './RegularLessonStepFooter';
import RadioGroup from '@/shared/components/RadioGroup';

export interface RegularLessonStep3FormProps {
  defaultPhone: string;
  onPrev: () => void;
  onNext: (data: { level: string; goal: string; phone: string; request: string }) => void;
}

const LEVEL_OPTIONS = [
  { label: '초급', value: '초급' },
  { label: '중급', value: '중급' },
  { label: '고급', value: '고급' },
];

export default function RegularLessonStep3Form({
  defaultPhone,
  onPrev,
  onNext,
}: RegularLessonStep3FormProps) {
  const [level, setLevel] = useState('');
  const [goal, setGoal] = useState('');
  const [phone, setPhone] = useState(defaultPhone);

  const isNextEnabled = level && goal && phone;

  return (
    <OnboardingLayout title="[STEP 3/4] 레슨 목표 및 요청 사항 (튜터 전달)">
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontWeight: 500, marginBottom: 8 }}>
          튜터에게 전달하고 싶은 내용이 있나요?
        </div>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontWeight: 500, marginBottom: 6 }}>레슨 경험 및 실력</div>
          <RadioGroup
            name="lesson-level"
            options={LEVEL_OPTIONS}
            defaultValue={level}
            onChange={setLevel}
            className="horizontal"
          />
        </div>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontWeight: 500, marginBottom: 6 }}>레슨 목표 및 요청 사항</div>
          <textarea
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="예) 회화 실력 향상, 시험 준비 등"
            style={{
              width: '100%',
              minHeight: 60,
              borderRadius: 8,
              border: '1px solid #ddd',
              padding: 10,
              fontSize: 15,
            }}
            required
          />
        </div>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontWeight: 500, marginBottom: 6 }}>비상 연락처</div>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{
              width: '100%',
              borderRadius: 8,
              border: '1px solid #ddd',
              padding: 10,
              fontSize: 15,
            }}
            required
          />
        </div>
      </div>
      <RegularLessonStepFooter
        onPrev={onPrev}
        onNext={() => onNext({ level, goal, phone, request: goal })}
        nextLabel="다음"
        nextDisabled={!isNextEnabled}
      />
    </OnboardingLayout>
  );
}
