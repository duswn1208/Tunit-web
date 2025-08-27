import type { DayOfWeek } from '../types/availability';

const DAY_LABELS: Record<DayOfWeek, string> = {
  1: '월',
  2: '화',
  3: '수',
  4: '목',
  5: '금',
  6: '토',
  7: '일',
};
const ALL_DAYS: DayOfWeek[] = [1, 2, 3, 4, 5, 6, 7];

interface Props {
  selected: Set<DayOfWeek>;
  onToggle: (d: DayOfWeek) => void;
}
export default function DayChips({ selected, onToggle }: Props) {
  return (
    <div className="mls-chips">
      {ALL_DAYS.map((d) => {
        const isOn = selected.has(d);
        return (
          <button
            key={d}
            type="button"
            onClick={() => onToggle(d)}
            className={
              'px-3 py-2 rounded-full border transition-colors ' +
              (isOn
                ? 'bg-brand-red text-white border-brand-red'
                : 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200')
            }
          >
            {DAY_LABELS[d]}
          </button>
        );
      })}
    </div>
  );
}
