export type LessonStatus = 'REQUESTED' | 'ACTIVE' | 'COMPLETED' | 'CANCELED' | 'EXPIRED' | 'CANDIDATE';

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
  pendingLessonCount?: number;
};

export const statusStyle: Record<
  LessonStatus,
  { bg: string; dot: string; text: string; border: string; label: string }
> = {
  REQUESTED: {
    bg: '#F3F0FF',
    dot: '#6B4EFF',
    text: '#6B4EFF',
    border: '#6B4EFF',
    label: '신청',
  },
  ACTIVE: {
    bg: '#E8F3FF',
    dot: '#0075FF',
    text: '#0075FF',
    border: '#0075FF',
    label: '확정',
  },
  COMPLETED: {
    bg: '#E6FAF5',
    dot: '#00B386',
    text: '#00B386',
    border: '#00B386',
    label: '완료',
  },
  CANCELED: {
    bg: '#FFF0F1',
    dot: '#F04452',
    text: '#F04452',
    border: '#F04452',
    label: '취소',
  },
  EXPIRED: {
    bg: '#F2F4F6',
    dot: '#8B95A1',
    text: '#8B95A1',
    border: '#8B95A1',
    label: '만료',
  },
  CANDIDATE: {
    bg: '#F5F3FF',
    dot: '#A855F7',
    text: '#7E22CE',
    border: '#A855F7',
    label: '체험 신청(잠정)',
  },
};
