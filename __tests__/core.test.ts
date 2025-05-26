import { describe, expect, test } from '@jest/globals';
import DateZen from '@/core/DateZen';

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
    const dateZen = new DateZen(Math.floor(milseconds / 1000));
    const date = new Date(milseconds);

    expect({
      yyyy: dateZen.year(),
      mm: dateZen.month(),
      dd: dateZen.day(),
      d: dateZen.weekday(),
      h: dateZen.hours(),
      m: dateZen.minutes(),
      s: dateZen.seconds(),
    }).toEqual({
      yyyy: date.getUTCFullYear(),
      mm: date.getUTCMonth(),
      dd: date.getUTCDate(),
      d: date.getUTCDay(),
      h: date.getUTCHours(),
      m: date.getUTCMinutes(),
      s: date.getUTCSeconds(),
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
    const dateZen = new DateZen(Math.floor(milseconds / 1000));
    const date = new Date(milseconds);

    expect({
      yyyy: dateZen.year(),
      mm: dateZen.month(),
      dd: dateZen.day(),
      d: dateZen.weekday(),
      h: dateZen.hours(),
      m: dateZen.minutes(),
      s: dateZen.seconds(),
    }).toEqual({
      yyyy: date.getUTCFullYear(),
      mm: date.getUTCMonth(),
      dd: date.getUTCDate(),
      d: date.getUTCDay(),
      h: date.getUTCHours(),
      m: date.getUTCMinutes(),
      s: date.getUTCSeconds(),
    });
  });
});
