import { api } from '../../../shared/lib/api.ts';
import type { TutorProfile } from '../components/TutorProfileCard';

export interface TutorSearchParams {
  regionCodes?: string[];
  lessonCodes?: string[];
  sortType?: string;
}

export async function fetchTutors(params: TutorSearchParams): Promise<TutorProfile[]> {
  return api.post<TutorProfile[]>('/api/tutors/search', params);
}
