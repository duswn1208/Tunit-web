import OnboardingNextButton from '@/domain/onboarding/components/OnboardingNextButton.tsx';
import '../css/availability.css';
import '../css/time-inputs.css';
import { Button } from '@/shared/components';

interface Props {
  startTime: string;
  endTime: string;
  onChangeStart: (v: string) => void;
  onChangeEnd: (v: string) => void;
  onAdd: () => void;
}
export default function TimeInputs({
  startTime,
  endTime,
  onChangeStart,
  onChangeEnd,
  onAdd,
}: Props) {
  const handleStartClick = () => {
    const input = document.querySelector('#start-time-input') as HTMLInputElement;
    if (input) {
      input.showPicker?.();
      input.focus();
    }
  };

  const handleEndClick = () => {
    const input = document.querySelector('#end-time-input') as HTMLInputElement;
    if (input) {
      input.showPicker?.();
      input.focus();
    }
  };

  return (
    <div className="px-4 time-row">
      <div className="time-input-group">
        <div onClick={handleStartClick} className="time-input-wrapper">
          <input
            id="start-time-input"
            type="time"
            step={600}
            value={startTime}
            onChange={(e) => onChangeStart(e.target.value)}
            className="time-input-field"
          />
        </div>
      </div>
      <span className="time-separator">~</span>
      <div className="time-input-group">
        <div onClick={handleEndClick} className="time-input-wrapper">
          <input
            id="end-time-input"
            type="time"
            step={600}
            value={endTime}
            onChange={(e) => onChangeEnd(e.target.value)}
            className="time-input-field"
          />
        </div>
      </div>
      <Button className="ui-btn--accent" onClick={onAdd}>
        + 구간 추가
      </Button>
    </div>
  );
}
