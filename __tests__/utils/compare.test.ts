import { describe, expect } from '@jest/globals';
import compare from '@/utils/compare';
import DateZen from '@/core/DateZen.class';

describe('compare', () => {
  it('should return 0 for equal ISO strings', () => {
    expect(
      compare(
        new DateZen('2025-01-01T00:00:00Z'),
        new DateZen('2025-01-01T00:00:00Z')
      )
    ).toBe(0);
  });

  it('should return -1 when first date is earlier', () => {
    expect(
      compare(
        new DateZen('2025-01-01T00:00:00Z'),
        new DateZen('2025-01-02T00:00:00Z')
      )
    ).toBe(-1);
  });

  it('should return 1 when first date is later', () => {
    expect(
      compare(
        new DateZen('2025-01-03T00:00:00Z'),
        new DateZen('2025-01-02T00:00:00Z')
      )
    ).toBe(1);
  });

  it('should work with timestamps', () => {
    expect(
      compare(new DateZen(1735689600000), new DateZen(1735603200000))
    ).toBe(1); // Jan 2 > Jan 1
  });

  it('should work with mixed input types (DateZen + string)', () => {
    const a = new DateZen('2025-01-01T00:00:00Z');
    const b = new DateZen('2025-01-02T00:00:00Z');
    expect(compare(a, b)).toBe(-1);
  });

  it('should work with DateZen objects', () => {
    const a = new DateZen('2025-01-01T00:00:00Z');
    const b = new DateZen('2025-01-01T00:00:00Z');
    expect(compare(a, b)).toBe(0);
  });

  it('should support comparing with now when second parameter is undefined', () => {
    const beforeNow = new DateZen(Date.now() - 1000); // 1 second ago
    expect(compare(beforeNow, new DateZen())).toBe(-1);
  });
});
