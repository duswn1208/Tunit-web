import { api } from '../../../shared/lib/api.ts';

export interface MyScheduleRequest {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
}

export interface HolidayInfo {
  date: string;
  reason?: string;
}

export interface AvailableTimeInfo {
  dayOfWeek: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
  dayOfWeekNum: number;
  startTime: string;
  endTime: string;
}

export interface ReservedTimeInfo {
  date: string;
  startTime: string;
  endTime: string;
  lessonReservationNo?: number;
}

export interface FixedLessonReservationInfo {
  dayOfWeekNum: number;
  startTime: string;
  endTime: string;
  startDate: string;
  fixedLessonReservationNo?: number;
}

export interface TutorScheduleResponse {
  holidays: HolidayInfo[];
  availableTimes: AvailableTimeInfo[];
  lessonReservations: ReservedTimeInfo[];
  fixedLessonReservations: FixedLessonReservationInfo[];
}

export async function fetchTutorMySchedule(
  params: MyScheduleRequest
): Promise<TutorScheduleResponse> {
  return api.get<TutorScheduleResponse>('/api/lessons/schedule/me', {
    params: {
      startDate: params.startDate,
      endDate: params.endDate,
    },
  });
}
