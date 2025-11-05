import { useState, useEffect } from 'react';
import { api } from '@/shared/lib/api';

export default function useLessonHistory(
  _status: string[] | string, // 더 이상 사용하지 않음
  refreshKey?: number,
  lessonFilter?: string,
  contractNo?: number
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
        const params = new URLSearchParams();

        if (lessonFilter) {
          params.append('lessonFilter', lessonFilter);
        }
        if (contractNo) {
          params.append('contractNo', contractNo.toString());
        }

        if (params.toString()) {
          url += `?${params.toString()}`;
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
  }, [lessonFilter, refreshKey, contractNo]);

  return {
    lessons,
    isLoading,
    error,
  };
}
