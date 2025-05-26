import { DAYS_IN_YEAR_BY_MOTHES, DAYS_IN_YEAR, FIRST_YEAR } from './config';
import { SEC_IN_DAY, SEC_IN_HOUR, SEC_IN_MIN, MILLSEC_IN_SEC } from './config';
import { DateZenInput } from './types';

export const toMillseconds = (
  days: number,
  hours: number,
  minutes: number,
  seconds: number,
  millisecond: number
): number =>
  (days * SEC_IN_DAY + hours * SEC_IN_HOUR + minutes * SEC_IN_MIN + seconds) *
    MILLSEC_IN_SEC +
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
    days += DAYS_IN_YEAR + isLeapYear(year);
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
  const days = calcDaysSinceEpoch(y, m, d);
  return toMillseconds(
    days,
    hh,
    mm,
    ss,
    Number.isFinite(ms) ? ms * MILLSEC_IN_SEC : 0
  );
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
        return Number.isFinite(value)
          ? Math.floor(value * MILLSEC_IN_SEC)
          : NaN;
      case 'm':
        return Number.isFinite(value)
          ? Math.floor(value * SEC_IN_MIN * MILLSEC_IN_SEC)
          : NaN;
      case 'h':
        return Number.isFinite(value)
          ? Math.floor(value * SEC_IN_HOUR * MILLSEC_IN_SEC)
          : NaN;
      case 'd':
        return Number.isFinite(value)
          ? Math.floor(value * SEC_IN_DAY * MILLSEC_IN_SEC)
          : NaN;
      default:
        return NaN;
    }
  }

  if (
    input &&
    typeof input === 'object' &&
    'year' in input &&
    'month' in input &&
    'day' in input
  ) {
    const {
      year,
      month,
      day,
      hour = 0,
      minute = 0,
      second = 0,
      millisecond = 0,
    } = input;

    const allAreNumbers = [
      year,
      month,
      day,
      hour,
      minute,
      second,
      millisecond,
    ].every((v) => Number.isFinite(v));

    if (!allAreNumbers) {
      return NaN;
    }
    const days = calcDaysSinceEpoch(year, month, day);
    return toMillseconds(days, hour, minute, second, millisecond);
  }

  return Math.floor(Date.now());
}

// format(pattern: string, locale?: string) {
//   console.log(pattern);
//   const match = pattern.match(
//     /(?<!\\)(Y{1,4}|M{1,4}|D{1,4}|d{1,4}|h{1,2}|m{1,2}|s{1,2})/g
//   );

//   if (!match) return pattern;

//   const memoize = new Map<string, string>();

//   match
//     .sort((a, b) => {
//       return b.length - a.length;
//     })
//     .forEach((item) => {
//       if (memoize.has(item)) {
//         pattern = pattern.replace(item, memoize.get(item) as string);
//         return;
//       }

//       if (item.startsWith('Y')) {
//         const year = this.getFullYear().toString();
//         memoize.set('YYYY', year);
//         memoize.set('YY', year.padStart(2, '0'));
//       } else if (item.startsWith('M')) {
//         const month = this.getMonth().toString();
//         memoize.set('MM', month.padStart(2, '0'));
//         memoize.set('M', month);
//       } else if (item.startsWith('D')) {
//         const day = this.getDate().toString();
//         memoize.set('DD', day.padStart(2, '0'));
//         memoize.set('D', day);
//       } else if (item.startsWith('h')) {
//         const hour = this.getHours().toString();
//         memoize.set('hh', hour.padStart(2, '0'));
//         memoize.set('h', hour);
//       } else if (item.startsWith('m')) {
//         const minute = this.getMinutes().toString();
//         memoize.set('mm', minute.padStart(2, '0'));
//         memoize.set('m', minute);
//       } else if (item.startsWith('s')) {
//         const second = this.getSeconds().toString();
//         memoize.set('ss', second.padStart(2, '0'));
//         memoize.set('s', second);
//       } else if (item.startsWith('d')) {
//         const WEEKDAYS: Record<
//           string,
//           'long' | 'short' | 'narrow' | 'custom'
//         > = {
//           dddd: 'long',
//           ddd: 'custom',
//           dd: 'short',
//           d: 'narrow',
//         };
//         const weekday = WEEKDAYS[item];
//         if (weekday === 'custom') {
//           const day = this.getDay().toString();
//           memoize.set(item, day);
//         } else {
//           const day = new Intl.DateTimeFormat(locale, {
//             weekday: weekday,
//             timeZone: 'UTC',
//           }).format(new Date(this.timestamp * 1000));
//           memoize.set(item, day);
//         }
//       } else {
//         return;
//       }

//       pattern = pattern.replace(item, memoize.get(item) as string);
//     });

//   pattern = pattern.replace(/\\([YMDhms])/g, '$1');
//   console.log(pattern);
//   return pattern;
// }
