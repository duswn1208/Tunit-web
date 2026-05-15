import { api } from '@/shared/lib/api';

export type CareerHistoryType = 'EDUCATION' | 'CERTIFICATION' | 'AWARD' | 'CAREER';

export const CAREER_HISTORY_TYPE_LABEL: Record<CareerHistoryType, string> = {
  EDUCATION: '학력',
  CERTIFICATION: '자격증',
  AWARD: '수상이력',
  CAREER: '재직경험',
};

export interface CareerHistory {
  tutorCareerHistoryNo: number;
  type: CareerHistoryType;
  title: string;
  subTitle?: string | null;
  startDate?: string | null; // YYYY-MM-DD
  endDate?: string | null;
  description?: string | null;
  displayOrder: number;
}

export interface CareerHistorySaveDto {
  type: CareerHistoryType;
  title: string;
  subTitle?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  description?: string | null;
  displayOrder?: number;
}

export function fetchCareerHistory(tutorProfileNo: number) {
  return api.get<CareerHistory[]>(`/api/tutor/career-history/${tutorProfileNo}`);
}

export function addCareerHistory(dto: CareerHistorySaveDto) {
  return api.post<number>(`/api/tutor/career-history`, dto);
}

export function replaceAllCareerHistory(list: CareerHistorySaveDto[]) {
  return api.put<void>(`/api/tutor/career-history`, list);
}

export function deleteCareerHistory(tutorCareerHistoryNo: number) {
  return api.delete<void>(`/api/tutor/career-history/${tutorCareerHistoryNo}`);
}
