import { describe, expect } from '@jest/globals';
import diff from '@/utils/diff';
import DateZen from '../../src/core/DateZen.class';

describe('diff', () => {
  it('should return diff in millseconds by default', () => {
    const a = new DateZen('2025-05-01T10:59:00');
    const b = new DateZen('2025-05-01T10:00:30');
    const result = diff(a, b);
    expect(result).toBe((59 * 60 - 30) * 1000);
  });

  it('should return diff in seconds', () => {
    const a = new DateZen('2025-05-01T10:00:01');
    const b = new DateZen('2025-05-01T10:00:30');
    const result = diff(a, b, 's');
    expect(result).toBe(30 - 1);
  });

  it('should return diff in seconds with millseconds', () => {
    const a = new DateZen('2025-05-01T00:01:00.223');
    const b = new DateZen('2025-05-01T00:02:00.115');
    const result = diff(a, b, 's');
    expect(result).toBe(59);
  });

  it('should return diff in minutes', () => {
    const a = new DateZen('2025-05-01T10:00:01');
    const b = new DateZen('2025-05-01T10:30:00');
    const result = diff(a, b, 'm');
    expect(result).toBe(30 - 1);
  });

  it('should return diff in hours', () => {
    const a = new DateZen('2025-05-01T08:00:00');
    const b = new DateZen('2025-05-01T10:00:00');
    const result = diff(a, b, 'h');
    expect(result).toBe(10 - 8);
  });

  it('should return diff as object with h, m, s', () => {
    const a = new DateZen('2025-05-01T20:12:00');
    const b = new DateZen('2025-05-01T22:15:24');
    const result = diff(a, b, ['h', 'm', 's']);
    expect(result).toEqual({ h: 2, m: 3, s: 24 });
  });

  it('should return all diff in minutes when h not provided', () => {
    const a = new DateZen('2025-05-01T20:12:00');
    const b = new DateZen('2025-05-01T22:15:24');
    const result = diff(a, b, ['m', 's']);
    expect(result).toEqual({ m: 123, s: 24 });
  });
});
