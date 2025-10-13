import { useQuery } from '@tanstack/react-query';
import { fetchTutorDetail, type TutorDetailResponse } from '../api/tutorApi';

export function useTutorDetail(tutorIdParam: string) {
  const tutorId = Number(tutorIdParam);
  return useQuery<TutorDetailResponse>({
    queryKey: ['tutor', tutorId],
    queryFn: () => fetchTutorDetail(tutorId),
    enabled: Boolean(tutorIdParam) && !isNaN(tutorId),
  });
}
