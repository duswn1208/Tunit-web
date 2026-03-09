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
  thisWeekLessonCount: number;
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
    bg: '#F5F3FF',
    dot: '#8B5CF6',
    text: '#5B21B6',
    border: '#8B5CF6',
    label: '레슨 신청',
  },
  ACTIVE: {
    bg: '#EFF6FF',
    dot: '#3B82F6',
    text: '#1E40AF',
    border: '#3B82F6',
    label: '레슨 확정',
  },
  COMPLETED: {
    bg: '#F0FDF4',
    dot: '#22C55E',
    text: '#166534',
    border: '#22C55E',
    label: '완료',
  },
  CANCELED: {
    bg: '#FFF1F2',
    dot: '#F87171',
    text: '#9F1239',
    border: '#F87171',
    label: '취소',
  },
  EXPIRED: {
    bg: '#F8FAFC',
    dot: '#94A3B8',
    text: '#475569',
    border: '#94A3B8',
    label: '만료/노쇼',
  },
};
