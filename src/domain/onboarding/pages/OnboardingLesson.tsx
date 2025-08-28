import { useNavigate } from 'react-router-dom';
import OnboardingStepLessonForm from '../lesson/components/OnboardingStepLessonForm';
import OnboardingLayout from '../common/components/OnboardingLayout';
import OnboardingNextButton from '../common/components/OnboardingNextButton';
import { useOnboardingLesson } from '../lesson/hooks/useLesson';

export default function OnboardingLesson() {
  const navigate = useNavigate();
  const { mainCode, selectedSubs } = useOnboardingLesson();
  async function goNext() {
    localStorage.setItem(
      'onboarding.step3.tutor',
      JSON.stringify({ mainCode, subCodes: Array.from(selectedSubs) })
    );
    navigate('/onboarding/tutor/region');
  }

  return (
    <OnboardingLayout
      step={3}
      total={4}
      subtitle="레슨 유형을 고른 뒤, 상세 레슨을 여러 개 선택하세요."
      bodyClassName="mls-body"
      footer={<OnboardingNextButton addClass="ui-btn--full" onClick={goNext} />}
    >
      <OnboardingStepLessonForm />
    </OnboardingLayout>
  );
}
