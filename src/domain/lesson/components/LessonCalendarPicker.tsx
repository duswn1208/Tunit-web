import { useEffect, useState } from 'react';
import InlineDateTimePicker from '../../../components/InlineDateTimePicker';
import { fetchLessonCalendarStatus } from '../../mypage/api/lessonScheduleApi';
import type { LessonCalendarStatusDto } from '../../mypage/api/lessonScheduleApi';

interface LessonCalendarPickerProps {
  teacherId?: number;
  startDate: string;
  endDate: string;
  date?: string;
  time?: string;
  onChange: (date: string, time: string) => void;
}

export default function LessonCalendarPicker({
  teacherId,
  startDate,
  endDate,
  date,
  time,
  onChange,
}: LessonCalendarPickerProps) {
  const [calendarStatus, setCalendarStatus] = useState<LessonCalendarStatusDto | null>(null);
  const [reservedTimes, setReservedTimes] = useState<string[]>([]);
  const [availableTimeRange, setAvailableTimeRange] = useState<{
    start: string;
    end: string;
  } | null>(null);

  useEffect(() => {
    fetchLessonCalendarStatus({ startDate, endDate }, teacherId)
      .then((data) => {
        setCalendarStatus(data);
      })
      .catch(() => setCalendarStatus(null));
  }, [teacherId, startDate, endDate]);

  // 날짜가 선택될 때 예약된 시간 추출
  useEffect(() => {
    if (calendarStatus && date) {
      let fixed: string[] = [];
      let reserved: string[] = [];
      const dayOfWeekNum = new Date(date).getDay();
      if (calendarStatus?.fixedLessonReservations) {
        fixed = calendarStatus.fixedLessonReservations
          .filter((reservation) => reservation.dayOfWeekNum === dayOfWeekNum)
          .map((reservation) => reservation.startTime.slice(0, 5));
      }
      if (calendarStatus?.lessonReservations) {
        reserved = calendarStatus.lessonReservations
          .filter((reservation) => {
            return reservation.date === date;
          })
          .map((reservation) => reservation.startTime.slice(0, 5));
      }

      const allReserved = Array.from(new Set([...fixed, ...reserved]));
      setReservedTimes(allReserved);

      // 날짜에서 요일 구해서 availableTimes에서 조회
      const available = Object.values(calendarStatus.availableTimes).find(
        (v) => v.dayOfWeekNum === dayOfWeekNum
      );
      if (available) {
        setAvailableTimeRange({ start: available.startTime, end: available.endTime });
      } else {
        setAvailableTimeRange(null);
      }
    } else {
      setReservedTimes([]);
      setAvailableTimeRange(null);
    }
  }, [calendarStatus, date]);

  // availableTimes, holidays 등 추가 활용 가능

  // 날짜 비활성화: availableTimes에 없는 날짜는 선택 불가
  const disabledDates = calendarStatus
    ? Object.keys(calendarStatus.availableTimes).length > 0
      ? undefined
      : []
    : [];

  // 시간 버튼 비활성화: 기본 06:00~12:00, availableTimeRange 범위 밖은 disabled

  const timeRange = availableTimeRange || { start: '06:00', end: '24:00' };

  // availableTimes에 포함된 요일만 활성화
  const enabledDayOfWeeks = calendarStatus
    ? Array.from(new Set(Object.values(calendarStatus.availableTimes).map((v) => v.dayOfWeekNum)))
    : [];

  return (
    <InlineDateTimePicker
      date={date}
      time={time}
      reservedTimes={reservedTimes}
      onChange={onChange}
      availableTimeRange={timeRange}
      enabledDayOfWeeks={enabledDayOfWeeks}
    />
  );
}
