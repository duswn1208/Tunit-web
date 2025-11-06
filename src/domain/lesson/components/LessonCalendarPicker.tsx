import { useEffect, useState } from 'react';
import InlineDateTimePicker from '@/shared/components/InlineDateTimePicker';
import { fetchTutorSchedule } from '../api/scheduleApi';
import type { LessonCalendarStatusDto } from '../types/lessonCalendar.types';

interface LessonCalendarPickerProps {
  tutorProfileNo?: number;
  startDate: string;
  endDate: string;
  date?: string;
  time?: string;
  onChange: (date: string, time: string) => void;
  size?: 'small' | 'medium' | 'large';
  disabledSlots?: Array<{ date: string; time: string }>;
}

export default function LessonCalendarPicker({
  tutorProfileNo,
  startDate,
  endDate,
  date,
  time,
  onChange,
  size = 'large',
  disabledSlots = [],
}: LessonCalendarPickerProps) {
  const [calendarStatus, setCalendarStatus] = useState<LessonCalendarStatusDto | null>(null);
  const [reservedTimes, setReservedTimes] = useState<string[]>([]);
  const [availableTimeRange, setAvailableTimeRange] = useState<{
    start: string;
    end: string;
  } | null>(null);

  useEffect(() => {
    fetchTutorSchedule({ startDate, endDate }, tutorProfileNo)
      .then((data: LessonCalendarStatusDto) => {
        console.log('Fetched calendar status:', data);
        setCalendarStatus(data);
      })
      .catch(() => setCalendarStatus(null));
  }, [tutorProfileNo, startDate, endDate]);

  // 날짜가 선택될 때 예약된 시간 추출
  useEffect(() => {
    if (calendarStatus && date) {
      let fixed: string[] = [];
      let reserved: string[] = [];
      let localDisabled: string[] = [];

      // 0(일) ~ 6(토)를 1(월) ~ 7(일)로 변환
      const jsDay = new Date(date).getDay();
      const dayOfWeekNum = jsDay === 0 ? 7 : jsDay;

      // 요일에 해당하는 가용 시간 찾기
      console.log('calendarStatus.availableTimes', calendarStatus);
      const available = calendarStatus.availableTimes?.find((v) => v.dayOfWeekNum === dayOfWeekNum);
      if (available) {
        setAvailableTimeRange((prev) => {
          if (!prev || prev.start !== available.startTime || prev.end !== available.endTime) {
            return { start: available.startTime, end: available.endTime };
          }
          return prev;
        });
      } else {
        setAvailableTimeRange((prev) => (prev !== null ? null : prev));
      }

      // 고정 예약 시간 필터링
      if (calendarStatus?.fixedLessonReservations) {
        fixed = calendarStatus.fixedLessonReservations
          .filter((reservation) => reservation.dayOfWeekNum === dayOfWeekNum)
          .map((reservation) => reservation.startTime.slice(0, 5));
      }

      // 일반 예약 시간 필터링
      if (calendarStatus?.lessonReservations) {
        reserved = calendarStatus.lessonReservations
          .filter((reservation) => reservation.date === date)
          .map((reservation) => reservation.startTime.slice(0, 5));
      }

      // 방금 예약된 시간 필터링
      if (disabledSlots && disabledSlots.length > 0) {
        localDisabled = disabledSlots
          .filter((slot) => slot.date === date)
          .map((slot) => slot.time.slice(0, 5)); // HH:mm 형식으로 통일
      }

      // 모든 비활성화할 시간 슬롯을 하나의 배열로 합치고 중복 제거
      const allReserved = Array.from(new Set([...fixed, ...reserved, ...localDisabled]));
      setReservedTimes((prev) => {
        const prevStr = prev.join(',');
        const nextStr = allReserved.join(',');
        if (prevStr !== nextStr) return allReserved;
        return prev;
      });
    } else {
      setReservedTimes((prev) => (prev.length > 0 ? [] : prev));
      setAvailableTimeRange((prev) => (prev !== null ? null : prev));
    }
  }, [calendarStatus, date, disabledSlots]);

  // 기본 시간 범위 설정 (availableTimeRange가 없는 경우)
  const timeRange = availableTimeRange || { start: '09:00', end: '22:00' };

  // availableTimes에 포함된 요일만 활성화 (0 -> 7로 변환)
  const enabledDayOfWeeks = calendarStatus?.availableTimes
    ? Array.from(
        new Set(
          calendarStatus.availableTimes.map((v) => {
            // 백엔드는 1(월) ~ 7(일)를 사용하므로 그대로 사용
            return v.dayOfWeekNum;
          })
        )
      )
    : [];

  return (
    <InlineDateTimePicker
      date={date}
      time={time}
      reservedTimes={reservedTimes}
      onChange={onChange}
      availableTimeRange={timeRange}
      enabledDayOfWeeks={enabledDayOfWeeks}
      size={size}
    />
  );
}
