import { useNavigate } from 'react-router-dom';

import OnboardingLayout from '@/domain/onboarding/components/OnboardingLayout';
import OnboardingNextButton from '@/domain/onboarding/components/OnboardingNextButton';
import OnboardingRegionForm from '@/domain/onboarding/components/OnboardingRegionForm.tsx';

import { setRegion } from '../../../lib/onboarding/storage';
import useOnboardingRegion from '../hooks/useRegion.ts';

import { loadUserRole, loadLessonCategory, loadRegion } from '../../../lib/onboarding';
import { api } from '../../../lib/api';

export default function OnboardingStudentRegion() {
  const navigate = useNavigate();
  const regionForm = useOnboardingRegion();
  const { selectedList } = regionForm;

  async function submitStudentJoin() {
    const userRole = loadUserRole();
    const lessonCategory = loadLessonCategory();
    const region = loadRegion();

    // 2. DTO 변환 (실제 필드명/구조에 맞게 수정 필요)
    const payload = {
      ...userRole,
      mainCategoryList: lessonCategory?.mainCode,
      subCategoryList: lessonCategory?.subCodes,
      regionList: region,
    };

    alert(JSON.stringify(payload, null, 2)); // payload 확인용

    // 3. API 요청 (api.ts 사용)
    return await api.post('/api/students/profile/join', payload);
  }

  const goNext = async () => {
    setRegion(selectedList);
    try {
      await submitStudentJoin();
      alert('가입이 완료되었습니다!');
      navigate('/');
    } catch (e: any) {
      alert(e.message || '가입 요청 중 오류가 발생했습니다.');
    }
  };

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
