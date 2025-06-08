/* eslint-disable no-nested-ternary */
import MathFn from '@/math';
import {
  Parts,
  DateZenInput,
  PluginType,
  PluginFunction,
  DateZenPluginDiff,
  DateZenPluginFormat,
  NumericLike,
} from '@/types';

import { MONTHS, COMMULATIVE_MONTHS } from './config';
import {
  binarySearch,
  isLeapYear,
  toMillseconds,
  getYearAndRestDays,
} from './utils';
import parseInput from './parse';

export const globalPlugins = new Map<PluginType, PluginFunction<PluginType>>();

class DateZen {
  private ts: number = NaN;

  private _month: number = 0;
  private _day: number = 0;
  private _year: number = 0;

  private _hour: number = 0;
  private _minute: number = 0;
  private _second: number = 0;
  private _millisecond: number = 0;
  private _weekday: number = 0;

  private plugins = new Map<PluginType, PluginFunction<PluginType>>();

  constructor(input?: DateZenInput) {
    const result = parseInput(input);
    this.ts = result;

    const totalDays = MathFn.floor(result / 86_400_000);
    const isUpper = totalDays >= 0;
    const [year, restDays] = getYearAndRestDays(totalDays);

    const isLeap = isLeapYear(year);
    const [month, day] = binarySearch(
      restDays,
      COMMULATIVE_MONTHS[Number(isUpper) * 2 + isLeap],
      isUpper
    );

    this._year = year;
    this._month = isUpper ? month : 11 - month;
    this._day = isUpper ? day + 1 : MONTHS[isLeap][11 - month] - day + 1;

    let rest = MathFn.mod(result, 86_400_000);

    this._hour = MathFn.floor(rest / 3_600_000);
    rest %= 3_600_000;

    this._minute = MathFn.floor(rest / 60_000);
    rest %= 60_000;

    this._second = MathFn.floor(rest / 1_000);
    this._millisecond = rest % 1_000;

    this._weekday = MathFn.mod(4 + totalDays, 7);
  }

  /**
   * Use a plugin
   * @param {PluginType} type - Type of the plugin
   * @param {PluginFunction<T>} plugin - Plugin function
   * @returns {this} Current instance
   */
  use<T extends PluginType>(type: T, plugin: PluginFunction<T>): this {
    this.plugins.set(type, plugin);
    return this;
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
    return MathFn.floor(this.ts / 1_000);
  }

  /**
   * Millseconds part of the time
   * @returns {number} 0-999
   */
  millseconds(): number {
    return this._millisecond;
  }

  /**
   * Seconds part of the time
   * @returns {number} 0-59
   */
  seconds(): number {
    return this._second;
  }

  /**
   * Minutes part of the time
   * @returns {number} 0-59
   */
  minutes(): number {
    return this._minute;
  }

  /**
   * Hours part of the time
   * @returns {number} 0-23
   */
  hours(): number {
    return this._hour;
  }

  /**
   * Day of the week (0-6)
   * @returns {number} 0-6
   * @description 0 - Sunday, 1 - Monday, ..., 6 - Saturday
   */
  weekday(): number {
    return this._weekday;
  }

  /**
   * Full year (1970-...)
   * @returns {number} from 1970
   */
  year(): number {
    return this._year;
  }

  /**
   * Month of the year (0-11)
   * @returns {number} 0-11
   * @description
   * 0 - January, 1 - February, ... 11 - December
   */
  monthIndex(): number {
    return this._month;
  }

  /**
   * Month of the year (1-12)
   * @returns {number} 1-12
   * @description
   * 1 - January, 2 - February, ... 12 - December
   */
  month(): number {
    return this._month + 1;
  }

  /**
   * Day of the month (1-31)
   * @returns {number} 1-31
   */
  day(): number {
    return this._day;
  }

  /**
   * Check if the year is a leap year
   * @returns {boolean} true if the year is a leap year
   */
  isLeapYear(): boolean {
    return isLeapYear(this._year) === 1;
  }

