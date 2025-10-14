// src/domain/availability/hooks/useWeeklyAvailability.ts
import { useState } from 'react';
import type { WeeklyAvailability, TimeRange, DayOfWeek } from '../types/availability.ts';
import { isValidRange, hasOverlap } from '../lib/timeUtils.ts';

export function useWeeklyAvailability(initial?: WeeklyAvailability) {
  const [availability, setAvailability] = useState<WeeklyAvailability>(initial ?? { items: [] });

  /** 요일별 ranges 가져오기 */
  function getRanges(dayOfWeek: DayOfWeek): TimeRange[] {
    return availability.items.find((i) => i.dayOfWeek === dayOfWeek)?.ranges ?? [];
  }

  /** 구간 추가 */
  function addRange(dayOfWeek: DayOfWeek, range: TimeRange): boolean {
    if (!isValidRange(range.startTime, range.endTime)) return false;

    const ranges = [...getRanges(dayOfWeek), range];
    if (hasOverlap(ranges)) return false;

    upsertItem(dayOfWeek, ranges);
    return true;
  }

  /** 구간 삭제 */
  function removeRange(dayOfWeek: DayOfWeek, index: number) {
    const ranges = getRanges(dayOfWeek).filter((_, i) => i !== index);
    upsertItem(dayOfWeek, ranges);
  }

  /** 구간 수정 */
  function updateRange(dayOfWeek: DayOfWeek, index: number, range: TimeRange): boolean {
    if (!isValidRange(range.startTime, range.endTime)) return false;

    const ranges = getRanges(dayOfWeek).map((r, i) => (i === index ? range : r));
    if (hasOverlap(ranges)) return false;

    upsertItem(dayOfWeek, ranges);
    return true;
  }

  /** 내부 helper */
  function upsertItem(dayOfWeek: DayOfWeek, ranges: TimeRange[]) {
    setAvailability((prev) => {
      const others = prev.items.filter((i) => i.dayOfWeek !== dayOfWeek);
      return { items: [...others, { dayOfWeek, ranges }] };
    });
  }

  return {
    availability,
    getRanges,
    addRange,
    removeRange,
    updateRange,
    setAvailability,
  };
}
