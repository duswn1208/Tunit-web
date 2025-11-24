import { useQuery } from '@tanstack/react-query';
import { fetchTutorDetail } from '../api/tutorApi';
import type { TutorDetail } from '../api/types';

export function useTutorDetail(tutorIdParam: string) {
  const tutorId = Number(tutorIdParam);
  return useQuery<TutorDetail>({
    queryKey: ['tutor', tutorId],
    queryFn: () => fetchTutorDetail(tutorId),
    enabled: Boolean(tutorIdParam) && !isNaN(tutorId),
  });
}
