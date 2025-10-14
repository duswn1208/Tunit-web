import OnboardingStepWeekly from '@/domain/dayTime/components/OnboardingStepWeekly';
import OnboardingLayout from '@/domain/onboarding/components/OnboardingLayout';
import OnboardingNextButton from '@/domain/onboarding/components/OnboardingNextButton';

import { api } from '../../../lib/api';
import { useWeeklyForm } from '@/domain/dayTime/hooks/useWeeklyForm';
import {
  loadUserRole,
  loadTutorProfile,
  loadLessonCategory,
  loadRegion,
  loadAvailability,
} from '../../../lib/onboarding';
import { useNavigate } from 'react-router-dom';

// 튜터 가입 요청 함수(api.ts 사용)
async function submitTutorJoin() {
  const userRole = loadUserRole();
  const tutorProfile = loadTutorProfile();
  const lessonCategory = loadLessonCategory();
  const region = loadRegion();
  const availability = loadAvailability();

  // 2. DTO 변환 (실제 필드명/구조에 맞게 수정 필요)
  const payload = {
    ...userRole,
    ...tutorProfile,
    mainCategory: lessonCategory?.mainCode,
    subCategoryList: lessonCategory?.subCodes,
    regionList: region,
    tutorAvailableTimeSaveDtoList: (availability || []).map((item: any) => ({
      dayOfWeekNum: item.dayOfWeek,
      startTime: item.startTime,
      endTime: item.endTime,
    })),
  };

  alert(JSON.stringify(payload, null, 2)); // payload 확인용

  // 3. API 요청 (api.ts 사용)
  return await api.post('/api/tutor/profile/join', payload);
}

export default function OnboardingAvailability() {
  const navigate = useNavigate();
  const weeklyForm = useWeeklyForm();
  const { saveToLocalStorage, entries } = weeklyForm;

  const goNext = async () => {
    if (entries.length === 0) {
      alert('최소 하나 이상의 가능 시간을 선택해주세요.');
      return;
    }
    saveToLocalStorage();
    try {
      await submitTutorJoin();
      alert('튜터 가입이 완료되었습니다!');
      navigate('/');
    } catch (e: any) {
      alert(e.message || '가입 요청 중 오류가 발생했습니다.');
    }
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
      <OnboardingStepWeekly weeklyForm={weeklyForm} />
    </OnboardingLayout>
  );
}
