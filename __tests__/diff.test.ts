import { describe, expect } from '@jest/globals';
import diff from '@/utils/diff';

describe('diff', () => {
  it('should return diff in millseconds by default', () => {
    const result = diff('2025-05-01T10:59:00', '2025-05-01T10:00:30');
    expect(result).toBe((59 * 60 - 30) * 1000);
  });

  it('should return diff in seconds', () => {
    const result = diff('2025-05-01T10:00:01', '2025-05-01T10:00:30', 's');
    expect(result).toBe(30 - 1);
  });

  it('should return diff in seconds with millseconds', () => {
    const result = diff(
      '2025-05-01T00:01:00.223',
      '2025-05-01T00:02:00.115',
      's'
    );
    expect(result).toBe(59);
  });

  it('should return diff in minutes', () => {
    const result = diff('2025-05-01T10:00:01', '2025-05-01T10:30:00', 'm');
    expect(result).toBe(30 - 1);
  });

  it('should return diff in hours', () => {
    const result = diff('2025-05-01T08:00:00', '2025-05-01T10:00:00', 'h');
    expect(result).toBe(10 - 8);
  });

  it('should return diff as object with h, m, s', () => {
    const result = diff('2025-05-01T20:12:00', '2025-05-01T22:15:24', [
      'h',
      'm',
      's',
    ]);
    expect(result).toEqual({ h: 2, m: 3, s: 24 });
  });

  it('should return all diff in minutes when h not provided', () => {
    const result = diff('2025-05-01T20:12:00', '2025-05-01T22:15:24', [
      'm',
      's',
    ]);
    expect(result).toEqual({ m: 123, s: 24 });
  });
});
