import { describe, it, expect } from 'vitest';
import { toMinutes, toHHMM, isValidRange, hasOverlap, toAmPmFormat } from '../timeUtils';

describe('toMinutes', () => {
  it('"09:30" → 570', () => {
    expect(toMinutes('09:30')).toBe(570);
  });

  it('"00:00" → 0 (자정)', () => {
    expect(toMinutes('00:00')).toBe(0);
  });

  it('"23:59" → 1439 (하루 최대)', () => {
    expect(toMinutes('23:59')).toBe(1439);
  });

  it('"12:00" → 720', () => {
    expect(toMinutes('12:00')).toBe(720);
  });
});

describe('toHHMM', () => {
  it('570 → "09:30"', () => {
    expect(toHHMM(570)).toBe('09:30');
  });

  it('0 → "00:00"', () => {
    expect(toHHMM(0)).toBe('00:00');
  });

  it('1439 → "23:59"', () => {
    expect(toHHMM(1439)).toBe('23:59');
  });

  it('toMinutes와 역변환이 항등원이다', () => {
    expect(toHHMM(toMinutes('14:30'))).toBe('14:30');
    expect(toHHMM(toMinutes('08:05'))).toBe('08:05');
  });
});

describe('isValidRange', () => {
  it('시작 < 종료이면 true', () => {
    expect(isValidRange('09:00', '10:00')).toBe(true);
  });

  it('시작 === 종료이면 false', () => {
    expect(isValidRange('09:00', '09:00')).toBe(false);
  });

  it('시작 > 종료이면 false', () => {
    expect(isValidRange('10:00', '09:00')).toBe(false);
  });
});

describe('hasOverlap', () => {
  it('구간이 0개이면 false', () => {
    expect(hasOverlap([])).toBe(false);
  });

  it('구간이 1개이면 false', () => {
    expect(hasOverlap([{ startTime: '09:00', endTime: '10:00' }])).toBe(false);
  });

  it('겹치지 않는 구간 2개 — false', () => {
    expect(
      hasOverlap([
        { startTime: '09:00', endTime: '10:00' },
        { startTime: '11:00', endTime: '12:00' },
      ]),
    ).toBe(false);
  });

  it('끝과 시작이 딱 붙은 인접 구간 — 겹치지 않는다 ([start, end) 기준)', () => {
    expect(
      hasOverlap([
        { startTime: '09:00', endTime: '10:00' },
        { startTime: '10:00', endTime: '11:00' },
      ]),
    ).toBe(false);
  });

  it('1분이라도 겹치면 true', () => {
    expect(
      hasOverlap([
        { startTime: '09:00', endTime: '10:30' },
        { startTime: '10:00', endTime: '11:00' },
      ]),
    ).toBe(true);
  });

  it('한 구간이 다른 구간을 완전히 포함하면 true', () => {
    expect(
      hasOverlap([
        { startTime: '09:00', endTime: '12:00' },
        { startTime: '10:00', endTime: '11:00' },
      ]),
    ).toBe(true);
  });

  it('입력 순서가 뒤집혀 있어도 겹침을 감지한다', () => {
    expect(
      hasOverlap([
        { startTime: '10:00', endTime: '11:00' },
        { startTime: '09:00', endTime: '10:30' },
      ]),
    ).toBe(true);
  });

  it('비겹침 구간 3개 — false', () => {
    expect(
      hasOverlap([
        { startTime: '09:00', endTime: '10:00' },
        { startTime: '11:00', endTime: '12:00' },
        { startTime: '13:00', endTime: '14:00' },
      ]),
    ).toBe(false);
  });

  it('3개 중 마지막 두 구간이 겹치면 true', () => {
    expect(
      hasOverlap([
        { startTime: '09:00', endTime: '10:00' },
        { startTime: '11:00', endTime: '13:00' },
        { startTime: '12:00', endTime: '14:00' },
      ]),
    ).toBe(true);
  });
});

describe('toAmPmFormat', () => {
  it('빈 문자열이면 빈 문자열 반환', () => {
    expect(toAmPmFormat('')).toBe('');
  });

  it('"09:00" → "오전 9시"', () => {
    expect(toAmPmFormat('09:00')).toBe('오전 9시');
  });

  it('"09:30" → "오전 9시 30분"', () => {
    expect(toAmPmFormat('09:30')).toBe('오전 9시 30분');
  });

  it('"12:00" → "오후 12시"', () => {
    expect(toAmPmFormat('12:00')).toBe('오후 12시');
  });

  it('"13:00:00" — 초 포함 포맷도 처리한다 → "오후 1시"', () => {
    expect(toAmPmFormat('13:00:00')).toBe('오후 1시');
  });

  it('"00:00" → "오전 12시" (자정)', () => {
    expect(toAmPmFormat('00:00')).toBe('오전 12시');
  });

  it('"23:30" → "오후 11시 30분"', () => {
    expect(toAmPmFormat('23:30')).toBe('오후 11시 30분');
  });
});
