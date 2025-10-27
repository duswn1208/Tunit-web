import { useState, useEffect } from 'react';
import { api } from '@/shared/lib/api';

// API 응답이 배열 형태일 때 타입 정의
export type Lesson = {
  lessonReservationNo: number;
  lessonDate: string;
  startTime: string;
  status: {
    label: string;
    name: string;
  };
  lessonCategory: {
    label: string;
    code: string;
  };
  tutorProfile: {
    userNo: number;
    tutorProfileNo: number;
    lessonSubcategoryList: {
      tutorLessonNo: number;
      lessonCategory: {
        isMain: boolean;
        lessonCategory: {
          label: string;
          code: string;
        };
      };
    }[];
  };
  // 필요시 추가 필드
};
export interface LessonHistoryResponse {
  lessons: Lesson[];
}

export default function useLessonHistory(status: string[] | string) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchLessons = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const statusParam = Array.isArray(status) ? status.join(',') : status;
        const response = await api.get<Lesson[]>(`/api/students/lessons/my?status=${statusParam}`);
        setLessons(response);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch lessons'));
      } finally {
        setIsLoading(false);
      }
    };
    fetchLessons();
  }, [status]);

  return {
    lessons,
    isLoading,
    error,
  };
}
