import { useNavigate } from 'react-router-dom';
import OnboardingStepWeekly from '../availability/components/OnboardingStepWeekly';
import OnboardingLayout from '../common/components/OnboardingLayout';
import OnboardingNextButton from '../common/components/OnboardingNextButton';
import { useWeeklyForm } from '../availability/hooks/useWeeklyForm';

export default function OnboardingAvailability() {
  const navigate = useNavigate();
  const { saveToLocalStorage, entries } = useWeeklyForm();
  const goPrev = () => navigate('/onboarding/tutor/region');
  const goNext = () => {
    if (entries.length === 0) {
      alert('최소 하나 이상의 가능 시간을 선택해주세요.');
      return; // 엔트리가 없으면 진행하지 않음
    }
    saveToLocalStorage();

    //회원가입
  };

  return (
    <OnboardingLayout
      step={5}
      total={6}
      subtitle="수업 가능한 날짜와 시간을 선택해주세요."
      bodyClassName="mls-body"
      footer={
        <OnboardingNextButton
          addClass="ui-btn--full"
          onClick={goNext}
          disabled={entries.length === 0}
          label="다음"
        ></OnboardingNextButton>
      }
    >
      <OnboardingStepWeekly />
    </OnboardingLayout>
  );
}
