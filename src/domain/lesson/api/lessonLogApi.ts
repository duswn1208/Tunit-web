import { api } from '@/shared/lib/api';
import type {
  LessonLogResponse,
  LessonLogCreateRequest,
  LessonLogUpdateRequest,
  UnwrittenLesson,
} from '../types/lessonLog';

const BASE = '/api/lesson-logs';

export const lessonLogApi = {
  create: (data: LessonLogCreateRequest) => api.post<LessonLogResponse>(BASE, data),

  update: (logNo: number, data: LessonLogUpdateRequest) =>
    api.put<LessonLogResponse>(`${BASE}/${logNo}`, data),

  getByLesson: async (lessonReservationNo: number): Promise<LessonLogResponse | null> => {
    const res = await fetch(`${BASE}/lesson/${lessonReservationNo}`, { credentials: 'include' });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },

  registerQuestion: (logNo: number, question: string) =>
    api.post<LessonLogResponse>(`${BASE}/${logNo}/question`, { question }),

  registerReply: (logNo: number, reply: string) =>
    api.post<LessonLogResponse>(`${BASE}/${logNo}/reply`, { reply }),

  getUnwrittenByContract: (contractNo: number) =>
    api.get<UnwrittenLesson[]>(`${BASE}/unwritten/contract/${contractNo}`),
};
