import type { TutorProfile } from '@/domain/tutor/api/types.ts';
import { api } from '../../../shared/lib/api.ts';

export interface TutorSearchParams {
  regionCodes?: string[];
  lessonCodes?: string[];
  sortType?: string;
}

export async function fetchTutors(params: TutorSearchParams): Promise<TutorProfile[]> {
  return api.post<TutorProfile[]>('/api/tutors/search', params);
}
