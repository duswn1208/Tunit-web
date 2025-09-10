import { api } from '../../../lib/api';

export type LessonCategoryCode = {
  code: string;
  label: string;
};

export interface TutorLessonsCategory {
  tutorLessonNo: number;
  lessonCategory: LessonCategoryCode;
  isMain: boolean;
}

export async function fetchLessonCategories(): Promise<TutorLessonsCategory[]> {
  const res = await api('/api/lessons/tutor/categories');
  if (!res) throw new Error('레슨 카테고리 불러오기 실패');
  console.log(res);

  if (Array.isArray(res)) {
    return res as TutorLessonsCategory[];
  }
  return [];
}
