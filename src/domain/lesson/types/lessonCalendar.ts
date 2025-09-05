export type LessonStatus = 'CONFIRMED' | 'PENDING' | 'CANCELED';

export interface LessonEvent {
  id: string | number;
  title: string; // 학생명 등 짧은 텍스트
  start: Date;
  end: Date;
  allDay?: boolean;
  status: LessonStatus;
  memo?: string;
  resource?: any;
}

export const statusStyle: Record<
  LessonStatus,
  { bg: string; dot: string; text: string; border: string }
> = {
  CONFIRMED: { bg: '#effaf0', dot: '#16a34a', text: '#14532d', border: '#22c55e' },
  PENDING: { bg: '#fff7ed', dot: '#f97316', text: '#7c2d12', border: '#fb923c' },
  CANCELED: { bg: '#f9fafb', dot: '#ef4444', text: '#6b7280', border: '#e5e7eb' },
};
