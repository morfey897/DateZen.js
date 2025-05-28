import { DAYS_IN_YEAR_BY_MOTHES, FIRST_YEAR } from './config';
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
  d > DAYS_IN_YEAR_BY_MOTHES[isLeapYear(y)][m] ||
  // Check validation y
  y < 0;

export const toMillseconds = (
  days: number,
  hours: number,
  minutes: number,
  seconds: number,
  millisecond: number
): number =>
  (days * 86_400 + hours * 3_600 + minutes * 60 + seconds) * 1_000 +
  millisecond;

export function binarySearch(target: number, mask: number[]): [number, number] {
  if (Number.isNaN(target)) return [NaN, NaN];
  let left = 0;
  let right = mask.length - 1;

  do {
    const mid = Math.floor((left + right) / 2);
    if (target >= mask[mid] && target < mask[mid + 1]) {
      return [mid, target - mask[mid]];
    }

    if (mask[mid] > target) {
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  } while (left <= right);

  return [NaN, NaN];
}

export function isLeapYear(year: number): 0 | 1 {
  return Number((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) as
    | 0
    | 1;
}

// TODO for format
export function patternMatch(pattern: string) {
  const match = pattern.match(
    /(?<!\\)(Y{1,4}|M{1,4}|D{1,4}|d{1,4}|h{1,4}|m{1,4}|s{1,4})/g
  );
  return match || [];
}

export function calcDaysSinceEpoch(y: number, m: number, d: number): number {
  let days = 0;

  for (let year = FIRST_YEAR; year < y; year++) {
    days += 365 + isLeapYear(year);
  }

  const monthDays = DAYS_IN_YEAR_BY_MOTHES[isLeapYear(y)];
  for (let i = 0; i < m - 1; i++) {
    days += monthDays[i + 1] - monthDays[i];
  }

  days += d - 1;

  return days;
}

export function parseISOString(input: string): number {
  const match = input.match(
    /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2}):(\d{2})(\.\d+)?(?:Z)?$/
  );
  if (!match) return NaN;

  const [, y, m, d, hh, mm, ss, ms] = match.map(Number);
  const millsec = Number.isFinite(ms) ? ms * 1_000 : 0;
  if (invalidInput(y, m, d, hh, mm, ss, millsec)) return NaN;
  const days = calcDaysSinceEpoch(y, m, d);
  return toMillseconds(days, hh, mm, ss, millsec);
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
        return Number.isFinite(value) ? Math.floor(value * 60 * 1_000) : NaN;
      case 'h':
        return Number.isFinite(value) ? Math.floor(value * 3_600 * 1_000) : NaN;
      case 'd':
        return Number.isFinite(value)
          ? Math.floor(value * 86_400 * 1_000)
          : NaN;
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
