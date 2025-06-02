import { isLeapYear } from './utils';

// 01.01.1970 00:00:00 settings
export const FIRST_DAY = 4;
export const FIRST_YEAR = 1970;

const joining = (days: number, index: number, arr: number[]) =>
  days + (index > 0 ? arr.slice(0, index).reduce((a, b) => a + b, 0) : 0);

function generateCumulativeDaysList(
  fromYear: number,
  toYear: number
): number[] {
  const isForward = fromYear <= toYear;
  const length = Math.abs(toYear - fromYear) + 1;
  const result = new Array(length + 1);
  result[0] = 0;

  let sum = 0;
  for (let i = 0; i < length; i++) {
    const year = isForward ? fromYear + i : fromYear - i;
    sum += 365 + isLeapYear(year);
    result[i + 1] = sum;
  }

  return result;
}

export const MONTHS = [
  [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] as const,
  [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] as const,
] as const;

export const commulativeMonths = (isLeap: number, upto1970: boolean) => {
  if (upto1970) {
    return [0, ...MONTHS[isLeap]].map(joining);
  }
  return [...MONTHS[isLeap], 0].reverse().map(joining);
};

export const LIST_OF_DAYS_AFTER_1970 = generateCumulativeDaysList(
  FIRST_YEAR,
  FIRST_YEAR + 400
);

export const LIST_OF_DAYS_BEFORE_1970 = generateCumulativeDaysList(
  FIRST_YEAR - 1,
  FIRST_YEAR - 401
);
