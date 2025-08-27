import DayChips from './DayChips';
import TimeInputs from './TimeInputs';
import EntryList from './EntryList';
import { useWeeklyForm } from '../hooks/useWeeklyForm';
import { NextButton } from '../../../components/onboarding';

interface Props {
  onPrev?: () => void;
  onNext?: () => void;
}

export default function WeeklyForm({ onPrev, onNext }: Props) {
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
    saveToLocalStorage,
  } = useWeeklyForm();

  const handleAdd = () => {
    const r = addEntry();
    if (r && !r.ok) alert(r.msg);
  };

  const handleNext = () => {
    if (entries.length === 0) {
      alert('최소 1개 이상의 구간을 등록해주세요.');
      return;
    }
    saveToLocalStorage();
    onNext?.();
  };

  return (
    <div>
      <section>
        <div className="mls-header">
          <h2 className="text-xl" style={{ fontWeight: 700 }}>
            수업 가능한 요일을 선택해주세요
          </h2>
          <div className="mls-sub">(중복선택 가능)</div>
        </div>
        <DayChips selected={selectedDays} onToggle={toggleDay} />
      </section>

      <section>
        <div className="mls-header">
          <h2 className="text-xl" style={{ fontWeight: 700 }}>
            수업 가능한 시간 범위를 입력해주세요
          </h2>
        </div>
        <TimeInputs
          startTime={startTime}
          endTime={endTime}
          onChangeStart={setStartTime}
          onChangeEnd={setEndTime}
          onAdd={handleAdd}
        />
      </section>

      <div className="mls-header">
        <h2 className="text-xl" style={{ fontWeight: 700 }}>
          등록한 구간이 맞나요 ?
        </h2>
      </div>
      <EntryList entries={entries} onRemove={removeEntry} />

      <NextButton
        addClass="ui-btn--full"
        onClick={handleNext}
        disabled={entries.length === 0}
        label="다음"
      ></NextButton>
    </div>
  );
}
