import { useQuery } from '@tanstack/react-query';
import { fetchTutorDetail } from '../api/tutorApi';

export function useTutorDetail(tutorId: number) {
  return useQuery({
    queryKey: ['tutor', tutorId],
    queryFn: () => fetchTutorDetail(tutorId),
  });
}
