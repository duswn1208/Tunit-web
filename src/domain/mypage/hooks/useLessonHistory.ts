import { useState, useEffect } from 'react';
import { api } from '@/shared/lib/api';

export default function useLessonHistory(
  _status: string[] | string, // 더 이상 사용하지 않음
  refreshKey?: number,
  lessonFilter?: string
) {
  const [lessons, setLessons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchLessons = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let url = '/api/students/lessons/my';
        if (lessonFilter) {
          url += `?lessonFilter=${encodeURIComponent(lessonFilter)}`;
        }
        const response = await api.get<any[]>(url);
        setLessons(response);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch lessons'));
      } finally {
        setIsLoading(false);
      }
    };
    fetchLessons();
  }, [lessonFilter, refreshKey]);

  return {
    lessons,
    isLoading,
    error,
  };
}
