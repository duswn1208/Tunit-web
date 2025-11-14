export interface LessonCalendarStatusDto {
  holidays: {
    date: string;
    reason?: string;
  }[];
  availableTimes: {
    dayOfWeek: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
    dayOfWeekNum: number;
    startTime: string;
    endTime: string;
  }[];
  fixedLessonReservations: {
    dayOfWeekNum: number;
    startTime: string;
    endTime: string;
    startDate: string;
    fixedLessonReservationNo?: number;
  }[];
  lessonReservations: {
    date: string;
    startTime: string;
    endTime: string;
    lessonReservationNo?: number;
  }[];
  holidayDates: {
    date: string;
    type: { code: 'BLOCK' | 'OPEN'; label: string };
    reason?: string;
    startTime?: string;
    endTime?: string;
    isAllDay: boolean;
  }[];
}
