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
  multi?: boolean; // true: 다중선택, false: 단일선택
}

export default function DayChips({ selected, onToggle, multi = true }: Props) {
  const handleClick = (d: DayOfWeek) => {
    if (multi) {
      onToggle(d);
    } else {
      // 단일 선택: 이미 선택된 값이 아니면 해당 값만 남기기
      if (!selected.has(d) || selected.size > 1) {
        // selected를 d만 남기도록 onToggle 호출
        selected.forEach((v) => {
          if (v !== d) onToggle(v); // 기존 선택 해제
        });
        if (!selected.has(d)) onToggle(d); // 새 선택
      }
    }
  };
  return (
    <div className="mls-chips">
      {ALL_DAYS.map((d) => {
        const isOn = selected.has(d);
        return (
          <button
            key={d}
            type="button"
            onClick={() => handleClick(d)}
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
