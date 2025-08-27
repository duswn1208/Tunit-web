import { useForm } from 'react-hook-form';
import '../../css/ui/ui-tokens.css';
import '../../css/ui/ui-card.css';
import '../../css/ui/ui-form.css';
import '../../css/ui/ui-input.css';
import '../../css/ui/ui-button.css';
import OnboardingCard from '../../components/onboarding/Card';
import NextButton from '../../components/onboarding/NextButton';
import { RadioGroup, FormField } from '../../components/ui';
import { OnboardingLayout } from '../../components/onboarding';

type Role = 'TUTOR' | 'STUDENT';
type FormData = {
  role: Role;
  nickname: string;
};

export default function OnboardingStart() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ defaultValues: { role: 'TUTOR', nickname: '' } });

  const onSubmit = (data: FormData) => {
    if (isSubmitting) return;
    // 1단계 저장
    localStorage.setItem('onboarding.step1', JSON.stringify(data));

    // 역할에 따라 2단계 라우팅
    if (data.role === 'TUTOR') {
      window.location.href = '/onboarding/tutor';
    } else {
      // 학생 온보딩 준비되기 전까지 임시로 마이페이지/메인으로 유도
      // window.location.href = "/onboarding/student";
      window.location.href = '/mypage';
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
        <NextButton
          addClass="ui-btn--full"
          onClick={handleSubmit(onSubmit)}
          loading={isSubmitting}
        />
      }
    >
      <FormField className="mls-header" label="역할" childrenClsx="ui-radio-group">
        <RadioGroup name="role" options={radioOption} defaultValue="TUTOR"></RadioGroup>
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
