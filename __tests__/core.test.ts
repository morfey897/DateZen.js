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

  test.each(cases)('Timestamp: %i -> DateZen: %s', (timestamp) => {
    const dateZen = new DateZen(timestamp);
    const date = new Date(timestamp);

    expect({
      yyyy: dateZen.getFullYear(),
      mm: dateZen.getMonth(),
      dd: dateZen.getDate(),
      d: dateZen.getDay(),
      h: dateZen.getHours(),
      m: dateZen.getMinutes(),
      s: dateZen.getSeconds(),
      ms: dateZen.getMilliseconds(),
    }).toEqual({
      yyyy: date.getUTCFullYear(),
      mm: date.getUTCMonth(),
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

  test.each(cases)('Timestamp: %i -> DateZen: %s', (timestamp) => {
    const dateZen = new DateZen(timestamp);
    const date = new Date(timestamp);

    expect({
      yyyy: dateZen.getFullYear(),
      mm: dateZen.getMonth(),
      dd: dateZen.getDate(),
      d: dateZen.getDay(),
      h: dateZen.getHours(),
      m: dateZen.getMinutes(),
      s: dateZen.getSeconds(),
      ms: dateZen.getMilliseconds(),
    }).toEqual({
      yyyy: date.getUTCFullYear(),
      mm: date.getUTCMonth(),
      dd: date.getUTCDate(),
      d: date.getUTCDay(),
      h: date.getUTCHours(),
      m: date.getUTCMinutes(),
      s: date.getUTCSeconds(),
      ms: date.getUTCMilliseconds(),
    });
  });
});
