import { api } from '../../../shared/lib/api.ts';

export interface TutorSearchParams {
  regionCodes?: string[];
  lessonCodes?: string[];
  // 필요시 추가 필터
}

export interface TutorProfile {
  id: number;
  name: string;
  // ... 기타 프로필 필드
}

export async function fetchTutors(params: TutorSearchParams): Promise<TutorProfile[]> {
  return api.post<TutorProfile[]>('/api/tutors/search', params);
}
