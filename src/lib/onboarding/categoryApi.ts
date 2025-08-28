import { api } from '../api';
import type { Category, SubCategory } from '../../type/onboarding';

const MAIN_CATEGORIES_URL = '/api/lessons/categories';
const SUB_CATEGORIES_URL = (mainCode: string) =>
  `/api/lessons/categories/${encodeURIComponent(mainCode)}/subcategories`;

export function getMainLessonCategory<T extends Category = Category>() {
  return api<T[]>(MAIN_CATEGORIES_URL);
}

export function getSubLessonCategory<T extends SubCategory = SubCategory>(mainCode: string) {
  return api<T[]>(SUB_CATEGORIES_URL(mainCode));
}
