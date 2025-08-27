// src/domain/availability/components/OnboardingStepWeekly.tsx
import WeeklyForm from './WeeklyForm';

interface Props {
  onPrev?: () => void;
  onNext?: () => void;
}

export default function OnboardingStepWeekly({ onPrev, onNext }: Props) {
  return <WeeklyForm onPrev={onPrev} onNext={onNext} />;
}
