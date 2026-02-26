import { describe, it, expect } from 'vitest';
import {
  DAY_LABELS,
  DAYS_OF_WEEK,
  getDayOfWeekNumber,
  getDayLabel,
  getCalendarRange,
  getDayLabelFromDate,
  DAY_LABELS_FROM_GETDAY,
} from '../date';

describe('DAY_LABELS', () => {
  it('1~7에 대해 월~일 요일을 가진다', () => {
    expect(DAY_LABELS[1]).toBe('월');
    expect(DAY_LABELS[2]).toBe('화');
    expect(DAY_LABELS[3]).toBe('수');
    expect(DAY_LABELS[4]).toBe('목');
    expect(DAY_LABELS[5]).toBe('금');
    expect(DAY_LABELS[6]).toBe('토');
    expect(DAY_LABELS[7]).toBe('일');
  });
});

describe('DAYS_OF_WEEK', () => {
  it('월~일 순서의 7개 요일 배열이다', () => {
    expect(DAYS_OF_WEEK).toEqual(['월', '화', '수', '목', '금', '토', '일']);
    expect(DAYS_OF_WEEK).toHaveLength(7);
  });
});

describe('getDayOfWeekNumber', () => {
  it('index 0 → 1 (월요일)', () => {
    expect(getDayOfWeekNumber(0)).toBe(1);
  });

  it('index 6 → 7 (일요일)', () => {
    expect(getDayOfWeekNumber(6)).toBe(7);
  });
});

describe('getDayLabel', () => {
  it('DayOfWeekNumber를 한글 요일로 변환한다', () => {
    expect(getDayLabel(1)).toBe('월');
    expect(getDayLabel(5)).toBe('금');
    expect(getDayLabel(7)).toBe('일');
  });
});

describe('getCalendarRange', () => {
  it('현재 월의 시작일과 마지막일을 반환한다', () => {
    const { start, end } = getCalendarRange();
    const now = new Date();

    expect(start.getFullYear()).toBe(now.getFullYear());
    expect(start.getMonth()).toBe(now.getMonth());
    expect(start.getDate()).toBe(1);

    expect(end.getFullYear()).toBe(now.getFullYear());
    expect(end.getMonth()).toBe(now.getMonth());
    expect(end.getHours()).toBe(23);
    expect(end.getMinutes()).toBe(59);
    expect(end.getSeconds()).toBe(59);
  });
});

describe('DAY_LABELS_FROM_GETDAY', () => {
  it('일~토 순서로 7개 요일이다', () => {
    expect(DAY_LABELS_FROM_GETDAY).toEqual(['일', '월', '화', '수', '목', '금', '토']);
  });
});

describe('getDayLabelFromDate', () => {
  it('Date 객체에서 한글 요일을 반환한다', () => {
    // 2024-01-01 = 월요일
    const monday = new Date(2024, 0, 1);
    expect(getDayLabelFromDate(monday)).toBe('월');

    // 2024-01-07 = 일요일
    const sunday = new Date(2024, 0, 7);
    expect(getDayLabelFromDate(sunday)).toBe('일');
  });
});
