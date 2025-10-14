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
}
