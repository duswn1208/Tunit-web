import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { OnboardingLayout } from '../../components/onboarding';
import OnboardingStepWeekly from '../../domain/availability/components/OnboardingStepWeekly';

export default function OnboardingAvailability() {
  const navigate = useNavigate();
  const [availability] = useState<any[]>([]); // 주간 가능시간 상태
  const goPrev = () => navigate('/onboarding/tutor/region');
  const goNext = () => {
    localStorage.setItem('onboarding.step4.tutor', JSON.stringify(availability));
    navigate('/onboarding/tutor/nextStep');
  };

  return (
    <OnboardingLayout
      step={5}
      total={6}
      subtitle="수업 가능한 날짜와 시간을 선택해주세요."
      bodyClassName="mls-body"
    >
      <OnboardingStepWeekly onPrev={goPrev} onNext={goNext} />
    </OnboardingLayout>
  );
}
