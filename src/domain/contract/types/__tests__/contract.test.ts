import { describe, it, expect } from 'vitest';
import {
  CONTRACT_STATUS_TRANSITIONS,
  CONTRACT_STATUS_TRANSITIONS_STUDENT,
  getStatusLabel,
  type ContractStatusCode,
} from '../contract';

const ALL_STATUSES: ContractStatusCode[] = [
  'REQUESTED',
  'APPROVED',
  'ACTIVE',
  'CANCELLED',
  'TERMINATED',
  'END',
];

describe('CONTRACT_STATUS_TRANSITIONS (튜터)', () => {
  it('모든 상태에 대한 전이 규칙이 빠짐없이 정의되어 있다', () => {
    ALL_STATUSES.forEach((status) => {
      expect(CONTRACT_STATUS_TRANSITIONS[status]).toBeDefined();
    });
  });

  it('CANCELLED는 최종 상태 — 어떤 상태로도 전이 불가', () => {
    expect(CONTRACT_STATUS_TRANSITIONS.CANCELLED).toHaveLength(0);
  });

  it('END는 최종 상태 — 어떤 상태로도 전이 불가', () => {
    expect(CONTRACT_STATUS_TRANSITIONS.END).toHaveLength(0);
  });

  it('REQUESTED → APPROVED 승인 가능', () => {
    expect(CONTRACT_STATUS_TRANSITIONS.REQUESTED).toContain('APPROVED');
  });

  it('REQUESTED → CANCELLED 취소 가능', () => {
    expect(CONTRACT_STATUS_TRANSITIONS.REQUESTED).toContain('CANCELLED');
  });

  it('APPROVED → ACTIVE 진행 시작 가능', () => {
    expect(CONTRACT_STATUS_TRANSITIONS.APPROVED).toContain('ACTIVE');
  });

  it('APPROVED → CANCELLED 승인 후 취소도 가능', () => {
    expect(CONTRACT_STATUS_TRANSITIONS.APPROVED).toContain('CANCELLED');
  });

  it('ACTIVE → END 종료 가능', () => {
    expect(CONTRACT_STATUS_TRANSITIONS.ACTIVE).toContain('END');
  });

  it('ACTIVE → TERMINATED 중단 가능', () => {
    expect(CONTRACT_STATUS_TRANSITIONS.ACTIVE).toContain('TERMINATED');
  });

  it('TERMINATED → ACTIVE 재활성화 가능', () => {
    expect(CONTRACT_STATUS_TRANSITIONS.TERMINATED).toContain('ACTIVE');
  });

  it('TERMINATED → END 중단 후 종료 가능', () => {
    expect(CONTRACT_STATUS_TRANSITIONS.TERMINATED).toContain('END');
  });
});

describe('CONTRACT_STATUS_TRANSITIONS_STUDENT (학생)', () => {
  it('모든 상태에 대한 전이 규칙이 빠짐없이 정의되어 있다', () => {
    ALL_STATUSES.forEach((status) => {
      expect(CONTRACT_STATUS_TRANSITIONS_STUDENT[status]).toBeDefined();
    });
  });

  it('학생은 REQUESTED 상태에서 CANCELLED(취소)만 가능하다', () => {
    expect(CONTRACT_STATUS_TRANSITIONS_STUDENT.REQUESTED).toEqual(['CANCELLED']);
  });

  it('학생은 APPROVED 상태에서 CANCELLED(취소)만 가능하다', () => {
    expect(CONTRACT_STATUS_TRANSITIONS_STUDENT.APPROVED).toEqual(['CANCELLED']);
  });

  it('학생 CANCELLED는 최종 상태', () => {
    expect(CONTRACT_STATUS_TRANSITIONS_STUDENT.CANCELLED).toHaveLength(0);
  });

  it('학생 END는 최종 상태', () => {
    expect(CONTRACT_STATUS_TRANSITIONS_STUDENT.END).toHaveLength(0);
  });

  it('튜터와 학생의 APPROVED 전이 규칙은 다르다 — 학생은 권한 제한', () => {
    expect(CONTRACT_STATUS_TRANSITIONS.APPROVED.length).toBeGreaterThan(
      CONTRACT_STATUS_TRANSITIONS_STUDENT.APPROVED.length,
    );
  });

  it('튜터와 학생의 REQUESTED 전이 규칙은 다르다 — 학생은 취소만 가능', () => {
    expect(CONTRACT_STATUS_TRANSITIONS.REQUESTED.length).toBeGreaterThan(
      CONTRACT_STATUS_TRANSITIONS_STUDENT.REQUESTED.length,
    );
  });
});

describe('getStatusLabel', () => {
  it.each<[ContractStatusCode, string]>([
    ['REQUESTED', '요청'],
    ['ACTIVE', '진행중'],
    ['CANCELLED', '취소'],
    ['TERMINATED', '중단'],
    ['END', '종료'],
  ])('%s → "%s"', (code, label) => {
    expect(getStatusLabel(code)).toBe(label);
  });

  it('모든 상태 코드에 대해 비어있지 않은 라벨을 반환한다', () => {
    ALL_STATUSES.forEach((status) => {
      expect(getStatusLabel(status)).toBeTruthy();
    });
  });
});
