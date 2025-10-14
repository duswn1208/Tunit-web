// src/domain/availability/components/OnboardingStepWeekly.tsx
import WeeklyForm from './WeeklyForm.tsx';

export default function OnboardingStepWeekly({
  weeklyForm,
}: {
  weeklyForm: ReturnType<typeof import('../hooks/useWeeklyForm.ts').useWeeklyForm>;
}) {
  return <WeeklyForm {...weeklyForm} />;
}
