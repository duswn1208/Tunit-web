import { api } from '../../../shared/lib/api.ts';
import type { LessonCalendarStatusDto } from '../types/lessonCalendar.types';

export async function fetchTutorSchedule(
  params: {
    startDate: string;
    endDate: string;
  },
  tutorId?: number
): Promise<LessonCalendarStatusDto> {
  return api.get<LessonCalendarStatusDto>('/api/lessons/tutor/schedule', {
    params: {
      ...(tutorId ? { tutorProfileNo: tutorId } : {}),
      startDate: params.startDate,
      endDate: params.endDate,
    },
  });
}

export async function fetchLessonReservationInfo(lessonReservationNo: string) {
  if (!lessonReservationNo) throw new Error('lessonReservationNo is required');
  return await api.get(`/api/lessons/info/${lessonReservationNo}`);
}
