import { useMemo, useState } from 'react';
import { type LessonEvent, type LessonStatus } from '../types/lessonCalendar';

export function useLessonFilters(events: LessonEvent[]) {
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState<'ALL' | LessonStatus>('ALL');

  const filtered = useMemo(() => {
    return events.filter((e) => {
      const okStatus = status === 'ALL' || e.status === status;
      const okKeyword = keyword.trim() === '' || e.title.includes(keyword.trim());
      return okStatus && okKeyword;
    });
  }, [events, status, keyword]);

  return { keyword, setKeyword, status, setStatus, filtered } as const;
}
