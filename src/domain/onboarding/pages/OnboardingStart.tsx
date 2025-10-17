import { useForm } from 'react-hook-form';
import OnboardingNextButton from '@/domain/onboarding/components/OnboardingNextButton';
import { RadioGroup, FormField } from '../../../shared/components';
import OnboardingLayout from '@/domain/onboarding/components/OnboardingLayout';
import { setUserRole } from '../lib/onboarding.ts';
import { generateRandomNickname } from '@/shared/lib/generateNickname';

type Role = 'TUTOR' | 'STUDENT';
type FormData = {
  role: Role;
  nickname: string;
};

export default function OnboardingStart() {
  const initialNickname = generateRandomNickname();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ defaultValues: { role: 'TUTOR', nickname: initialNickname } });

  const onSubmit = (data: FormData) => {
    if (isSubmitting) return;
    setUserRole(data);
    if (data.role === 'TUTOR') {
      window.location.href = '/onboarding/tutor';
    } else {
      window.location.href = '/onboarding/student';
    }
  };

  const radioOption = [
    { label: '튜터', value: 'TUTOR' },
    { label: '학생', value: 'STUDENT' },
  ];

  return (
    <OnboardingLayout
      title="온보딩"
      subtitle="회원 유형을 선택하고 별명을 입력해주세요."
      footer={
        <OnboardingNextButton
          addClass="ui-btn--full"
          onClick={handleSubmit(onSubmit)}
          loading={isSubmitting}
        />
      }
    >
      <FormField className="mls-header" label="회원 유형" childrenClsx="ui-radio-group" required>
        <RadioGroup
          name="role"
          options={radioOption}
          defaultValue="TUTOR"
          onChange={(value) => setValue('role', value as Role)}
        />
      </FormField>
      <FormField
        className="mls-header"
        label="별명"
        htmlFor="nickname"
        required
        error={errors.nickname?.message}
      >
        <input
          className="ui-input"
          id="nickname"
          value={initialNickname}
          placeholder="예) 즐거운 펭귄"
          {...register('nickname', {
            required: '별명은 필수입니다.',
            minLength: { value: 2, message: '2자 이상 입력해주세요.' },
            maxLength: { value: 20, message: '20자 이내로 입력해주세요.' },
            pattern: {
              value: /^[A-Za-z0-9가-힣\s]+$/,
              message: '한글, 영문, 숫자, 공백만 입력 가능합니다.',
            },
          })}
        />
      </FormField>
    </OnboardingLayout>
  );
}
