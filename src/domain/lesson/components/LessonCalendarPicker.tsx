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
        setCalendarStatus(data);
        console.log('Fetched tutor schedule:', data);
      })
      .catch(() => setCalendarStatus(null));
  }, [tutorProfileNo, startDate, endDate]);

  // 날짜가 선택될 때 예약된 시간 추출
  useEffect(() => {
    if (calendarStatus && date) {
      let fixed: string[] = [];
      let reserved: string[] = [];
      let localDisabled: string[] = [];

      // startTime부터 endTime까지 30분 단위로 모든 슬롯 생성
      const generateTimeSlots = (startTime: string, endTime: string): string[] => {
        const slots: string[] = [];
        const [startHour, startMin] = startTime.slice(0, 5).split(':').map(Number);
        const [endHour, endMin] = endTime.slice(0, 5).split(':').map(Number);

        let currentHour = startHour;
        let currentMin = startMin;

        while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
          slots.push(
            `${currentHour.toString().padStart(2, '0')}:${currentMin.toString().padStart(2, '0')}`
          );
          currentMin += 30;
          if (currentMin >= 60) {
            currentMin = 0;
            currentHour += 1;
          }
        }

        return slots;
      };

      // 0(일) ~ 6(토)를 1(월) ~ 7(일)로 변환
      const jsDay = new Date(date).getDay();
      const dayOfWeekNum = jsDay === 0 ? 7 : jsDay;

      // 요일에 해당하는 가용 시간 찾기
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

      // 고정 예약 시간 필터링 (startTime ~ endTime 범위)
      if (calendarStatus?.fixedLessonReservations) {
        const fixedSlots = calendarStatus.fixedLessonReservations
          .filter((reservation) => reservation.dayOfWeekNum === dayOfWeekNum)
          .flatMap((reservation) => generateTimeSlots(reservation.startTime, reservation.endTime));
        fixed = fixedSlots;
      }

      // 일반 예약 시간 필터링 (startTime ~ endTime 범위)
      if (calendarStatus?.lessonReservations) {
        const reservedSlots = calendarStatus.lessonReservations
          .filter((reservation) => reservation.date === date)
          .flatMap((reservation) => generateTimeSlots(reservation.startTime, reservation.endTime));
        reserved = reservedSlots;
      }

      // 방금 예약된 시간 필터링
      if (disabledSlots && disabledSlots.length > 0) {
        localDisabled = disabledSlots
          .filter((slot) => slot.date === date)
          .map((slot) => slot.time.slice(0, 5)); // HH:mm 형식으로 통일
      }

      // 휴무 날짜 필터링
      let holidaySlots: string[] = [];
      if (calendarStatus?.holidayDates) {
        calendarStatus.holidayDates
          .filter((holiday) => holiday.date === date)
          .forEach((holiday) => {
            if (holiday.isAllDay) {
              // 종일 휴무인 경우 해당 날짜의 모든 시간 비활성화
              if (available) {
                const allSlots = generateTimeSlots(available.startTime, available.endTime);
                holidaySlots.push(...allSlots);
              }
            } else if (holiday.startTime && holiday.endTime) {
              // 시간 구간 휴무인 경우 해당 시간만 비활성화
              const slots = generateTimeSlots(holiday.startTime, holiday.endTime);
              holidaySlots.push(...slots);
            }
          });
      }

      // 모든 비활성화할 시간 슬롯을 하나의 배열로 합치고 중복 제거
      const allReserved = Array.from(
        new Set([...fixed, ...reserved, ...localDisabled, ...holidaySlots])
      );
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

  // 종일 휴무 날짜 추출
  const disabledDates =
    calendarStatus?.holidayDates
      ?.filter((holiday) => holiday.isAllDay)
      .map((holiday) => holiday.date) || [];

  return (
    <InlineDateTimePicker
      date={date}
      time={time}
      reservedTimes={reservedTimes}
      onChange={onChange}
      availableTimeRange={timeRange}
      enabledDayOfWeeks={enabledDayOfWeeks}
      disabledDates={disabledDates}
      size={size}
    />
  );
}
