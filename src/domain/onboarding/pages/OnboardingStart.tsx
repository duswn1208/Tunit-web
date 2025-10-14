import { useForm } from 'react-hook-form';
import OnboardingNextButton from '@/domain/onboarding/components/OnboardingNextButton';
import { RadioGroup, FormField } from '../../../shared/components';
import OnboardingLayout from '@/domain/onboarding/components/OnboardingLayout';
import { setUserRole } from '../lib/onboarding.ts';

type Role = 'TUTOR' | 'STUDENT';
type FormData = {
  role: Role;
  nickname: string;
};

export default function OnboardingStart() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ defaultValues: { role: 'TUTOR', nickname: '' } });

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
      subtitle="역할을 선택하고 닉네임을 설정해주세요."
      footer={
        <OnboardingNextButton
          addClass="ui-btn--full"
          onClick={handleSubmit(onSubmit)}
          loading={isSubmitting}
        />
      }
    >
      <FormField className="mls-header" label="역할" childrenClsx="ui-radio-group">
        <RadioGroup
          name="role"
          options={radioOption}
          defaultValue="TUTOR"
          onChange={(value) => setValue('role', value)}
        />
      </FormField>
      <FormField
        className="mls-header"
        label="닉네임"
        htmlFor="nickname"
        required
        error={errors.nickname?.message}
      >
        <input
          className="ui-input"
          id="nickname"
          placeholder="예) 튜닛"
          {...register('nickname', {
            required: '닉네임은 필수입니다.',
            minLength: { value: 2, message: '2자 이상 입력해주세요.' },
            maxLength: { value: 20, message: '20자 이내로 입력해주세요.' },
            pattern: { value: /^[\w가-힣]+$/, message: '한글/영문/숫자/밑줄만 허용됩니다.' },
          })}
        />
      </FormField>
    </OnboardingLayout>
  );
}
