import { useNavigate } from 'react-router-dom';

import OnboardingLayout from '@/domain/onboarding/components/OnboardingLayout';
import OnboardingNextButton from '@/domain/onboarding/components/OnboardingNextButton';
import OnboardingRegionForm from '@/domain/onboarding/components/OnboardingRegionForm.tsx';

import { setRegion } from '../lib/storage.ts';
import useOnboardingRegion from '../hooks/useRegion.ts';

export default function OnboardingRegion() {
  const navigate = useNavigate();
  const regionForm = useOnboardingRegion();
  const { selectedList } = regionForm;

  async function goNext() {
    setRegion(selectedList);
    navigate('/onboarding/tutor/availability');
  }

  return (
    <OnboardingLayout
      step={4}
      total={4}
      subtitle="시/도를 선택한 뒤, 구/군을 여러 개 선택하세요. (중복 선택 가능)"
      bodyClassName="mls-body"
      footer={
        <OnboardingNextButton
          addClass="ui-btn--full"
          disabled={selectedList.length === 0}
          onClick={goNext}
          label="다음"
        ></OnboardingNextButton>
      }
    >
      <OnboardingRegionForm regionForm={regionForm} />
    </OnboardingLayout>
  );
}
