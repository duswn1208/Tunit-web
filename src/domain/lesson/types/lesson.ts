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
  TRIAL_REQUESTED: 'TRIAL_REQUESTED',
  TRIAL_CANCELED: 'TRIAL_CANCELED',
  TRIAL_ACTIVE: 'TRIAL_ACTIVE',
  TRIAL_COMPLETED: 'TRIAL_COMPLETED',
} as const;

export type LessonStatus = (typeof LessonStatus)[keyof typeof LessonStatus];

export const LessonStatusLabel: Record<LessonStatus, string> = {
  REQUESTED: '레슨 대기',
  ACTIVE: '레슨 확정',
  COMPLETED: '완료',
  CANCELED: '취소',
  EXPIRED: '자동 만료',
  TRIAL_REQUESTED: '체험/상담 신청',
  TRIAL_CANCELED: '체험/상담 취소',
  TRIAL_ACTIVE: '체험/상담 확정',
  TRIAL_COMPLETED: '체험/상담 완료',
};
