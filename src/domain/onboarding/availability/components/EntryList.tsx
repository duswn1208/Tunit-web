import type { DayOfWeek } from '../types/availability';
import type { Entry } from '../hooks/useWeeklyForm';
import OnboardingNextButton from '../../common/components/OnboardingNextButton';

const DAY_LABELS: Record<DayOfWeek, string> = {
  1: '월',
  2: '화',
  3: '수',
  4: '목',
  5: '금',
  6: '토',
  7: '일',
};

interface Props {
  entries: Entry[];
  onRemove: (idx: number) => void;
}
export default function EntryList({ entries, onRemove }: Props) {
  if (entries.length === 0)
    return <div className="px-6 text-sm text-gray-500">아직 등록된 구간이 없습니다.</div>;
  return (
    <ul className="flex flex-col gap-2 px-2">
      {entries.map((e, idx) => (
        <li key={idx} className="flex items-center justify-between border rounded px-3 py-2">
          <div className="text-sm">
            <span className="font-medium">{e.days.map((d) => DAY_LABELS[d]).join(', ')}</span>{' '}
            {e.startTime} ~ {e.endTime}
          </div>
          <OnboardingNextButton
            onClick={() => onRemove(idx)}
            addClass="ui-btn--accent"
            label="삭제"
          ></OnboardingNextButton>
        </li>
      ))}
    </ul>
  );
}
