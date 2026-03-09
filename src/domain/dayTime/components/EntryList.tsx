import type { Entry } from '../hooks/useWeeklyForm.ts';
import { DAY_LABELS } from '@/shared/constants/date.ts';

interface Props {
  entries: Entry[];
  onRemove: (idx: number) => void;
}

export default function EntryList({ entries, onRemove }: Props) {
  if (entries.length === 0)
    return <p className="entry-list-empty">아직 등록된 구간이 없습니다.</p>;

  return (
    <ul className="entry-list">
      {entries.map((e, idx) => (
        <li key={idx} className="entry-list-item">
          <span className="entry-list-text">
            <span className="entry-list-days">{e.days.map((d) => DAY_LABELS[d]).join(', ')}</span>
            <span className="entry-list-time">{e.startTime} ~ {e.endTime}</span>
          </span>
          <button type="button" className="entry-list-remove" onClick={() => onRemove(idx)}>
            삭제
          </button>
        </li>
      ))}
    </ul>
  );
}
