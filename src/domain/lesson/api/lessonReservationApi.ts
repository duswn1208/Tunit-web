export interface LessonReservationInfo {
  lessonDate?: string;
  date?: string;
  startTime?: string;
  tutorLessonNo?: string | number;
  lessonCategory: {
    label: string;
    code: string;
  };
  [key: string]: any;
}
import { api } from '../../../shared/lib/api';

export async function fetchLessonReservationInfo(lessonReservationNo: string) {
  if (!lessonReservationNo) throw new Error('lessonReservationNo is required');
  return await api.get(`/api/lessons/info/${lessonReservationNo}`);
}
