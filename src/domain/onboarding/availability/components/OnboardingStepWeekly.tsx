// src/domain/availability/components/OnboardingStepWeekly.tsx
import WeeklyForm from './WeeklyForm';

export default function OnboardingStepWeekly({
  weeklyForm,
}: {
  weeklyForm: ReturnType<typeof import('../hooks/useWeeklyForm').useWeeklyForm>;
}) {
  return <WeeklyForm {...weeklyForm} />;
}
