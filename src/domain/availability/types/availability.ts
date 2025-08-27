// 요일: 1=Mon ... 7=Sun (DB/백엔드와 동일하게 사용)
export type DayOfWeek = 1 | 2 | 3 | 4 | 5 | 6 | 7;

// 시간 구간 (HH:mm 문자열)
export interface TimeRange {
  startTime: string; // '09:00'
  endTime: string; // '12:00'
}

// 요일별 가능 시간 아이템
export interface WeeklyItem {
  dayOfWeek: DayOfWeek;
  ranges: TimeRange[];
}

// 전체 주간 가능 시간
export interface WeeklyAvailability {
  items: WeeklyItem[];
}

// API 요청/응답 DTO
export interface WeeklyAvailabilityRequest {
  items: {
    dayOfWeek: DayOfWeek;
    startTime: string;
    endTime: string;
  }[];
}

export interface WeeklyAvailabilityResponse {
  items: {
    id: number;
    dayOfWeek: DayOfWeek;
    startTime: string;
    endTime: string;
  }[];
}