  /**
   * Get the date as an object
   * @returns {object} { year, month, monthIndex, day, hour, minute, second }
   */
  toParts(): Parts {
    return {
      year: this._year,
      leapYear: this.isLeapYear(),
      month: this._month + 1,
      monthIndex: this._month,
      day: this._day,
      hour: this._hour,
      minute: this._minute,
      second: this._second,
      weekday: this._weekday,
      millisecond: this._millisecond,
    };
  }

  /**
   * Get the date as a ISO string
   * @returns {string} ISO string
   */
  toISOString(): string {
    if (Number.isNaN(this.ts)) return 'Invalid Date';

    return (
      (this._year < 10
        ? '000' + this._year
        : this._year < 100
          ? '00' + this._year
          : this._year < 1000
            ? '0' + this._year
            : this._year) +
      '-' +
      (this._month + 1 < 10 ? '0' : '') +
      (this._month + 1) +
      '-' +
      (this._day < 10 ? '0' : '') +
      this._day +
      'T' +
      (this._hour < 10 ? '0' : '') +
      this._hour +
      ':' +
      (this._minute < 10 ? '0' : '') +
      this._minute +
      ':' +
      (this._second < 10 ? '0' : '') +
      this._second +
      '.' +
      (this._millisecond < 10 ? '00' : this._millisecond < 100 ? '0' : '') +
      this._millisecond +
      'Z'
    );
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
      weeks * 604_800_000 +
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
      weeks * 604_800_000 +
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

  /**
   * UTILITY METHODS
   */

  /**
   * Check if the date is the same as the given date
   * @param {NumericLike} date - Date to compare with
   * @returns {boolean} true if the dates are the same
   */
  isSame(date: NumericLike): boolean {
    return this.ts === +date;
  }

  /**
   * Check if the date is before the given date
   * @param {NumericLike} date - Date to compare with
   * @returns {boolean} true if the date is before the given date
   */
  isBefore(date: NumericLike): boolean {
    return this.ts < +date;
  }
  /**
   * Check if the date is after the given date
   * @param {NumericLike} date - Date to compare with
   * @returns {boolean} true if the date is after the given date
   */
  isAfter(date: NumericLike): boolean {
    return this.ts > +date;
  }
  /**
   * Check if the date is on or before the given date
   * @param {NumericLike} from - Date to compare with
   * @param {NumericLike} to - Date to compare with
   * @returns {boolean} true if the date is on or before the given date
   */
  isBetween(from: NumericLike, to: NumericLike): boolean {
    const fromTs = +from;
    const toTs = +to;
    return this.ts > fromTs && this.ts < toTs;
  }

  /**
   * Compare two dates
   * @param {NumericLike} dateA - First date to compare
   * @param {NumericLike} dateB - Second date to compare
   * @returns {-1 | 0 | 1} -1 if dateA is before dateB, 0 if they are the same, 1 if dateA is after dateB
   */
  static compare(dateA: NumericLike, dateB: NumericLike): -1 | 0 | 1 {
    return Math.sign(+dateA - +dateB) as -1 | 0 | 1;
  }

  /**
   * PLUGIN METHODS
   */

  /**
   * Format the date using a plugin
   * @param {string} pattern - Pattern to format the date
   * @returns {string} Formatted date
   */
  format(
    pattern: Parameters<DateZenPluginFormat>[1]
  ): ReturnType<DateZenPluginFormat> {
    const plugin = this.plugins.get('format') ?? globalPlugins.get('format');
    if (plugin) {
      const fn = plugin as PluginFunction<'format'>;
      return fn(this.toParts(), pattern);
    }
    console.error('No format plugin registered');
    return pattern;
  }

  /**
   * Get the difference between two dates using a plugin
   * @param {NumericLike} date - Date to compare with
   * @param {string} unit - Unit to return the difference in (default: 'ms')
   * @returns {number | Record<string, number>} Difference in the specified unit(s)
   */
  diff(
    date: Parameters<DateZenPluginDiff>[1],
    unit: Parameters<DateZenPluginDiff>[2] = 'ms'
  ): ReturnType<DateZenPluginDiff> {
    const plugin = this.plugins.get('diff') ?? globalPlugins.get('diff');
    if (plugin) {
      const fn = plugin as PluginFunction<'diff'>;
      return fn(this.ts, date, unit);
    }
    console.error('No diff plugin registered');
    return NaN;
  }
}

export default DateZen;
