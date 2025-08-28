import { useNavigate } from 'react-router-dom';
import OnboardingStepLessonForm from '../lesson/components/OnboardingStepLessonForm';
import OnboardingLayout from '../common/components/OnboardingLayout';
import OnboardingNextButton from '../common/components/OnboardingNextButton';
import { useOnboardingLesson } from '../lesson/hooks/useLesson';
import { loadLessonCategory, setLessonCategory } from '../../../lib/onboarding';

export default function OnboardingLesson() {
  const navigate = useNavigate();
  const lesson = useOnboardingLesson();
  const { mainCode, selectedSubs } = lesson;
  async function goNext() {
    setLessonCategory({ mainCode, subCodes: Array.from(selectedSubs) });
    alert(JSON.stringify(loadLessonCategory()));
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
      <OnboardingStepLessonForm {...lesson} />
    </OnboardingLayout>
  );
}
