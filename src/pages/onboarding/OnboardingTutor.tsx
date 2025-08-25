import { useForm } from 'react-hook-form';

import { Card, FormField, Button } from '../../components/ui';
import { OnboardingLayout, NextButton } from '../../components/onboarding';

import '../../css/ui/ui-tokens.css';
import '../../css/ui/ui-card.css';
import '../../css/ui/ui-form.css';
import '../../css/ui/ui-input.css';
import '../../css/ui/ui-button.css';

// 1단계(역할/닉네임) 로딩 유틸
type Role = 'TUTOR' | 'STUDENT';
type Step1 = { role: Role; nickname: string };

function loadStep1(): Step1 | null {
  try {
    const raw = localStorage.getItem('onboarding.step1');
    return raw ? (JSON.parse(raw) as Step1) : null;
  } catch {
    return null;
  }
}

// 2단계 폼 타입
type FormData = {
  intro: string; // 소개글
  years: number; // 경력 연수
  hourlyRate: number; // 시간당 레슨 금액(원)
  unitMinutes: 30 | 45 | 60 | 90; // 기본 수업 단위(분)
};

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
  } = useForm<FormData>({
    defaultValues: {
      intro: '',
      years: 0,
      hourlyRate: 0,
      unitMinutes: 60,
    },
  });

  const onSubmit = async (data: FormData) => {
    if (isSubmitting) return; // early return

    // 최종 Payload: 1단계 + 2단계 합치기
    let payload = {
      role: step1.role, // "TUTOR"
      nickname: step1.nickname, // 1단계 닉네임
      intro: data.intro.trim(),
      years: Number(data.years),
      hourlyRate: Number(data.hourlyRate),
      unitMinutes: Number(data.unitMinutes),
    };

    // 필요 시 임시 저장(선택)
    localStorage.setItem('onboarding.step2.tutor', JSON.stringify(payload));
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
          <option value={45}>45분</option>
          <option value={60}>60분</option>
          <option value={90}>90분</option>
        </select>
      </FormField>
    </OnboardingLayout>
  );
}
