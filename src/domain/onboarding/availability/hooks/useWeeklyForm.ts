// src/domain/availability/hooks/useWeeklyForm.ts
import { useMemo, useState } from 'react';
import type { DayOfWeek } from '../types/availability';
import { isValidRange, hasOverlap, toMinutes } from '../lib/timeUtils';

export type Entry = { days: DayOfWeek[]; startTime: string; endTime: string };

const ALL_DAYS: DayOfWeek[] = [1, 2, 3, 4, 5, 6, 7];

export function useWeeklyForm() {
  const [selectedDays, setSelectedDays] = useState<Set<DayOfWeek>>(new Set());
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('12:00');
  const [entries, setEntries] = useState<Entry[]>([]);

  const dayArray = useMemo(() => ALL_DAYS.filter((d) => selectedDays.has(d)), [selectedDays]);

  function toggleDay(d: DayOfWeek) {
    setSelectedDays((prev) => {
      const next = new Set(prev);
      next.has(d) ? next.delete(d) : next.add(d);
      return next;
    });
  }

  function addEntry() {
    const days = dayArray;
    if (days.length === 0) return { ok: false, msg: '요일을 선택해주세요.' };
    if (!isValidRange(startTime, endTime))
      return { ok: false, msg: '시작이 종료보다 빨라야 합니다.' };

    for (const d of days) {
      const dayRanges = flattenToDayRanges(entries, d);
      const nextRanges = [...dayRanges, { startTime, endTime }];
      if (hasOverlap(nextRanges)) return { ok: false, msg: '겹치는 시간대가 있습니다.' };
    }
    setEntries((prev) => [...prev, { days, startTime, endTime }]);
    return { ok: true as const };
  }

  function removeEntry(idx: number) {
    setEntries((prev) => prev.filter((_, i) => i !== idx));
  }

  function saveToLocalStorage() {
    const items = flattenAll(entries);
    setAvailability(JSON.stringify(items));
  }

  return {
    // state
    selectedDays,
    startTime,
    endTime,
    entries,
    // derived
    dayArray,
    // setters
    setStartTime,
    setEndTime,
    toggleDay,
    // actions
    addEntry,
    removeEntry,
    saveToLocalStorage,
  };
}

// 유틸 (폼 내부 전개용) — 필요 시 lib로 분리 가능
import type { Entry as _Entry } from './useWeeklyForm';
import type { DayOfWeek as _DayOfWeek } from '../types/availability';
import { setAvailability } from '../../../../lib/onboarding';
function flattenToDayRanges(entries: _Entry[], day: _DayOfWeek) {
  return entries
    .filter((e) => e.days.includes(day))
    .map((e) => ({ startTime: e.startTime, endTime: e.endTime }))
    .sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime));
}
function flattenAll(entries: _Entry[]) {
  const items: { dayOfWeek: _DayOfWeek; startTime: string; endTime: string }[] = [];
  for (const e of entries)
    for (const d of e.days)
      items.push({ dayOfWeek: d, startTime: e.startTime, endTime: e.endTime });
  return items;
}
