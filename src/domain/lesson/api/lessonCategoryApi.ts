import { api } from '../../../shared/lib/api.ts';

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
  const categories = await api.get<TutorLessonsCategory[]>('/api/lessons/tutor/categories');
  if (!categories) return [];
  return categories;
}
