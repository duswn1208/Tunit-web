import DayChips from '@/domain/dayTime/components/DayChips';
import TimeInputs from '@/domain/dayTime/components/TimeInputs';
import EntryList from '@/domain/dayTime/components/EntryList';
import Button from '@/shared/components/Button';
import type { Entry } from '@/domain/dayTime/hooks/useWeeklyForm';
import type { DayOfWeekNumber } from '@/shared/constants/date';
import Header from '@/shared/components/Header';

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
    return (
      <div
        style={{
          background: '#f9fafb',
          padding: '40px',
          borderRadius: '12px',
          textAlign: 'center',
          color: '#999',
        }}
      >
        스케줄을 불러오는 중...
      </div>
    );
  }

  return (
    <div>
      <Header title="요일과 시간을 설정하여 구간추가를 클릭하세요" />
      <DayChips multi={true} selected={selectedDays} onToggle={onToggleDay} />
      <TimeInputs
        startTime={startTime}
        endTime={endTime}
        onChangeStart={onChangeStartTime}
        onChangeEnd={onChangeEndTime}
        onAdd={onAddEntry}
      />

      <Header title="수정한 시간을 확인하세요." />
      <EntryList entries={entries} onRemove={onRemoveEntry} />

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '32px' }}>
        <Button onClick={onSave} disabled={entries.length === 0}>
          스케줄 변경
        </Button>
      </div>
    </div>
  );
}
