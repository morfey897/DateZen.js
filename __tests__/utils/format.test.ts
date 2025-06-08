import { describe, expect } from '@jest/globals';
import format from '@/utils/format';
import dz from '@/index';

describe('format', () => {
  beforeAll(() => {
    dz.use('format', format);
  });

  it('format date with full year', () => {
    const pattern = 'The time is Y-M-D h:m:s ms/A';
    const ms = format(
      {
        year: 2015,
        month: 12,
        day: 31,
        hour: 17,
        minute: 59,
        second: 23,
        millisecond: 999,
      },
      pattern
    );
    expect(ms).toEqual('The time is 2015-12-31 5:59:23 999/PM');
  });

  it('format with leading zeros', () => {
    const pattern = 'Y-M-D h:mm:ss ms/A';
    const ms = format(
      {
        year: 2015,
        month: 3,
        day: 1,
        hour: 7,
        minute: 5,
        second: 3,
        millisecond: 5,
      },
      pattern
    );
    expect(ms).toEqual('2015-3-1 7:05:03 005/AM');
  });

  it('format with 24-hour time', () => {
    const pattern = 'Y-M-D hh:mm:ss ms';
    const ms = format(
      {
        year: 2023,
        month: 11,
        day: 5,
        hour: 14,
        minute: 30,
        second: 45,
        millisecond: 123,
      },
      pattern
    );
    expect(ms).toEqual('2023-11-5 14:30:45 123');
  });
  it('format with AM/PM', () => {
    const pattern = 'Y-M-D h:mm:ss ms/A';
    const ms = format(
      {
        year: 2023,
        month: 1,
        day: 31,
        hour: 11,
        minute: 59,
        second: 59,
        millisecond: 999,
      },
      pattern
    );
    expect(ms).toEqual('2023-1-31 11:59:59 999/AM');
  });

  it('format with lowercase am/pm', () => {
    const pattern = 'YYYY-M-D h/a mm ss ms\\A';
    const ms = format(
      {
        year: 2024,
        month: 2,
        day: 29,
        hour: 17,
        minute: 59,
        second: 59,
        millisecond: 999,
      },
      pattern
    );
    expect(ms).toEqual('2024-2-29 5/pm 59 59 999A');
  });

  it('format through plugin', () => {
    const pattern = 'Y-M-D h:m:s ms/A';
    const dateZen = dz({
      year: 2020,
      month: 5,
      day: 15,
      hour: 8,
      minute: 20,
      second: 30,
      millisecond: 456,
    });
    expect(dateZen.format(pattern)).toEqual('2020-5-15 8:20:30 456/AM');
  });
});
