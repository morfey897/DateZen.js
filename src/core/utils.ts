import MathFunc from '@/math';

import { MONTHS } from './config';

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
  mask: readonly number[],
  upto1970: boolean
): [number, number] {
  if (Number.isNaN(target)) return [NaN, NaN];
  let left = 0;
  let right = mask.length - 1;

  do {
    const mid = Math.floor((left + right) / 2);
    if (
      (target > mask[mid] && target < mask[mid + 1]) ||
      (upto1970 && target === mask[mid]) ||
      (!upto1970 && target === mask[mid + 1])
    ) {
      return [mid, target - mask[mid]];
    }

    if (mask[mid] > target || (!upto1970 && mask[mid] === target)) {
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

export function calcDaysSinceEpochOld(y: number, m: number, d: number): number {
  let days = 0;
  const monthDays = MONTHS[isLeapYear(y)];
  if (y >= 1970) {
    for (let year = 1970; year < y; year++) {
      days = days + (365 + isLeapYear(year));
    }
    for (let i = 0; i < m - 1; i++) {
      days = days + monthDays[i];
    }
    return days + (d - 1);
  }
  for (let year = y + 1; year < 1970; year++) {
    days -= 365 + isLeapYear(year);
  }
  for (let i = m; i < 12; i++) {
    days -= monthDays[i];
  }
  return days - (monthDays[m - 1] - d + 1);
}

const leapYears = (y: number) =>
  MathFunc.floor((y - 1) / 4) -
  MathFunc.floor((y - 1) / 100) +
  MathFunc.floor((y - 1) / 400);

export function calcDaysSinceEpoch(y: number, m: number, d: number): number {
  const shift = Number(y < 1970);
  const yearDiff = y - 1970 + shift;

  const leapCount = leapYears(y + shift) - leapYears(1970 - shift);
  let days = yearDiff * 365 + leapCount;

  const monthDays = MONTHS[isLeapYear(y)];

  if (y >= 1970) {
    for (let i = 0; i < m - 1; i++) {
      days += monthDays[i];
    }
  } else {
    for (let i = m; i < 12; i++) {
      days -= monthDays[i];
    }
  }

  days += y >= 1970 ? d - 1 : -(monthDays[m - 1] - d + 1);

  return days;
}

export function getYearAndRestDays(totalDays: number): [number, number] {
  let year = MathFunc.floor(totalDays / 365.2425) + 1970;

  let startOfYearDays = calcDaysSinceEpoch(year, 1, 1);

  while (startOfYearDays > totalDays) {
    year--;
    startOfYearDays = calcDaysSinceEpoch(year, 1, 1);
  }

  while (startOfYearDays + 365 + isLeapYear(year) <= totalDays) {
    startOfYearDays += 365 + isLeapYear(year);
    year++;
  }

  const restDays =
    totalDays >= 0
      ? totalDays - startOfYearDays
      : -(totalDays - (365 + isLeapYear(year) + startOfYearDays));
  return [year, restDays];
}
