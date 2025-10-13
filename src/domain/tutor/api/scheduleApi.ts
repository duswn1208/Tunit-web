import { api } from '@/lib/api';

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

export async function fetchTutorSchedule(
  tutorId: string,
  startDate: string,
  endDate: string
): Promise<TutorScheduleResponse> {
  return api.get<TutorScheduleResponse>('/api/tutors/schedule', {
    params: {
      tutorProfileNo: tutorId,
      startDate,
      endDate,
    },
  });
}
