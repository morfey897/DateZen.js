import {
  WEEK,
  FIRST_DAY,
  FIRST_YEAR,
  LAST_YEAR,
  SEC_IN_MIN,
  SEC_IN_HOUR,
  SEC_IN_DAY,
  LIST_OF_DAYS_IN_4_YEARS,
  DAYS_IN_YEAR_BY_MOTHES,
  DAYS_UP_TO_LAST_YEAR,
  LIST_OF_DAYS_IN_400_YEARS,
  SEC_IN_WEEK,
  MILLSEC_IN_SEC,
} from './config';
import { Parts, DateZenInput } from './types';
import { binarySearch, isLeapYear, parseInput, toMillseconds } from './utils';

class DateZen {
  // Timestamp in seconds since 01.01.1970 00:00:00 UTC
  private ts: number = NaN;

  private _memo?: {
    month: number;
    day: number;
    year: number;
    isLeap: 0 | 1;
  };

  constructor(input?: DateZenInput) {
    this.ts = parseInput(input);
  }

  private get totalDays() {
    return Math.floor(this.ts / (SEC_IN_DAY * MILLSEC_IN_SEC));
  }

  private getMemo() {
    if (this._memo) return this._memo;
    let totalDays = this.totalDays;

    let baseYear = 0;
    let LIST;
    if (totalDays >= DAYS_UP_TO_LAST_YEAR) {
      totalDays = totalDays - DAYS_UP_TO_LAST_YEAR;
      LIST = LIST_OF_DAYS_IN_400_YEARS;
      baseYear = LAST_YEAR;
    } else {
      LIST = LIST_OF_DAYS_IN_4_YEARS;
      baseYear = FIRST_YEAR;
    }
    const size = LIST.length - 1;
    const lastValue = LIST[size];

    const [yearIndex, restDays] = binarySearch(totalDays % lastValue, LIST);

    const year =
      baseYear + yearIndex + Math.floor(totalDays / lastValue) * size;

    const isLeap = isLeapYear(year);

    const [month, day] = binarySearch(restDays, DAYS_IN_YEAR_BY_MOTHES[isLeap]);
    this._memo = {
      year,
      month,
      day: day + 1,
      isLeap,
    };
    return this._memo;
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
    return Math.floor(this.ts / MILLSEC_IN_SEC);
  }

  /**
   * Millseconds part of the time
   * @returns {number} 0-999
   */
  millseconds(): number {
    return this.ts % MILLSEC_IN_SEC;
  }

  /**
   * Seconds part of the time
   * @returns {number} 0-59
   */
  seconds(): number {
    return Math.floor(
      (this.ts % (SEC_IN_MIN * MILLSEC_IN_SEC)) / MILLSEC_IN_SEC
    );
  }

  /**
   * Minutes part of the time
   * @returns {number} 0-59
   */
  minutes(): number {
    return Math.floor(
      (this.ts % (SEC_IN_HOUR * MILLSEC_IN_SEC)) / (SEC_IN_MIN * MILLSEC_IN_SEC)
    );
  }

  /**
   * Hours part of the time
   * @returns {number} 0-23
   */
  hours(): number {
    return Math.floor(
      (this.ts % (SEC_IN_DAY * MILLSEC_IN_SEC)) / (SEC_IN_HOUR * MILLSEC_IN_SEC)
    );
  }

  /**
   * Day of the week (0-6)
   * @returns {number} 0-6
   * @description
   * 0 - Sunday
   * 1 - Monday
   * 2 - Tuesday
   * 3 - Wednesday
   * 4 - Thursday
   * 5 - Friday
   * 6 - Saturday
   */
  weekday(): number {
    return (((FIRST_DAY + this.totalDays) % WEEK) + WEEK) % WEEK;
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
   * 0 - January
   * 1 - February
   * 2 - March
   * 3 - April
   * 4 - May
   * 5 - June
   * 6 - July
   * 7 - August
   * 8 - September
   * 9 - October
   * 10 - November
   * 11 - December
   */
  month(): number {
    const { month } = this.getMemo();

    return month;
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
   * @returns {object} { year, month, day, hour, minute, second }
   * @description
   * {
   *  year: from 1970 to ...,
   *  month: 0-11,
   *  day: 1-31,
   *  hour: 0-23,
   *  minute: 0-59,
   *  second: 0-59,
   *  weekday: 0-6
   * }
   */
  toParts(): Parts {
    return {
      year: this.year(),
      month: this.month(),
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

    const mm = String(month + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    const HH = String(hour).padStart(2, '0');
    const MM = String(minute).padStart(2, '0');
    const SS = String(second).padStart(2, '0');
    const MS =
      millisecond > 0 ? '.' + String(millisecond).padStart(3, '0') : '';
    const TZ = 'Z'; // UTC timezone

    return `${year}-${mm}-${dd}T${HH}:${MM}:${SS}${MS}${TZ}`;
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
      weeks * SEC_IN_WEEK * MILLSEC_IN_SEC +
      toMillseconds(days, hours, minutes, seconds, milliseconds);
    return new DateZen(this.ts + totalSeconds);
  }

  /**
   * Validate the date
   * @returns {boolean} true if the date is valid
   */
  isInvalid(): boolean {
    return Number.isNaN(this.ts);
  }

  format() {}

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
