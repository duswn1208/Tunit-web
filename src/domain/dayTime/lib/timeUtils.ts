// src/domain/availability/lib/timeUtils.ts

import { getDayLabelFromDate } from '@/shared/constants/date';

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

/**
 * 24시간 형식의 시간을 12시간 형식으로 변환 (내부 헬퍼 함수)
 * @param hour - 0~23 사이의 시간
 * @param minute - 0~59 사이의 분
 * @returns { period: '오전' | '오후', hour12: number, minute: number }
 */
function to12HourFormat(hour: number, minute: number) {
  const period = hour < 12 ? '오전' : '오후';
  const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return { period, hour12, minute };
}

/**
 * HH:mm:ss 또는 HH:mm 문자열을 12시간 형식으로 변환
 * 예: "13:00:00" → "오후 1시"
 *     "09:30" → "오전 9시 30분"
 *     "13:00" → "오후 1시"
 */
export function toAmPmFormat(time: string): string {
  if (!time) return '';
  const parts = time.split(':');
  const hour = parseInt(parts[0], 10);
  const minute = parts[1] ? parseInt(parts[1], 10) : 0;

  const { period, hour12 } = to12HourFormat(hour, minute);

  if (minute === 0) {
    return `${period} ${hour12}시`;
  }
  return `${period} ${hour12}시 ${minute}분`;
}

/**
 * Date 객체 또는 ISO 문자열을 한국어 날짜/시간 형식으로 변환
 * 예: "2025-11-05T14:30:00" → "2025년 11월 5일 (화) 오후 2시 30분"
 */
export function toKoreanDateTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();
  const hours = dateObj.getHours();
  const minutes = dateObj.getMinutes();
  const dayOfWeek = getDayLabelFromDate(dateObj);

  const { period, hour12 } = to12HourFormat(hours, minutes);
  const minuteStr = minutes === 0 ? '' : ` ${minutes}분`;

  return `${year}년 ${month}월 ${day}일 (${dayOfWeek}) ${period} ${hour12}시${minuteStr}`;
}
