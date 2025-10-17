import { useNavigate } from 'react-router-dom';
import OnboardingStepLessonForm from '@/domain/onboarding/components/OnboardingStepLessonForm.tsx';
import OnboardingLayout from '@/domain/onboarding/components/OnboardingLayout';
import OnboardingNextButton from '@/domain/onboarding/components/OnboardingNextButton';
import { useOnboardingLesson } from '../../lesson/hooks/useLesson.ts';
import { setLessonCategory } from '../lib/onboarding.ts';

export default function OnboardingLesson() {
  const navigate = useNavigate();
  const lesson = useOnboardingLesson();
  const { mainCode, selectedSubs } = lesson;
  async function goNext() {
    setLessonCategory({ mainCode, subCodes: Array.from(selectedSubs.keys()) });
    navigate('/onboarding/tutor/region');
  }

  return (
    <OnboardingLayout
      step={3}
      total={4}
      subtitle="레슨 유형을 고른 뒤, 상세 레슨을 여러 개 선택할 수 있어요."
      bodyClassName="mls-body"
      footer={<OnboardingNextButton addClass="ui-btn--full" onClick={goNext} />}
    >
      <OnboardingStepLessonForm
        {...lesson}
        selectedSubs={new Set(lesson.selectedSubs.keys())}
        title="가르칠 레슨을 선택해주세요"
      />
    </OnboardingLayout>
  );
}
