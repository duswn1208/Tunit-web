import { FormField } from '../../../../components';
import OnboardingNextButton from '../../common/components/OnboardingNextButton';
import '../css/availability.css';

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
  return (
    <div className="px-4 time-row">
      <FormField label="시작" htmlFor="startTime" required>
        <input
          type="time"
          step={600}
          value={startTime}
          onChange={(e) => onChangeStart(e.target.value)}
          className="time-input"
        />
      </FormField>
      ~
      <FormField label="종료" htmlFor="endTime" required>
        <input
          type="time"
          step={600}
          value={endTime}
          onChange={(e) => onChangeEnd(e.target.value)}
          className="time-input"
        />
      </FormField>
      <OnboardingNextButton
        addClass="ui-btn--accent py-6"
        onClick={onAdd}
        label="+ 구간 추가"
      ></OnboardingNextButton>
    </div>
  );
}
