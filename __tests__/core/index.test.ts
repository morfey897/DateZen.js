import { describe, expect, test } from '@jest/globals';
import DateZen from '@/core/DateZen.class';
import {
  generateCases,
  dToFObj,
  dToUObj,
  dzToFObj,
  dzToUObj,
  ISOtoDateString,
} from '../test-utils';

const TOTAL_TESTS = 1000;

const FIRST_YEAR = 1970;
// MAX year
const MAX_AVAILABLE_YEAR = `287396-10-12T08:59:00.991Z`;

describe(`Range(${FIRST_YEAR - 1} - ${FIRST_YEAR + 1})`, () => {
  // MAX year
  const iso = MAX_AVAILABLE_YEAR;
  // const to = `${FIRST_YEAR + 1}-01-01T00:00:00.000Z`;
  // const cases = generateCases(from, to, 10_000);
  test(`validate`, () => {
    // for (const [iso, ts] of cases) {
    const dateZen = new DateZen(iso);
    // const date = new Date(iso);

    const expected = {
      // ...dToUObj(date),
      // ctrlTS: ts,
      ctrlISO: iso,
    };

    const actual = {
      // ...dzToUObj(dateZen),
      // ctrlTS: dateZen.toMillseconds(),
      ctrlISO: dateZen.toISOString(),
    };

    expect(actual).toEqual(expected);
    // }
  });
});

describe(`Range(${FIRST_YEAR - 400} - ${FIRST_YEAR})`, () => {
  const from = `${FIRST_YEAR - 400}-01-01T00:00:00.000Z`;
  const to = `${FIRST_YEAR}-01-01T00:00:00.000Z`;
  const cases = generateCases(from, to, TOTAL_TESTS);
  test(`By ISO: ${cases[0][0]} - ${cases[cases.length - 1][0]}`, () => {
    for (const [iso, ts] of cases) {
      const dateZen = new DateZen(iso);
      const date = new Date(iso);

      const expected = {
        ...dToUObj(date),
        ctrlTS: ts,
        ctrlISO: iso,
      };

      const actual = {
        ...dzToUObj(dateZen),
        ctrlTS: dateZen.toMillseconds(),
        ctrlISO: dateZen.toISOString(),
      };

      expect(actual).toEqual(expected);
    }
  });

  describe(`By Timestamp: ${cases[0][0]} - ${cases[cases.length - 1][0]}`, () => {
    for (const [iso, ts] of cases) {
      const dateZen = new DateZen(iso);
      const date = new Date(iso);

      const expected = {
        ...dToUObj(date),
        ctrlTS: ts,
        ctrlISO: iso,
      };

      const actual = {
        ...dzToUObj(dateZen),
        ctrlTS: dateZen.toMillseconds(),
        ctrlISO: dateZen.toISOString(),
      };

      expect(actual).toEqual(expected);
    }
  });

  test(`By Parts: ${cases[0][0]} - ${cases[cases.length - 1][0]}`, () => {
    for (const [iso, ts] of cases) {
      const dateParts = ISOtoDateString(iso);
      if (!dateParts) {
        throw new Error(`Invalid ISO string: ${iso}`);
      }
      const dateZen = new DateZen({
        year: dateParts.y,
        month: dateParts.m,
        day: dateParts.d,
        hours: dateParts.hh,
        minutes: dateParts.mm,
        seconds: dateParts.ss,
        milliseconds: dateParts.ms,
      });
      const date = new Date(iso);

      const expected = {
        ...dToUObj(date),
        ctrlTS: ts,
        ctrlISO: iso,
      };

      const actual = {
        ...dzToUObj(dateZen),
        ctrlTS: dateZen.toMillseconds(),
        ctrlISO: dateZen.toISOString(),
      };

      expect(actual).toEqual(expected);
    }
  });
});

describe(`${FIRST_YEAR} - ${FIRST_YEAR + 400}`, () => {
  const from = `${FIRST_YEAR}-01-01T00:00:00.000Z`;
  const to = `${FIRST_YEAR + 400}-01-01T00:00:00.000Z`;
  const cases = generateCases(from, to, TOTAL_TESTS);
  test(`By ISO: ${cases[0][0]} - ${cases[cases.length - 1][0]}`, () => {
    for (const [iso, ts] of cases) {
      const dateZen = new DateZen(iso);
      const date = new Date(iso);

      const expected = {
        ...dToFObj(date),
        ...dToUObj(date),
        ctrlTS: ts,
        ctrlISO: iso,
      };

      const actual = {
        ...dzToUObj(dateZen),
        ...dzToFObj(dateZen),
        ctrlTS: dateZen.toMillseconds(),
        ctrlISO: dateZen.toISOString(),
      };

      expect(actual).toEqual(expected);
    }
  });

  test(`By Timestamp: ${cases[0][0]} - ${cases[cases.length - 1][0]}`, () => {
    for (const [iso, ts] of cases) {
      const dateZen = new DateZen(ts);
      const date = new Date(ts);

      const expected = {
        ...dToFObj(date),
        ...dToUObj(date),
        ctrlTS: ts,
        ctrlISO: iso,
      };

      const actual = {
        ...dzToUObj(dateZen),
        ...dzToFObj(dateZen),
        ctrlTS: dateZen.toMillseconds(),
        ctrlISO: dateZen.toISOString(),
      };

      expect(actual).toEqual(expected);
    }
  });
  test(`By Parts: ${cases[0][0]} - ${cases[cases.length - 1][0]}`, () => {
    for (const [iso, ts] of cases) {
      const dateParts = ISOtoDateString(iso);
      if (!dateParts) {
        throw new Error(`Invalid ISO string: ${iso}`);
      }
      const dateZen = new DateZen({
        year: dateParts.y,
        month: dateParts.m,
        day: dateParts.d,
        hours: dateParts.hh,
        minutes: dateParts.mm,
        seconds: dateParts.ss,
        milliseconds: dateParts.ms,
      });
      const date = new Date(iso);

      const expected = {
        ...dToFObj(date),
        ...dToUObj(date),
        ctrlTS: ts,
        ctrlISO: iso,
      };

      const actual = {
        ...dzToUObj(dateZen),
        ...dzToFObj(dateZen),
        ctrlTS: dateZen.toMillseconds(),
        ctrlISO: dateZen.toISOString(),
      };

      expect(actual).toEqual(expected);
    }
  });
});
