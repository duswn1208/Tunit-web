export type LessonStatus = 'CONFIRMED' | 'PENDING' | 'CANCELED';

export type LessonEvent = {
  studentName: string;
  status: 'REQUESTED | ACTIVE | COMPLETED | CANCELED | EXPIRED | TRAIL_REQUESTED | TRIAL_ACTIVE | TRIAL_COMPLETED';
  date: Date;
  start: Date;
  end: Date;
  allDay?: boolean;
  title: string;
};

export type LessonSummary = {
  todayLessonCount: number;
  thisWeekAfterTodayLessonCount: number;
  nextWeekLessonCount: number;
  thisMonthLessonCount: number;
  totalLessonCount: number;
  lessonList: LessonEvent[];
};

export const statusStyle: Record<
  LessonStatus,
  { bg: string; dot: string; text: string; border: string }
> = {
  CONFIRMED: { bg: '#effaf0', dot: '#16a34a', text: '#14532d', border: '#22c55e' },
  PENDING: { bg: '#fff7ed', dot: '#f97316', text: '#7c2d12', border: '#fb923c' },
  CANCELED: { bg: '#f9fafb', dot: '#ef4444', text: '#6b7280', border: '#e5e7eb' },
};

export const colorMap: Record<string, string> = {
  REQUESTED: 'var(--brand-mint)',
  ACTIVE: 'var(--brand-chip)',
  CANCELED: 'var(--brand-gray)',
  EXPIRED: 'var(--brand-gray)',
  NOSHOW: 'var(--brand-gray)',
};
