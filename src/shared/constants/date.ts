// 요일 관련 타입과 상수
export type DayOfWeekNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7;

// 요일
export type DayOfWeek =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';

// 기본이 되는 요일 레이블 정의
export const DAY_LABELS: Record<DayOfWeekNumber, string> = {
  1: '월',
  2: '화',
  3: '수',
  4: '목',
  5: '금',
  6: '토',
  7: '일',
} as const;

// DAY_LABELS로부터 요일 배열 생성
export const DAYS_OF_WEEK = Object.values(DAY_LABELS) as readonly string[];

// 요일 레이블 타입
export type DayLabel = (typeof DAYS_OF_WEEK)[number];

// 유틸리티 함수들
export const getDayOfWeekNumber = (index: number): DayOfWeekNumber =>
  (index + 1) as DayOfWeekNumber;

export const getDayLabel = (dayNumber: DayOfWeekNumber): string => DAY_LABELS[dayNumber];

// 날짜 관련 유틸리티 함수
export const getCalendarRange = () => {
  const now = new Date();
  return {
    start: new Date(now.getFullYear(), now.getMonth(), 1),
    end: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59),
  };
};

// JavaScript Date.getDay() 결과(0=일요일)를 요일 레이블로 변환
// 예: 0 → '일', 1 → '월', 6 → '토'
export const DAY_LABELS_FROM_GETDAY = ['일', '월', '화', '수', '목', '금', '토'] as const;

export const getDayLabelFromDate = (date: Date): string => {
  return DAY_LABELS_FROM_GETDAY[date.getDay()];
};
