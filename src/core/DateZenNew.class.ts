import {
  WEEK,
  FIRST_DAY,
  FIRST_YEAR,
  LAST_YEAR,
  MILLSEC_IN_SEC,
  SEC_IN_MIN,
  SEC_IN_HOUR,
  SEC_IN_DAY,
  LIST_OF_DAYS_IN_4_YEARS,
  DAYS_IN_YEAR_BY_MOTHES,
  DAYS_UP_TO_LAST_YEAR,
  LIST_OF_DAYS_IN_400_YEARS,
} from './config';
import { binarySearch, isLeapYear } from './utils';

class DateZenNew {
  #time: number = 0;
  #milliseconds: number = 0;
  #seconds: number = 0;
  #minutes: number = 0;
  #hours: number = 0;
  #day: number = 0;
  #date: number = 0;
  #month: number = 0;
  #year: number = 0;

  constructor(value?: string | number | Date) {
    let time = 0;
    if (typeof value === 'string') {
      // TODO: Implement parsing of string date
      time = 10000; //new Date(value).getTime();
    } else if (typeof value === 'number') {
      time = value;
    } else if (value instanceof Date) {
      time = value.getTime();
    } else {
      time = 0; //new Date().getTime();
    }
    this.#computeDate(time);
  }

  #computeDate(time: number) {
    this.#time = time;
    this.#milliseconds = time % MILLSEC_IN_SEC;
    this.#seconds = Math.floor(time / MILLSEC_IN_SEC) % SEC_IN_MIN;
    this.#minutes = Math.floor(
      (Math.floor(time / MILLSEC_IN_SEC) % SEC_IN_HOUR) / SEC_IN_MIN
    );
    this.#hours = Math.floor(
      (Math.floor(time / MILLSEC_IN_SEC) % SEC_IN_DAY) / SEC_IN_HOUR
    );

    let totalDays = Math.floor(Math.floor(time / MILLSEC_IN_SEC) / SEC_IN_DAY);

    this.#day = (FIRST_DAY + totalDays) % WEEK;

    let year = 0;

    let LIST;
    if (totalDays >= DAYS_UP_TO_LAST_YEAR) {
      totalDays = totalDays - DAYS_UP_TO_LAST_YEAR;
      LIST = LIST_OF_DAYS_IN_400_YEARS;
      year = LAST_YEAR;
    } else {
      LIST = LIST_OF_DAYS_IN_4_YEARS;
      year = FIRST_YEAR;
    }
    const size = LIST.length - 1;
    const lastValue = LIST[size];
    year += Math.floor(totalDays / lastValue) * size;

    totalDays = totalDays % lastValue;
    const [addYear, restDays] = binarySearch(totalDays, LIST, undefined);
    year += addYear;
    this.#year = year;

    const isLeap = isLeapYear(year);

    const [month, date] = binarySearch(
      restDays,
      DAYS_IN_YEAR_BY_MOTHES[isLeap],
      undefined
    );

    this.#month = month;
    this.#date = date + 1;
  }

  getTime() {
    return this.#time;
  }

  getMilliseconds() {
    return this.#milliseconds;
  }

  getSeconds() {
    return this.#seconds;
  }

  getMinutes() {
    return this.#minutes;
  }

  getHours() {
    return this.#hours;
  }

  getDay() {
    return this.#day;
  }

  getFullYear() {
    return this.#year;
  }

  getMonth() {
    return this.#month;
  }

  getDate() {
    return this.#date;
  }
}

export default DateZenNew;
