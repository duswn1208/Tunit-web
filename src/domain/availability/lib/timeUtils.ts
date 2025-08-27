// src/domain/availability/lib/timeUtils.ts

/**
 * HH:mm 문자열 → 분 단위 정수
 * 예: "09:30" → 570
 */
export function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

/**
 * 분 단위 정수 → HH:mm 문자열
 * 예: 570 → "09:30"
 */
export function toHHMM(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

/**
 * startTime < endTime 유효성 체크
 */
export function isValidRange(startTime: string, endTime: string): boolean {
  return toMinutes(startTime) < toMinutes(endTime);
}

/**
 * 구간 겹침 검사 (반열림 [start, end) 기준)
 */
export function hasOverlap(ranges: { startTime: string; endTime: string }[]): boolean {
  if (ranges.length <= 1) return false;

  const sorted = [...ranges].sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime));

  let prevEnd = toMinutes(sorted[0].endTime);
  for (let i = 1; i < sorted.length; i++) {
    const curStart = toMinutes(sorted[i].startTime);
    const curEnd = toMinutes(sorted[i].endTime);

    if (curStart < prevEnd) return true; // 겹침
    prevEnd = Math.max(prevEnd, curEnd);
  }
  return false;
}
