// src/domain/availability/components/WeeklyGrid.tsx
import { useState } from 'react';
import type { DayOfWeek, TimeRange } from '../types/availability';
import { useWeeklyAvailability } from '../hooks/useWeeklyAvailability';
import TimeSlotChip from './TimeSlotChip';
import TimeRangePicker from './TimeRangePicker';

const DAY_LABELS: Record<DayOfWeek, string> = {
  1: '월',
  2: '화',
  3: '수',
  4: '목',
  5: '금',
  6: '토',
  7: '일',
};

export default function WeeklyGrid() {
  const { getRanges, addRange, updateRange, removeRange } = useWeeklyAvailability();

  const [editing, setEditing] = useState<{
    day: DayOfWeek;
    index?: number;
  } | null>(null);

  const handleConfirm = (range: TimeRange) => {
    if (!editing) return;
    if (editing.index != null) {
      updateRange(editing.day, editing.index, range);
    } else {
      addRange(editing.day, range);
    }
    setEditing(null);
  };

  return (
    <div className="grid grid-cols-7 gap-3">
      {(Object.keys(DAY_LABELS) as unknown as DayOfWeek[]).map((day) => (
        <div key={day} className="flex flex-col gap-2 p-2 border rounded">
          <div className="text-center font-semibold">{DAY_LABELS[day]}</div>

          <div className="flex flex-col gap-1">
            {getRanges(day).map((range, idx) => (
              <TimeSlotChip
                key={`${range.startTime}-${range.endTime}`}
                range={range}
                onEdit={() => setEditing({ day, index: idx })}
                onDelete={() => removeRange(day, idx)}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => setEditing({ day })}
            className="mt-2 text-xs px-2 py-1 rounded bg-gray-200 hover:bg-gray-300"
          >
            + 구간 추가
          </button>

          {editing?.day === day && (
            <div className="mt-2">
              <TimeRangePicker
                initial={editing.index != null ? getRanges(day)[editing.index] : undefined}
                onConfirm={handleConfirm}
                onCancel={() => setEditing(null)}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
