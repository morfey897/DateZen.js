import { describe, expect, test } from '@jest/globals';
import DateZen from '@/core/DateZen.class';
import { ISOtoDateString } from '@/core/utils';
import {
  generateCases,
  dToFObj,
  dToUObj,
  dzToFObj,
  dzToUObj,
} from './test-utils';
import { FIRST_YEAR } from '@/core/config';

const TOTAL = 1000;

describe.skip('Test', () => {
  test('Test', () => {
    const iso = '1570-01-01T00:00:00.000Z';
    const dz = new DateZen(iso);
    const date = new Date(iso);

    expect({
      ...dToUObj(date),
      ctrlTS: date.getTime(),
      ctrlISO: date.toISOString(),
    }).toEqual({
      ...dzToUObj(dz),
      ctrlTS: dz.toMillseconds(),
      ctrlISO: dz.toISOString(),
    });
    // expect(true).toBe(true);
  });
});

describe(`${FIRST_YEAR - 400} - ${FIRST_YEAR}`, () => {
  const from = new Date(`${FIRST_YEAR - 400}-01-01T00:00:00.000Z`).getTime();
  const to = new Date(`${FIRST_YEAR}-01-01T00:00:00.000Z`).getTime();
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

describe(`${FIRST_YEAR} - ${FIRST_YEAR + 400}`, () => {
  const from = new Date(`${FIRST_YEAR}-01-01T00:00:00.000Z`).getTime();
  const to = new Date(`${FIRST_YEAR + 400}-01-01T00:00:00.000Z`).getTime();
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
