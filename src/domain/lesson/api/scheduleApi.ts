import { api } from '../../../lib/api';
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
