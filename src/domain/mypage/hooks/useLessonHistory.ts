import { useState, useEffect } from 'react';
import { api } from '@/shared/lib/api';

interface LessonHistoryResponse {
  upcoming: any[];
  past: any[];
  pending: any[];
}

export default function useLessonHistory() {
  const [upcomingLessons, setUpcomingLessons] = useState<any[]>([]);
  const [pastLessons, setPastLessons] = useState<any[]>([]);
  const [pendingLessons, setPendingLessons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await api.get<LessonHistoryResponse>('/api/students/lessons/my');
        setUpcomingLessons(response.upcoming);
        setPastLessons(response.past);
        setPendingLessons(response.pending);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch lessons'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchLessons();
  }, []);

  return {
    upcomingLessons,
    pastLessons,
    pendingLessons,
    isLoading,
    error,
  };
}
