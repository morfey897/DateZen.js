import { describe, expect } from '@jest/globals';
import format from '@/plugins/format';
import dz from '@/index';

describe('format', () => {
  beforeAll(() => {
    dz.use('format', format);
  });

  it('format date with full year', () => {
    const pattern = 'The time is Y-M-D h:m:s SSS/A';
    const SSS = format(
      {
        year: 2015,
        month: 12,
        day: 31,
        hours: 17,
        minutes: 59,
        seconds: 23,
        milliseconds: 999,
      },
      pattern
    );
    expect(SSS).toEqual('The time is 2015-12-31 5:59:23 999/PM');
  });

  it('format with leading zeros', () => {
    const pattern = 'Y-M-D h:mm:ss SSS/A';
    const SSS = format(
      {
        year: 2015,
        month: 3,
        day: 1,
        hours: 7,
        minutes: 5,
        seconds: 3,
        milliseconds: 5,
      },
      pattern
    );
    expect(SSS).toEqual('2015-3-1 7:05:03 005/AM');
  });

  it('format with 24-hours time', () => {
    const pattern = 'Y-M-D hh:mm:ss SSS';
    const SSS = format(
      {
        year: 2023,
        month: 11,
        day: 5,
        hours: 14,
        minutes: 30,
        seconds: 45,
        milliseconds: 123,
      },
      pattern
    );
    expect(SSS).toEqual('2023-11-5 14:30:45 123');
  });
  it('format with AM/PM', () => {
    const pattern = 'Y-M-D h:mm:ss SSS/A';
    const SSS = format(
      {
        year: 2023,
        month: 1,
        day: 31,
        hours: 11,
        minutes: 59,
        seconds: 59,
        milliseconds: 999,
      },
      pattern
    );
    expect(SSS).toEqual('2023-1-31 11:59:59 999/AM');
  });

  it('format with lowercase am/pm', () => {
    const pattern = 'YYYY-M-D h/a mm ss SSS\\A';
    const SSS = format(
      {
        year: 2024,
        month: 2,
        day: 29,
        hours: 17,
        minutes: 59,
        seconds: 59,
        milliseconds: 999,
      },
      pattern
    );
    expect(SSS).toEqual('2024-2-29 5/pm 59 59 999A');
  });

  it('format through plugin', () => {
    const pattern = 'Y-M-D h:m:s SSS/A';
    const dateZen = dz({
      year: 2020,
      month: 5,
      day: 15,
      hours: 8,
      minutes: 20,
      seconds: 30,
      milliseconds: 56,
    });

    expect(dateZen.format(pattern)).toEqual('2020-5-15 8:20:30 056/AM');
  });
});
