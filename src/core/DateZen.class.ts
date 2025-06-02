import Math from '@/math';

import {
  FIRST_DAY,
  FIRST_YEAR,
  MONTHS,
  LIST_OF_DAYS_AFTER_1970,
  LIST_OF_DAYS_BEFORE_1970,
  commulativeMonths,
} from './config';
import { Parts, DateZenInput } from './types';
import { binarySearch, isLeapYear, parseInput, toMillseconds } from './utils';

class DateZen {
  private ts: number = NaN;

  private _memo?: {
    month: number;
    day: number;
    year: number;
    isLeap: number;
  };

  constructor(input?: DateZenInput) {
    this.ts = parseInput(input);
  }

  private get totalDays() {
    return Math.floor(this.ts / 86_400_000);
  }

  private getMemo() {
    if (this._memo) return this._memo;

    let totalDays = this.totalDays;
    let baseYear = 0;
    let LIST;

    if (totalDays >= 0) {
      LIST = LIST_OF_DAYS_AFTER_1970;
      baseYear = FIRST_YEAR;
      const size = LIST.length - 1;
      const lastValue = LIST[size];
      const [yearIndex, restDays] = binarySearch(totalDays % lastValue, LIST);
      const year =
        baseYear + yearIndex + Math.floor(totalDays / lastValue) * size;
      const isLeap = isLeapYear(year);

      const [month, day] = binarySearch(
        restDays,
        commulativeMonths(isLeap, true)
      );
      return (this._memo = { year, month, day: day + 1, isLeap });
    }
    const absDays = -totalDays;

    baseYear = FIRST_YEAR - 1;
    LIST = LIST_OF_DAYS_BEFORE_1970;

    const size = LIST.length - 1;
    const lastValue = LIST[size];
    const [yearIndex, restDays] = binarySearch(absDays % lastValue, LIST, true);
    const year = baseYear - yearIndex - Math.floor(absDays / lastValue) * size;

    const isLeap = isLeapYear(year);
    const [month, day] = binarySearch(
      restDays,
      commulativeMonths(isLeap, false),
      true
    );

    const m = 11 - month;
    return (this._memo = {
      year,
      month: m,
      day: MONTHS[isLeap][m] - day + 1,
      isLeap,
    });
  }

  /**
   * Get the timestamp in millseconds
   * @returns {number} timestamp in millseconds
   */
  toMillseconds(): number {
    return this.ts;
  }

  /**
   * Get the timestamp in seconds
   * @returns {number} timestamp in seconds
   */
  toSeconds(): number {
    return Math.floor(this.ts / 1_000);
  }

  /**
   * Millseconds part of the time
   * @returns {number} 0-999
   */
  millseconds(): number {
    return Math.mod(this.ts, 1_000);
  }

  /**
   * Seconds part of the time
   * @returns {number} 0-59
   */
  seconds(): number {
    return Math.floor(Math.mod(this.ts, 60_000) / 1_000);
  }

  /**
   * Minutes part of the time
   * @returns {number} 0-59
   */
  minutes(): number {
    return Math.floor(Math.mod(this.ts, 3_600_000) / 60_000);
  }

  /**
   * Hours part of the time
   * @returns {number} 0-23
   */
  hours(): number {
    return Math.floor(Math.mod(this.ts, 86_400_000) / 3_600_000);
  }

  /**
   * Day of the week (0-6)
   * @returns {number} 0-6
   * @description 0 - Sunday, 1 - Monday, ..., 6 - Saturday
   */
  weekday(): number {
    const raw = FIRST_DAY + this.totalDays;
    return ((raw % 7) + 7) % 7;
  }

  /**
   * Full year (1970-...)
   * @returns {number} from 1970
   */
  year(): number {
    const { year } = this.getMemo();
    return year;
  }

  /**
   * Month of the year (0-11)
   * @returns {number} 0-11
   * @description
   * 0 - January, 1 - February, ... 11 - December
   */
  monthIndex(): number {
    const { month } = this.getMemo();
    return month;
  }

  /**
   * Month of the year (1-12)
   * @returns {number} 1-12
   * @description
   * 1 - January, 2 - February, ... 12 - December
   */
  month(): number {
    return this.monthIndex() + 1; // Convert to 1-12 range
  }

  /**
   * Day of the month (1-31)
   * @returns {number} 1-31
   */
  day(): number {
    const { day } = this.getMemo();
    return day;
  }

  /**
   * Get the date as an object
   * @returns {object} { year, month, monthIndex, day, hour, minute, second }
   */
  toParts(): Parts {
    return {
      year: this.year(),
      month: this.month(),
      monthIndex: this.monthIndex(),
      day: this.day(),
      hour: this.hours(),
      minute: this.minutes(),
      second: this.seconds(),
      weekday: this.weekday(),
      millisecond: this.millseconds(),
    };
  }

  /**
   * Get the date as a ISO string
   * @returns {string} ISO string
   */
  toISOString(): string {
    if (this.isInvalid()) return 'Invalid Date';

    const { year, month, day, hour, minute, second, millisecond } =
      this.toParts();

    const mm = String(month).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    const HH = String(hour).padStart(2, '0');
    const MM = String(minute).padStart(2, '0');
    const SS = String(second).padStart(2, '0');
    const MS = String(millisecond).padStart(3, '0');
    const TZ = 'Z'; // UTC timezone

    return `${year}-${mm}-${dd}T${HH}:${MM}:${SS}.${MS}${TZ}`;
  }

  /**
   * Add time to the current date and return a new DateZen instance
   * @returns {DateZen}
   */
  add({
    weeks = 0,
    days = 0,
    hours = 0,
    minutes = 0,
    seconds = 0,
    milliseconds = 0,
  }: {
    weeks?: number;
    days?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
    milliseconds?: number;
  }): DateZen {
    const totalSeconds =
      weeks * 7 * 86_400 * 1_000 +
      toMillseconds(days, hours, minutes, seconds, milliseconds);
    return new DateZen(this.ts + totalSeconds);
  }

  /**
   * Subtract time from the current date and return a new DateZen instance
   * @returns {DateZen}
   */
  subtract({
    weeks = 0,
    days = 0,
    hours = 0,
    minutes = 0,
    seconds = 0,
    milliseconds = 0,
  }: {
    weeks?: number;
    days?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
    milliseconds?: number;
  }): DateZen {
    const totalSeconds =
      weeks * 7 * 86_400 * 1_000 +
      toMillseconds(days, hours, minutes, seconds, milliseconds);
    return new DateZen(this.ts - totalSeconds);
  }

  /**
   * Validate the date
   * @returns {boolean} true if the date is valid
   */
  isInvalid(): boolean {
    return Number.isNaN(this.ts);
  }

  /**
   * Interpret the date as a string
   * @returns {string} ISO string
   * @description
   * This method is called when the object is used as a string
   */
  toString(): string {
    return this.toISOString();
  }

  /**
   * Interpret the date as a number
   * @returns {number} timestamp in millseconds
   * @description
   * This method is called when the object is used as a number
   */
  valueOf(): number {
    return this.ts;
  }

  /**
   * Interpret the date as a primitive
   * @param {string} hint - 'string' or 'number'
   * @returns {number | string} timestamp in seconds or ISO string
   * @description
   * This method is called when the object is used as a primitive
   */
  [Symbol.toPrimitive](hint: string): number | string {
    if (hint === 'string') return this.toISOString();
    return this.ts;
  }
}

export default DateZen;
