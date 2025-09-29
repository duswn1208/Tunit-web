import { api } from '@/lib/api';

export type TutorDetailResponse = {
  id: number;
  name: string;
  profileImage?: string;
  certification: string[];
  introduction: string;
  experience: number;
  majorSubjects: string[];
  teachingStyle: string;
  specialties: string[];
};

export async function fetchTutorDetail(tutorId: number): Promise<TutorDetailResponse> {
  return api<TutorDetailResponse>(`/api/tutors/${tutorId}`, {
    method: 'GET',
  });
}
