import Math from '@/math';

import { MONTHS, FIRST_YEAR } from './config';
import { DateZenInput } from './types';

const invalidInput = (
  y: number,
  m: number,
  d: number,
  hh: number,
  mm: number,
  ss: number,
  ms: number
) =>
  // Check validation hh
  hh < 0 ||
  hh > 23 ||
  // Check validation mm
  mm < 0 ||
  mm > 59 ||
  // Check validation ss
  ss < 0 ||
  ss > 59 ||
  // Check validation ms
  ms < 0 ||
  ms > 999 ||
  // Check validation m
  m < 1 ||
  m > 12 ||
  // Check validation d
  d < 1 ||
  d > MONTHS[isLeapYear(y)][m - 1] ||
  // Check validation y
  y < 0;

export const toMillseconds = (
  days: number,
  hours: number,
  minutes: number,
  seconds: number,
  millisecond: number
): number => {
  return (
    (days * 86_400 + hours * 3_600 + minutes * 60 + seconds) * 1_000 +
    millisecond
  );
};

export function binarySearch(
  target: number,
  mask: number[],
  back: boolean = false
): [number, number] {
  if (Number.isNaN(target)) return [NaN, NaN];
  let left = 0;
  let right = mask.length - 1;

  do {
    const mid = Math.floor((left + right) / 2);
    if (
      (target > mask[mid] && target < mask[mid + 1]) ||
      (!back && target === mask[mid]) ||
      (back && target === mask[mid + 1])
    ) {
      return [mid, target - mask[mid]];
    }

    if (mask[mid] > target || (back && mask[mid] === target)) {
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  } while (left <= right);

  return [NaN, NaN];
}

export function isLeapYear(year: number): number {
  return +((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0);
}

export function calcDaysSinceEpoch(y: number, m: number, d: number): number {
  let days = 0;
  const monthDays = MONTHS[isLeapYear(y)];
  if (y >= FIRST_YEAR) {
    for (let year = FIRST_YEAR; year < y; year++) {
      days = days + (365 + isLeapYear(year));
    }
    for (let i = 0; i < m - 1; i++) {
      days = days + monthDays[i];
    }
    return days + (d - 1);
  }
  for (let year = y + 1; year < FIRST_YEAR; year++) {
    days = days - (365 + isLeapYear(year));
  }
  for (let i = 11; i > m - 1; i--) {
    days = days - monthDays[i];
  }
  return days - (monthDays[m - 1] - d + 1);
}

export function ISOtoDateString(input: string) {
  const match = input.match(
    /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2}):(\d{2})(\.\d+)?(?:Z)?$/
  );
  if (!match) return null;
  const [, y, m, d, hh, mm, ss, ms] = match.map(Number);
  const millsec = Number.isFinite(ms) ? ms * 1_000 : 0;
  return {
    y,
    m,
    d,
    hh,
    mm,
    ss,
    ms: millsec,
  };
}

export function parseISOString(input: string): number {
  const data = ISOtoDateString(input);
  if (!data) return NaN;
  const { y, m, d, hh, mm, ss, ms } = data;
  if (invalidInput(y, m, d, hh, mm, ss, ms)) return NaN;
  const days = calcDaysSinceEpoch(y, m, d);
  return toMillseconds(days, hh, mm, ss, ms);
}

export function parseInput(input?: DateZenInput): number {
  // Convert string as ISO 8601 to millseconds
  if (typeof input === 'string') return parseISOString(input);
  // Convert number to millseconds
  if (typeof input === 'number')
    return Number.isFinite(input) ? Math.floor(input) : NaN;
  // Convert object to millseconds
  if (
    input &&
    typeof input === 'object' &&
    'value' in input &&
    'unit' in input
  ) {
    const { value, unit } = input;
    switch (unit) {
      case 'ms':
        return Number.isFinite(value) ? Math.floor(value) : NaN;
      case 's':
        return Number.isFinite(value) ? Math.floor(value * 1_000) : NaN;
      case 'm':
        return Number.isFinite(value) ? Math.floor(value * 60_000) : NaN;
      case 'h':
        return Number.isFinite(value) ? Math.floor(value * 3_600_000) : NaN;
      case 'd':
        return Number.isFinite(value) ? Math.floor(value * 86_400_000) : NaN;
      default:
        return NaN;
    }
  }

  if (
    input &&
    typeof input === 'object' &&
    'year' in input &&
    ('month' in input || 'monthIndex' in input) &&
    'day' in input
  ) {
    const {
      year: y,
      day: d,
      hour: hh = 0,
      minute: mm = 0,
      second: ss = 0,
      millisecond: millsec = 0,
    } = input;

    let m: number;
    if ('monthIndex' in input && typeof input.monthIndex === 'number') {
      m = input.monthIndex + 1;
    } else if ('month' in input && typeof input.month === 'number') {
      m = input.month;
    } else {
      m = NaN;
    }

    const allAreNumbers = [y, m, d, hh, mm, ss, millsec].every((v) =>
      Number.isFinite(v)
    );

    if (!allAreNumbers) return NaN;
    if (invalidInput(y, m, d, hh, mm, ss, millsec)) return NaN;
    const days = calcDaysSinceEpoch(y, m, d);
    return toMillseconds(days, hh, mm, ss, millsec);
  }

  return Math.floor(Date.now());
}
