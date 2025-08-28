import DayChips from './DayChips';
import TimeInputs from './TimeInputs';
import EntryList from './EntryList';
import { useWeeklyForm } from '../hooks/useWeeklyForm';
import Header from '../../../../components/Header';

export default function WeeklyForm() {
  const {
    selectedDays,
    startTime,
    endTime,
    entries,
    setStartTime,
    setEndTime,
    toggleDay,
    addEntry,
    removeEntry,
  } = useWeeklyForm();

  const handleAdd = () => {
    const r = addEntry();
    if (r && !r.ok) alert(r.msg);
  };

  return (
    <section>
      <Header title="수업 가능한 요일을 선택해주세요" subtitle="(중복선택 가능)" />
      <DayChips selected={selectedDays} onToggle={toggleDay} />
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
