export const LessonType = {
  SINGLE: 'single',
  FIXED: 'fixed',
} as const;

export type LessonType = (typeof LessonType)[keyof typeof LessonType];

export const LessonStatus = {
  REQUESTED: 'REQUESTED',
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
  CANCELED: 'CANCELED',
  EXPIRED: 'EXPIRED',
} as const;

export type LessonStatus = (typeof LessonStatus)[keyof typeof LessonStatus];

export const LessonStatusLabel: Record<LessonStatus, string> = {
  REQUESTED: '레슨 대기',
  ACTIVE: '레슨 확정',
  COMPLETED: '완료',
  CANCELED: '취소',
  EXPIRED: '자동 만료',
};
