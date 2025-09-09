import { ConstructionIcon } from 'lucide-react';
import { api } from '../../../lib/api';

export interface HolidayInfo {
  date: string; // YYYY-MM-DD
  reason?: string; // 휴무 사유 등
}

export interface AvailableTimeInfo {
  dayOfWeek: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY'; // 0 (일) ~ 6 (토)
  dayOfWeekNum: number;
  startTime: string; // HH:mm:00
  endTime: string; // HH:mm:00
}

export interface ReservedTimeInfo {
  date: string;
  startTime: string; // HH:mm
  lessonReservationNo?: number;
}

export interface LessonCalendarStatusDto {
  holidays: HolidayInfo[];
  availableTimes: AvailableTimeInfo[];
  lessonReservations: ReservedTimeInfo[];
}

export interface LessonScheduleRequest {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
}

export async function fetchLessonCalendarStatus(
  body: LessonScheduleRequest,
  teacherId?: number
): Promise<LessonCalendarStatusDto> {
  const url = teacherId
    ? `/api/lessons/schedule/info?tutorProfileNo=${teacherId}&startDate=${body.startDate}&endDate=${body.endDate}`
    : `/api/lessons/schedule/info?startDate=${body.startDate}&endDate=${body.endDate}`;
  return api<LessonCalendarStatusDto>(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
}
