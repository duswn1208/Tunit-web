import type { DayOfWeekNumber } from '@/constants/date';

// 시간 구간 (HH:mm 문자열)
export interface TimeRange {
  startTime: string; // '09:00'
  endTime: string; // '12:00'
}

// 요일별 가능 시간 아이템
export interface WeeklyItem {
  dayOfWeek: DayOfWeekNumber;
  ranges: TimeRange[];
}

// 전체 주간 가능 시간
export interface WeeklyAvailability {
  items: WeeklyItem[];
}

// API 요청/응답 DTO
export interface WeeklyAvailabilityRequest {
  items: {
    dayOfWeek: DayOfWeekNumber;
    startTime: string;
    endTime: string;
  }[];
}

export interface WeeklyAvailabilityResponse {
  items: {
    id: number;
    dayOfWeek: DayOfWeekNumber;
    startTime: string;
    endTime: string;
  }[];
}
