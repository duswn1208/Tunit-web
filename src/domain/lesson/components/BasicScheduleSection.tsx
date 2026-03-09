import BasicScheduleForm from './BasicScheduleForm';
import type { Entry } from '@/domain/dayTime/hooks/useWeeklyForm';
import type { DayOfWeekNumber } from '@/shared/constants/date';

interface BasicScheduleSectionProps {
  isLoading: boolean;
  selectedDays: Set<DayOfWeekNumber>;
  startTime: string;
  endTime: string;
  entries: Entry[];
  onToggleDay: (day: DayOfWeekNumber) => void;
  onChangeStartTime: (time: string) => void;
  onChangeEndTime: (time: string) => void;
  onAddEntry: () => void;
  onRemoveEntry: (index: number) => void;
  onSave: () => void;
}

export default function BasicScheduleSection({
  isLoading,
  selectedDays,
  startTime,
  endTime,
  entries,
  onToggleDay,
  onChangeStartTime,
  onChangeEndTime,
  onAddEntry,
  onRemoveEntry,
  onSave,
}: BasicScheduleSectionProps) {
  return (
    <div>
      <p className="schedule-section-desc">매주 반복되는 레슨 시간을 수정하세요.</p>
      <BasicScheduleForm
        isLoading={isLoading}
        selectedDays={selectedDays}
        startTime={startTime}
        endTime={endTime}
        entries={entries}
        onToggleDay={onToggleDay}
        onChangeStartTime={onChangeStartTime}
        onChangeEndTime={onChangeEndTime}
        onAddEntry={onAddEntry}
        onRemoveEntry={onRemoveEntry}
        onSave={onSave}
      />
    </div>
  );
}
