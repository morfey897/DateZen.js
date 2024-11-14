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
import { Output } from './constants';
import { binarySearch, isLeapYear } from './utils';

class DateZen {
  #time: number;

  constructor(value?: string | number | Date) {
    let time = 0;
    if (typeof value === 'string') {
      // TODO: Implement parsing of string date
      time = new Date(value).getTime();
    } else if (typeof value === 'number') {
      time = value;
    } else if (value instanceof Date) {
      time = value.getTime();
    } else {
      time = new Date().getTime();
    }
    this.#time = time;
  }

  get #totalSeconds() {
    return Math.floor(this.#time / MILLSEC_IN_SEC);
  }

  get #totalDays() {
    return Math.floor(this.#totalSeconds / SEC_IN_DAY);
  }

  getTime() {
    return this.#time;
  }

  getMilliseconds() {
    return this.#time % MILLSEC_IN_SEC;
  }

  getSeconds() {
    return this.#totalSeconds % SEC_IN_MIN;
  }

  getMinutes() {
    return Math.floor((this.#totalSeconds % SEC_IN_HOUR) / SEC_IN_MIN);
  }

  getHours() {
    return Math.floor((this.#totalSeconds % SEC_IN_DAY) / SEC_IN_HOUR);
  }

  getDay() {
    // Math.floor((this.#totalSeconds % SEC_IN_WEEK) / SEC_IN_DAY))
    return (FIRST_DAY + this.#totalDays) % WEEK;
  }

  getFullYear() {
    let totalDays = this.#totalDays;

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
    year +=
      Math.floor(totalDays / lastValue) * size +
      binarySearch(totalDays % lastValue, LIST, Output.index);

    return year;
  }

  getUTCMonth(): number {
    return 1;
  }

  getMonth() {
    let totalDays = this.#totalDays;

    let LIST;
    let year = 0;
    if (totalDays >= DAYS_UP_TO_LAST_YEAR) {
      totalDays = totalDays - DAYS_UP_TO_LAST_YEAR;
      LIST = LIST_OF_DAYS_IN_400_YEARS;
      year = LAST_YEAR;
    } else {
      LIST = LIST_OF_DAYS_IN_4_YEARS;
      year = FIRST_YEAR;
    }
    totalDays = totalDays % LIST[LIST.length - 1];

    const [yearIndex, restDays] = binarySearch(totalDays, LIST, undefined);

    const isLeap = isLeapYear(year + yearIndex);

    const month = binarySearch(
      restDays,
      DAYS_IN_YEAR_BY_MOTHES[isLeap],
      Output.index
    );

    return month;
  }

  getDate() {
    let totalDays = this.#totalDays;

    let LIST;
    let year = 0;
    if (totalDays >= DAYS_UP_TO_LAST_YEAR) {
      totalDays = totalDays - DAYS_UP_TO_LAST_YEAR;
      LIST = LIST_OF_DAYS_IN_400_YEARS;
      year = LAST_YEAR;
    } else {
      LIST = LIST_OF_DAYS_IN_4_YEARS;
      year = FIRST_YEAR;
    }
    totalDays = totalDays % LIST[LIST.length - 1];

    const [yearIndex, restDays] = binarySearch(totalDays, LIST, undefined);

    const isLeap = isLeapYear(year + yearIndex);

    const days = binarySearch(
      restDays,
      DAYS_IN_YEAR_BY_MOTHES[isLeap],
      Output.rest
    );

    return days + 1;
  }
}

export default DateZen;
