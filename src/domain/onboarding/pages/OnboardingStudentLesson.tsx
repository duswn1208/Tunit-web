import { useNavigate } from 'react-router-dom';
import OnboardingStepLessonForm from '@/domain/onboarding/components/OnboardingStepLessonForm.tsx';
import OnboardingLayout from '@/domain/onboarding/components/OnboardingLayout';
import OnboardingNextButton from '@/domain/onboarding/components/OnboardingNextButton';
import { useOnboardingLesson } from '../../lesson/hooks/useLesson.ts';
import { setLessonCategory } from '../lib/onboarding.ts';

export default function OnboardingStudentLesson() {
  const navigate = useNavigate();
  const lesson = useOnboardingLesson();
  const { mainCode, selectedSubs } = lesson;
  async function goNext() {
    setLessonCategory({ mainCode, subCodes: Array.from(selectedSubs.keys()) });
    navigate('/onboarding/student/region');
  }

  function skipOnboarding() {
    // 온보딩을 건너뛰고 메인 페이지로 이동
    navigate('/');
  }

  return (
    <OnboardingLayout
      step={3}
      total={4}
      subtitle="레슨 유형을 고른 뒤, 상세 레슨을 여러 개 선택하세요."
      bodyClassName="mls-body"
      footer={
        <div className="mls-footer" style={{ display: 'flex', gap: '8px' }}>
          <OnboardingNextButton addClass="ui-btn--full ui-btn--secondary" onClick={skipOnboarding} label="다음에 하기" />
          <OnboardingNextButton addClass="ui-btn--full" onClick={goNext} />
        </div>
      }
    >
      <OnboardingStepLessonForm {...lesson} title="어떤 레슨을 희망하시나요?" />
    </OnboardingLayout>
  );
}
