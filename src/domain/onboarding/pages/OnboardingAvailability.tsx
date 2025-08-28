import OnboardingStepWeekly from '../availability/components/OnboardingStepWeekly';
import OnboardingLayout from '../common/components/OnboardingLayout';
import OnboardingNextButton from '../common/components/OnboardingNextButton';

import { api } from '../../../lib/api';
import { useWeeklyForm } from '../availability/hooks/useWeeklyForm';

// 튜터 가입 요청 함수(api.ts 사용)
async function submitTutorJoin() {
  // 1. 각 단계별 데이터 로드
  const step1 = JSON.parse(localStorage.getItem('onboarding.step1') || '{}');
  const step2 = JSON.parse(localStorage.getItem('onboarding.step2.tutor') || '{}');
  const step3 = JSON.parse(localStorage.getItem('onboarding.step3.tutor') || '{}');
  const step4 = JSON.parse(localStorage.getItem('onboarding.step4.tutor') || '{}');
  const step5 = JSON.parse(localStorage.getItem('onboarding.step5.tutor') || '{}');
  const step6 = JSON.parse(localStorage.getItem('onboarding.step6.tutor') || '{}');
  const availability = JSON.parse(localStorage.getItem('onboarding.tutor.availability') || '{}');

  // 2. DTO 변환 (예시, 실제 필드명/구조에 맞게 수정 필요)
  const payload = {
    ...step1,
    ...step2,
    ...step3,
    ...step4,
    ...step5,
    ...step6,
    tutorAvailableTimeSaveDtoList: (availability.items || []).map((item: any) => ({
      dayOfWeekNum: item.dayOfWeek,
      startTime: item.startTime,
      endTime: item.endTime,
    })),
  };

  // 3. API 요청 (api.ts 사용)
  return await api('/api/tutor/join', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export default function OnboardingAvailability() {
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
      // TODO: 가입 완료 후 이동할 경로로 라우팅
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
