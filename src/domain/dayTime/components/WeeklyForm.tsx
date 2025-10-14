import DayChips from './DayChips.tsx';
import TimeInputs from './TimeInputs.tsx';
import EntryList from './EntryList.tsx';
import Header from '@/shared/components/Header.tsx';

import type { useWeeklyForm } from '../hooks/useWeeklyForm.ts';

type WeeklyFormProps = ReturnType<typeof useWeeklyForm>;

export default function WeeklyForm({
  selectedDays,
  startTime,
  endTime,
  entries,
  setStartTime,
  setEndTime,
  toggleDay,
  addEntry,
  removeEntry,
}: WeeklyFormProps) {
  const handleAdd = () => {
    const r = addEntry();
    if (r && !r.ok) alert(r.msg);
  };

  return (
    <section>
      <Header title="수업 가능한 요일을 선택해주세요" subtitle="(중복선택 가능)" />
      <DayChips multi={true} selected={selectedDays} onToggle={toggleDay} />
      <Header title="수업 가능한 시간 범위를 입력해주세요" />
      <TimeInputs
        startTime={startTime}
        endTime={endTime}
        onChangeStart={setStartTime}
        onChangeEnd={setEndTime}
        onAdd={handleAdd}
      />

      <Header title="등록한 구간이 맞나요?" />
      <EntryList entries={entries} onRemove={removeEntry} />
    </section>
  );
}
