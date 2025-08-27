// src/domain/availability/components/TimeSlotChip.tsx
import type { TimeRange } from '../types/availability';

interface Props {
  range: TimeRange;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function TimeSlotChip({ range, onEdit, onDelete }: Props) {
  return (
    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm shadow">
      <span>
        {range.startTime} ~ {range.endTime}
      </span>
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          className="text-xs text-gray-600 hover:text-gray-900"
        >
          ✎
        </button>
      )}
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="text-xs text-red-600 hover:text-red-900"
        >
          ✕
        </button>
      )}
    </div>
  );
}
