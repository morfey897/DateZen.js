import { describe, expect, test } from '@jest/globals';
import DateZen from '@/core/DateZen.class';

const TOTAL = 100;

describe('Core from 1970 to 2100', () => {
  const timestamps = [];
  const from = new Date('1970-01-01T00:00:00.000Z').getTime();
  const to = new Date('2100-01-01T00:00:00.000Z').getTime();
  for (let i = 0; i < TOTAL; i++) {
    timestamps.push(Math.floor(from + Math.random() * (to - from)));
  }
  const cases = timestamps
    .sort((a, b) => a - b)
    .map((timestamp) => [timestamp, new Date(timestamp).toISOString()]);

  test.each(cases)('Timestamp: %i -> DateZen: %s', (...timestamp) => {
    const milseconds = timestamp[0] as unknown as number;
    const dateZen = new DateZen(milseconds);
    const date = new Date(milseconds);

    expect({
      yyyy: dateZen.year(),
      mm: dateZen.month(),
      mmIndex: dateZen.monthIndex(),
      dd: dateZen.day(),
      d: dateZen.weekday(),
      h: dateZen.hours(),
      m: dateZen.minutes(),
      s: dateZen.seconds(),
      ms: dateZen.millseconds(),
    }).toEqual({
      yyyy: date.getUTCFullYear(),
      mm: date.getUTCMonth() + 1,
      mmIndex: date.getUTCMonth(),
      dd: date.getUTCDate(),
      d: date.getUTCDay(),
      h: date.getUTCHours(),
      m: date.getUTCMinutes(),
      s: date.getUTCSeconds(),
      ms: date.getUTCMilliseconds(),
    });
  });
});

describe('Core up to 2100', () => {
  const timestamps = [];
  const from = new Date('2100-01-01T00:00:00.000Z').getTime();
  for (let i = 0; i < TOTAL; i++) {
    timestamps.push(
      Math.floor(from + Math.random() * (1000 * 365 * 1000 * 24 * 60 * 60))
    );
  }
  const cases = timestamps
    .sort((a, b) => a - b)
    .map((timestamp) => [timestamp, new Date(timestamp).toISOString()]);

  test.each(cases)('Timestamp: %i -> DateZen: %s', (...timestamp) => {
    const milseconds = timestamp[0] as unknown as number;
    const dateZen = new DateZen(milseconds);
    const date = new Date(milseconds);

    expect({
      yyyy: dateZen.year(),
      mm: dateZen.month(),
      mmIndex: dateZen.monthIndex(),
      dd: dateZen.day(),
      d: dateZen.weekday(),
      h: dateZen.hours(),
      m: dateZen.minutes(),
      s: dateZen.seconds(),
      ms: dateZen.millseconds(),
    }).toEqual({
      yyyy: date.getUTCFullYear(),
      mm: date.getUTCMonth() + 1,
      mmIndex: date.getUTCMonth(),
      dd: date.getUTCDate(),
      d: date.getUTCDay(),
      h: date.getUTCHours(),
      m: date.getUTCMinutes(),
      s: date.getUTCSeconds(),
      ms: date.getUTCMilliseconds(),
    });
  });
});
