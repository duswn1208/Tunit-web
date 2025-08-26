import { useForm } from 'react-hook-form';

import { FormField } from '../../components/ui';
import { OnboardingLayout, NextButton } from '../../components/onboarding';
import { loadStep1 } from '../../lib/onboarding';
import type { Step2 } from '../../type/onboarding';

import '../../css/ui/ui-tokens.css';
import '../../css/ui/ui-card.css';
import '../../css/ui/ui-form.css';
import '../../css/ui/ui-input.css';
import '../../css/ui/ui-button.css';

export default function OnboardingTutor() {
  const step1 = loadStep1();

  // 가드: 1단계 미완료/역할 불일치 시 1단계로 보냄
  if (!step1 || step1.role !== 'TUTOR') {
    window.location.replace('/onboarding');
    return null;
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Step2>({
    defaultValues: {
      intro: '',
      years: 0,
      hourlyRate: 0,
      unitMinutes: 60,
    },
  });

  const onSubmit = async (data: Step2) => {
    if (isSubmitting) return; // early return

    localStorage.setItem(
      'onboarding.step2.tutor',
      JSON.stringify({
        role: step1.role,
        nickName: step1.nickname,
        intro: data.intro.trim(),
        years: Number(data.years),
        hourlyRate: Number(data.hourlyRate),
        unitMinutes: Number(data.unitMinutes),
      })
    );
    window.location.href = '/onboarding/tutor/lesson'; // 여기로 이동
  };

  return (
    <OnboardingLayout
      step={2}
      total={4}
      subtitle={`${step1.nickname} 님! 소개, 경력, 레슨 단가/단위를 입력해주세요. (시간/휴무는 다음 단계에서 설정)`}
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      footer={<NextButton type="submit" label="다음 →" loading={isSubmitting} />}
    >
      <FormField
        label="소개글"
        htmlFor="intro"
        required
        error={errors.intro?.message}
        hint="10~500자"
      >
        <textarea
          id="intro"
          className="ui-textarea"
          placeholder="예) 튜닛입니다."
          rows={5}
          {...register('intro', {
            required: '소개글은 필수입니다.',
            minLength: { value: 10, message: '10자 이상' },
            maxLength: { value: 500, message: '500자 이내' },
          })}
        />
      </FormField>

      <FormField label="경력 연수" htmlFor="years" required error={errors.years?.message}>
        <input
          id="years"
          className="ui-input"
          type="number"
          min={0}
          step={1}
          {...register('years', {
            required: '경력 연수를 입력해주세요.',
            valueAsNumber: true,
            min: { value: 0, message: '0 이상' },
            max: { value: 60, message: '60 이하' },
          })}
        />
      </FormField>

      <FormField
        label="시간당 레슨 금액(원)"
        htmlFor="hourlyRate"
        required
        error={errors.hourlyRate?.message}
      >
        <input
          id="hourlyRate"
          className="ui-input"
          type="number"
          min={0}
          step={1000}
          {...register('hourlyRate', {
            required: '시간당 금액을 입력해주세요.',
            valueAsNumber: true,
            min: { value: 0, message: '0원 이상' },
            max: { value: 1000000, message: '1,000,000원 이하' },
          })}
        />
      </FormField>

      <FormField
        label="기본 수업 단위(분)"
        htmlFor="unitMinutes"
        required
        error={errors.unitMinutes && '수업 단위를 선택해주세요.'}
      >
        <select
          id="unitMinutes"
          className="ui-select"
          {...register('unitMinutes', { required: true, valueAsNumber: true })}
        >
          <option value={30}>30분</option>
          <option value={60}>60분</option>
          <option value={90}>90분</option>
        </select>
      </FormField>
    </OnboardingLayout>
  );
}
