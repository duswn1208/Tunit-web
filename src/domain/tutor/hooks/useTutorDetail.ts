import { useQuery } from '@tanstack/react-query';
import { fetchTutorDetail, type TutorDetailResponse } from '../api/tutorApi';

export function useTutorDetail(tutorId: string) {
  return useQuery<TutorDetailResponse>({
    queryKey: ['tutor', tutorId],
    queryFn: () => fetchTutorDetail(tutorId),
    enabled: Boolean(tutorId),
  });
}
