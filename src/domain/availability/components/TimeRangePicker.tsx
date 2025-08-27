// src/domain/availability/components/TimeRangePicker.tsx
import { useState } from 'react';
import type { TimeRange } from '../types/availability';
import { FormField } from '../../../components/ui';

import '../css/availability.css';

interface Props {
  initial?: TimeRange;
  onConfirm: (range: TimeRange) => void;
  onCancel: () => void;
}

export default function TimeRangePicker({ initial, onConfirm, onCancel }: Props) {
  const [startTime, setStartTime] = useState(initial?.startTime ?? '');
  const [endTime, setEndTime] = useState(initial?.endTime ?? '');

  const handleConfirm = () => {
    if (!startTime || !endTime) return;
    onConfirm({ startTime, endTime });
  };

  return (
    <div className="flex flex-col gap-2 p-3 border rounded-lg bg-white shadow">
      {/* <FormField label="시작" htmlFor="startTime" required>
        <input
          type="time"
          step={10}
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="time-input"
        />
      </FormField>
      <FormField label="종료" htmlFor="endTime" required>
        <input
          type="time"
          step={10}
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="time-input"
        />
      </FormField> */}

      <div className="flex items-center gap-2">
        <label className="text-sm">시작</label>
        <input
          type="time"
          step={300}
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="time-input"
        />
      </div>
      <div className="flex items-center gap-2">
        <label className="text-sm">종료</label>
        <input
          type="time"
          step={600}
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="time-input"
        />
      </div>
      <div className="flex justify-end gap-2 mt-2">
        <button type="button" onClick={onCancel} className="px-3 py-1 rounded bg-gray-200">
          취소
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          className="px-3 py-1 rounded bg-blue-500 text-white"
        >
          확인
        </button>
      </div>
    </div>
  );
}
