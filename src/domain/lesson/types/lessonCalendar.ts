export type LessonStatus =
  | 'REQUESTED'
  | 'ACTIVE'
  | 'COMPLETED'
  | 'CANCELED'
  | 'EXPIRED'
  | 'TRIAL_REQUESTED'
  | 'TRIAL_ACTIVE'
  | 'TRIAL_COMPLETED';

export type LessonEvent = {
  studentName: string;
  status: {
    name: LessonStatus;
    label: string;
    allowedNextStatuses: { name: LessonStatus; label: string }[];
  };
  date: Date;
  start: Date;
  end: Date;
  allDay?: boolean;
  title: string;
  category: { label: string; name: string };
  id: number;
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
  REQUESTED: {
    // 접수/대기
    bg: '#FFFBEB', // amber-50
    dot: '#F59E0B', // amber-500
    text: '#78350F', // amber-900
    border: '#FBBF24', // amber-400
  },
  ACTIVE: {
    // 진행 중
    bg: '#ECFEFF', // cyan-50
    dot: '#06B6D4', // cyan-500
    text: '#0E7490', // cyan-700
    border: '#67E8F9', // cyan-300
  },
  COMPLETED: {
    // 완료
    bg: '#F0FDF4', // green-50
    dot: '#10B981', // emerald-500
    text: '#065F46', // emerald-900
    border: '#86EFAC', // green-300
  },
  CANCELED: {
    // 취소
    bg: '#FEF2F2', // red-50
    dot: '#EF4444', // red-500
    text: '#7F1D1D', // red-900
    border: '#FECACA', // red-200
  },
  EXPIRED: {
    // 만료
    bg: '#F9FAFB', // gray-50
    dot: '#9CA3AF', // gray-400
    text: '#374151', // gray-700
    border: '#E5E7EB', // gray-200
  },
  TRIAL_REQUESTED: {
    // 체험 요청
    bg: '#EEF2FF', // indigo-50
    dot: '#6366F1', // indigo-500
    text: '#3730A3', // indigo-800
    border: '#C7D2FE', // indigo-200
  },
  TRIAL_ACTIVE: {
    // 체험 진행
    bg: '#FDF2F8', // pink-50
    dot: '#F472B6', // pink-400
    text: '#831843', // pink-900
    border: '#FBCFE8', // pink-200
  },
  TRIAL_COMPLETED: {
    // 체험 종료
    bg: '#F3E8FF', // violet-50
    dot: '#A78BFA', // violet-400
    text: '#5B21B6', // violet-900
    border: '#DDD6FE', // violet-200
  },
};
