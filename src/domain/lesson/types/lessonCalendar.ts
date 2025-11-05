export type LessonStatus = 'REQUESTED' | 'ACTIVE' | 'COMPLETED' | 'CANCELED' | 'EXPIRED';

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
  { bg: string; dot: string; text: string; border: string; label: string }
> = {
  REQUESTED: {
    bg: '#FFFBEB', // amber-50
    dot: '#F59E0B', // amber-500
    text: '#78350F', // amber-900
    border: '#FBBF24', // amber-400
    label: '레슨 신청',
  },
  ACTIVE: {
    bg: '#ECFEFF', // cyan-50
    dot: '#06B6D4', // cyan-500
    text: '#0E7490', // cyan-700
    border: '#67E8F9', // cyan-300
    label: '레슨 확정',
  },
  COMPLETED: {
    bg: '#F0FDF4', // green-50
    dot: '#10B981', // emerald-500
    text: '#065F46', // emerald-900
    border: '#86EFAC', // green-300
    label: '완료',
  },
  CANCELED: {
    bg: '#FEF2F2', // red-50
    dot: '#EF4444', // red-500
    text: '#7F1D1D', // red-900
    border: '#FECACA', // red-200
    label: '취소',
  },
  EXPIRED: {
    // 만료
    bg: '#F9FAFB', // gray-50
    dot: '#9CA3AF', // gray-400
    text: '#374151', // gray-700
    border: '#E5E7EB', // gray-200
    label: '만료/노쇼',
  },
};
