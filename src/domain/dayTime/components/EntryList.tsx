import type { Entry } from '../hooks/useWeeklyForm.ts';
import Button from '@/shared/components/Button.tsx';
import { DAY_LABELS } from '@/shared/constants/date.ts';

interface Props {
  entries: Entry[];
  onRemove: (idx: number) => void;
}
export default function EntryList({ entries, onRemove }: Props) {
  if (entries.length === 0)
    return <div className="px-6 text-sm text-gray-500">아직 등록된 구간이 없습니다.</div>;
  return (
    <ul className="flex flex-col gap-2 px-2">
      {entries.map((e, idx) => (
        <li key={idx} className="flex items-center justify-between border rounded px-3 py-2">
          <div className="text-sm">
            <span className="font-medium">{e.days.map((d) => DAY_LABELS[d]).join(', ')}</span>{' '}
            {e.startTime} ~ {e.endTime}
          </div>
          <Button onClick={() => onRemove(idx)}>삭제</Button>
        </li>
      ))}
    </ul>
  );
}
