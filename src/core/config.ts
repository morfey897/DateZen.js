import { isLeapYear } from './utils';

// 01.01.1970 00:00:00 settings
export const FIRST_DAY = 4;
export const FIRST_YEAR = 1970;
export const LAST_YEAR = 2100;

const joining = (days: number, index: number, arr: number[]) =>
  days + (index > 0 ? arr.slice(0, index).reduce((a, b) => a + b, 0) : 0);

export const LIST_OF_DAYS_IN_4_YEARS = [
  0,
  ...new Array(4).fill(undefined).map((_, index) => {
    const year = FIRST_YEAR + index;
    return 365 + Number(isLeapYear(year));
  }),
].map(joining);

export const LIST_OF_DAYS_IN_400_YEARS = [
  0,
  ...new Array(400).fill(undefined).map((_, index) => {
    const year = LAST_YEAR + index;
    return 365 + isLeapYear(year);
  }),
].map(joining);

export const DAYS_UP_TO_LAST_YEAR = Math.floor(
  (LIST_OF_DAYS_IN_4_YEARS[LIST_OF_DAYS_IN_4_YEARS.length - 1] *
    (LAST_YEAR - FIRST_YEAR)) /
    (LIST_OF_DAYS_IN_4_YEARS.length - 1)
);

export const DAYS_IN_YEAR_BY_MOTHES: Record<number, number[]> = {
  0: [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31].map(joining),
  1: [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31].map(joining),
};
