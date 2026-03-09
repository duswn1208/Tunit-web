import DayChips from '@/domain/dayTime/components/DayChips';
import TimeInputs from '@/domain/dayTime/components/TimeInputs';
import EntryList from '@/domain/dayTime/components/EntryList';
import Button from '@/shared/components/Button';
import type { Entry } from '@/domain/dayTime/hooks/useWeeklyForm';
import type { DayOfWeekNumber } from '@/shared/constants/date';

interface BasicScheduleFormProps {
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

export default function BasicScheduleForm({
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
}: BasicScheduleFormProps) {
  if (isLoading) {
    return <div className="schedule-form-loading">스케줄을 불러오는 중...</div>;
  }

  return (
    <div className="schedule-form">
      <div className="schedule-form-step">
        <div className="schedule-form-step-label">
          <span className="schedule-form-step-number">1</span>
          <span className="schedule-form-step-title">요일 선택</span>
        </div>
        <DayChips multi={true} selected={selectedDays} onToggle={onToggleDay} />
      </div>

      <div className="schedule-form-step">
        <div className="schedule-form-step-label">
          <span className="schedule-form-step-number">2</span>
          <span className="schedule-form-step-title">시간 설정 후 구간 추가</span>
        </div>
        <TimeInputs
          startTime={startTime}
          endTime={endTime}
          onChangeStart={onChangeStartTime}
          onChangeEnd={onChangeEndTime}
          onAdd={onAddEntry}
        />
      </div>

      <div className="schedule-form-entries">
        <div className="schedule-form-entries-header">
          <span className="schedule-form-entries-title">등록된 구간</span>
          <span className="schedule-form-entries-count">{entries.length}</span>
        </div>
        <EntryList entries={entries} onRemove={onRemoveEntry} />
      </div>

      <div className="schedule-form-footer">
        <Button onClick={onSave} disabled={entries.length === 0}>
          스케줄 변경
        </Button>
      </div>
    </div>
  );
}
