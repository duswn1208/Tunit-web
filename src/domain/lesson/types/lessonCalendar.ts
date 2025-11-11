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
    bg: '#FFF9DB', // 연한 개나리색
    dot: '#FFD60A', // 선명한 개나리색
    text: '#2C2400', // 진한 텍스트
    border: '#FFD60A', // dot과 동일
    label: '레슨 신청',
  },
  ACTIVE: {
    bg: '#E3F2FD', // 연한 파랑
    dot: '#2196F3', // 선명한 파랑
    text: '#0D47A1', // 진한 텍스트
    border: '#2196F3', // dot과 동일
    label: '레슨 확정',
  },
  COMPLETED: {
    bg: '#E8F5E9', // 연한 초록
    dot: '#4CAF50', // 선명한 초록
    text: '#1B5E20', // 진한 텍스트
    border: '#4CAF50', // dot과 동일
    label: '완료',
  },
  CANCELED: {
    bg: '#FFEBEE', // 연한 빨강
    dot: '#F44336', // 선명한 빨강
    text: '#B71C1C', // 진한 텍스트
    border: '#F44336', // dot과 동일
    label: '취소',
  },
  EXPIRED: {
    // 만료
    bg: '#F5F5F5', // 연한 회색
    dot: '#9E9E9E', // 회색
    text: '#424242', // 진한 텍스트
    border: '#9E9E9E', // dot과 동일
    label: '만료/노쇼',
  },
};
