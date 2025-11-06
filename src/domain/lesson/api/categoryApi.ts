import { api } from '../../../shared/lib/api.ts';
import type { Category, SubCategory } from '../../onboarding/types/onboarding.ts';

const MAIN_CATEGORIES_URL = '/api/lessons/categories';
const SUB_CATEGORIES_URL = (mainCode: string) =>
  `/api/lessons/categories/${encodeURIComponent(mainCode)}/subcategories`;

export function getMainLessonCategory<T extends Category = Category>() {
  return api.get<T[]>(MAIN_CATEGORIES_URL);
}

export function getSubLessonCategory<T extends SubCategory = SubCategory>(mainCode: string) {
  return api.get<T[]>(SUB_CATEGORIES_URL(mainCode));
}

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
