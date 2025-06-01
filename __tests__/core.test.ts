import { describe, expect, test } from '@jest/globals';
import DateZen from '@/core/DateZen.class';
import { ISOtoDateString } from '@/core/utils';
import { generateCases, dToFObj, dToUObj, dzToFObj, dzToUObj } from './utils';

const TOTAL = 0;

describe.only('Test', () => {
  test('Test', () => {
    const iso = '1969-02-28T00:00:00.001Z';
    const dateZen = new DateZen(iso);
    const date = new Date(iso);

    expect({
      ...dToUObj(date),
      ctrlTS: date.getTime(),
      ctrlISO: date.toISOString(),
    }).toEqual({
      ...dzToUObj(dateZen),
      ctrlTS: dateZen.toMillseconds(),
      ctrlISO: dateZen.toISOString(),
    });
    // expect(true).toBe(true);
  });
});

describe('Before 1970', () => {
  const from = new Date('1800-01-01T00:00:00.000Z').getTime();
  const to = new Date('1970-01-01T00:00:00.000Z').getTime();
  const cases = generateCases(from, to, TOTAL);
  describe('By ISO', () => {
    test.each(cases)('ISO: %s; TS: %i', (...values) => {
      const [iso, ts] = values;
      const dateZen = new DateZen(iso);
      const date = new Date(iso);
      expect({
        ...dToUObj(date),
        ctrlTS: ts,
        ctrlISO: iso,
      }).toEqual({
        ...dzToUObj(dateZen),
        ctrlTS: dateZen.toMillseconds(),
        ctrlISO: dateZen.toISOString(),
      });
    });
  });

  describe('By Timestamp', () => {
    test.each(cases)('ISO: %s; TS: %i', (...values) => {
      const [iso, ts] = values;
      const dateZen = new DateZen(ts);
      const date = new Date(ts);
      expect({
        ...dToUObj(date),
        ctrlTS: ts,
        ctrlISO: iso,
      }).toEqual({
        ...dzToUObj(dateZen),
        ctrlTS: dateZen.toMillseconds(),
        ctrlISO: dateZen.toISOString(),
      });
    });
  });

  describe('By Parts', () => {
    test.each(cases)('ISO: %s; TS: %i', (...values) => {
      const [iso, ts] = values;
      const dateParts = ISOtoDateString(iso);
      if (!dateParts) {
        throw new Error(`Invalid ISO string: ${iso}`);
      }
      const dateZen = new DateZen({
        year: dateParts.y,
        month: dateParts.m,
        day: dateParts.d,
        hour: dateParts.hh,
        minute: dateParts.mm,
        second: dateParts.ss,
        millisecond: dateParts.ms,
      });
      const date = new Date(iso);
      expect({
        ...dToUObj(date),
        ctrlTS: ts,
        ctrlISO: iso,
      }).toEqual({
        ...dzToUObj(dateZen),
        ctrlTS: dateZen.toMillseconds(),
        ctrlISO: dateZen.toISOString(),
      });
    });
  });
});

describe('After 1970', () => {
  const from = new Date('1970-01-01T00:00:00.000Z').getTime();
  const to = new Date('2100-01-01T00:00:00.000Z').getTime();
  const cases = generateCases(from, to, TOTAL);
  describe('By ISO', () => {
    test.each(cases)('ISO: %s; TS: %i', (...values) => {
      const [iso, ts] = values;
      const dateZen = new DateZen(iso);
      const date = new Date(iso);
      expect({
        ...dToFObj(date),
        ...dToUObj(date),
        ctrlTS: ts,
        ctrlISO: iso,
      }).toEqual({
        ...dzToFObj(dateZen),
        ...dzToUObj(dateZen),
        ctrlTS: dateZen.toMillseconds(),
        ctrlISO: dateZen.toISOString(),
      });
    });
  });

  describe('By Timestamp', () => {
    test.each(cases)('ISO: %s; TS: %i', (...values) => {
      const [iso, ts] = values;
      const dateZen = new DateZen(ts);
      const date = new Date(ts);
      expect({
        ...dToFObj(date),
        ...dToUObj(date),
        ctrlTS: ts,
        ctrlISO: iso,
      }).toEqual({
        ...dzToFObj(dateZen),
        ...dzToUObj(dateZen),
        ctrlTS: dateZen.toMillseconds(),
        ctrlISO: dateZen.toISOString(),
      });
    });
  });
  describe('By Parts', () => {
    test.each(cases)('ISO: %s; TS: %i', (...values) => {
      const [iso, ts] = values;
      const dateParts = ISOtoDateString(iso);
      if (!dateParts) {
        throw new Error(`Invalid ISO string: ${iso}`);
      }
      const dateZen = new DateZen({
        year: dateParts.y,
        month: dateParts.m,
        day: dateParts.d,
        hour: dateParts.hh,
        minute: dateParts.mm,
        second: dateParts.ss,
        millisecond: dateParts.ms,
      });
      const date = new Date(iso);
      expect({
        ...dToFObj(date),
        ...dToUObj(date),
        ctrlTS: ts,
        ctrlISO: iso,
      }).toEqual({
        ...dzToFObj(dateZen),
        ...dzToUObj(dateZen),
        ctrlTS: dateZen.toMillseconds(),
        ctrlISO: dateZen.toISOString(),
      });
    });
  });
});

/*
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
      yyyy: date.getUTCFullYear(),
      mm: date.getUTCMonth() + 1,
      mmIndex: date.getUTCMonth(),
      dd: date.getUTCDate(),
      d: date.getUTCDay(),
      h: date.getUTCHours(),
      m: date.getUTCMinutes(),
      s: date.getUTCSeconds(),
      ms: date.getUTCMilliseconds(),
      iso: date.toISOString(),
    }).toEqual({
      yyyy: dateZen.year(),
      mm: dateZen.month(),
      mmIndex: dateZen.monthIndex(),
      dd: dateZen.day(),
      d: dateZen.weekday(),
      h: dateZen.hours(),
      m: dateZen.minutes(),
      s: dateZen.seconds(),
      ms: dateZen.millseconds(),
      iso: dateZen.toISOString(),
    });
  });
});
*/
