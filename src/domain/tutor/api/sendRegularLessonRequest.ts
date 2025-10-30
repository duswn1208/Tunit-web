import { api } from '@/shared/lib/api';

export interface RegularLessonRequestPayload {
  tutorProfileNo: string;
  contractType: 'REGULAR' | 'FIRSTCOME';
  lessonCategory: string;
  place: string;
  slots: Array<{ date: string; time: string }>;
  lessonLevel: string;
  phoneNumber: string;
  memo?: string;
}

export async function sendRegularLessonRequest(payload: RegularLessonRequestPayload) {
  return await api.post('/api/lessons/regular/request', payload);
}
