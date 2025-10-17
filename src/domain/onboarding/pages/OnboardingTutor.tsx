import { useForm } from 'react-hook-form';

import type { Step2 } from '../types/onboarding.ts';

import OnboardingNextButton from '@/domain/onboarding/components/OnboardingNextButton';
import OnboardingLayout from '@/domain/onboarding/components/OnboardingLayout';
import { FormField } from '../../../shared/components';
import { loadTutorProfile, loadUserRole, setTutorProfile } from '../lib/onboarding.ts';
import { useNavigate } from 'react-router-dom';

export default function OnboardingTutor() {
  const step1 = loadUserRole();
  const navigate = useNavigate();

  // 가드: 1단계 미완료/역할 불일치 시 1단계로 보냄
  if (!step1 || step1.role !== 'TUTOR') {
    navigate('/onboarding');
    return null;
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Step2>({
    defaultValues: {
      introduce: '',
      careerYears: 0,
      pricePerHour: 0,
      durationMin: 60,
    },
  });

  const onSubmit = async (data: Step2) => {
    if (isSubmitting) return; // early return

    setTutorProfile({
      introduce: data.introduce.trim(),
      careerYears: Number(data.careerYears),
      pricePerHour: Number(data.pricePerHour),
      durationMin: data.durationMin,
    });

    navigate('/onboarding/tutor/lesson');
  };

  return (
    <OnboardingLayout
      step={2}
      total={4}
      subtitle={`${step1.nickname} 님! 소개, 경력, 레슨 단가/단위를 입력해주세요. (시간/휴무는 다음 단계에서 설정)`}
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      footer={<OnboardingNextButton addClass="ui-btn--full" type="submit" loading={isSubmitting} />}
    >
      <FormField
        className="ui-field-noborder"
        label="소개글"
        htmlFor="introduce"
        required
        error={errors.introduce?.message}
        hint="10~500자"
      >
        <textarea
          id="introduce"
          className="ui-textarea"
          placeholder="예) 튜닛입니다."
          value="튜닛입니다 저는 매니저에요"
          rows={5}
          {...register('introduce', {
            required: '소개글은 필수입니다.',
            minLength: { value: 10, message: '10자 이상' },
            maxLength: { value: 500, message: '500자 이내' },
          })}
        />
      </FormField>

      <FormField
        className="ui-field-noborder"
        label="경력 연수"
        htmlFor="careerYears"
        required
        error={errors.careerYears?.message}
      >
        <input
          id="careerYears"
          className="ui-input"
          type="number"
          value="10"
          min={0}
          step={1}
          {...register('careerYears', {
            required: '경력 연수를 입력해주세요.',
            valueAsNumber: true,
            min: { value: 0, message: '0 이상' },
            max: { value: 60, message: '60 이하' },
          })}
        />
      </FormField>

      <FormField
        className="ui-field-noborder"
        label="시간당 레슨 금액(원)"
        htmlFor="pricePerHour"
        required
        error={errors.pricePerHour?.message}
      >
        <input
          id="pricePerHour"
          className="ui-input"
          type="number"
          value="10000"
          min={0}
          step={1000}
          {...register('pricePerHour', {
            required: '시간당 금액을 입력해주세요.',
            valueAsNumber: true,
            min: { value: 0, message: '0원 이상' },
            max: { value: 1000000, message: '1,000,000원 이하' },
          })}
        />
      </FormField>

      <FormField
        className="ui-field-noborder"
        label="기본 수업 단위(분)"
        htmlFor="durationMin"
        required
        error={errors.durationMin && '수업 단위를 선택해주세요.'}
      >
        <select
          id="durationMin"
          className="ui-select"
          {...register('durationMin', { required: true, valueAsNumber: true })}
        >
          <option value={30}>30분</option>
          <option value={60}>60분</option>
          <option value={90}>90분</option>
        </select>
      </FormField>
    </OnboardingLayout>
  );
}
