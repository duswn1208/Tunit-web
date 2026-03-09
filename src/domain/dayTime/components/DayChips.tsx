import { type DayOfWeekNumber, DAY_LABELS } from '@/shared/constants/date.ts';

const ALL_DAYS: DayOfWeekNumber[] = [1, 2, 3, 4, 5, 6, 7];

interface Props {
  selected: Set<DayOfWeekNumber>;
  onToggle: (d: DayOfWeekNumber) => void;
  multi?: boolean;
}

export default function DayChips({ selected, onToggle, multi = true }: Props) {
  const handleClick = (d: DayOfWeekNumber) => {
    if (multi) {
      onToggle(d);
    } else {
      if (!selected.has(d) || selected.size > 1) {
        selected.forEach((v) => { if (v !== d) onToggle(v); });
        if (!selected.has(d)) onToggle(d);
      }
    }
  };

  return (
    <div className="day-chips">
      {ALL_DAYS.map((d) => (
        <button
          key={d}
          type="button"
          onClick={() => handleClick(d)}
          className={`day-chip${selected.has(d) ? ' day-chip--active' : ''}`}
        >
          {DAY_LABELS[d]}
        </button>
      ))}
    </div>
  );
}
