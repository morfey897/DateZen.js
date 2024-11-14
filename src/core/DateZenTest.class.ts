class DateZenTest {
  #date: Date;

  constructor(value?: string | number | Date) {
    if (typeof value === 'string' || typeof value === 'number') {
      this.#date = new Date(value);
    } else if (value instanceof Date) {
      this.#date = value;
    } else {
      this.#date = new Date();
    }
  }

  getTime() {
    return this.#date.getTime();
  }

  getMilliseconds() {
    return this.#date.getUTCMilliseconds();
  }

  getSeconds() {
    return this.#date.getUTCSeconds();
  }

  getMinutes() {
    return this.#date.getUTCMinutes();
  }

  getHours() {
    return this.#date.getUTCHours();
  }

  getDay() {
    return this.#date.getUTCDay();
  }

  getFullYear() {
    return this.#date.getUTCFullYear();
  }

  getMonth() {
    return this.#date.getUTCMonth();
  }

  getDate() {
    return this.#date.getUTCDate();
  }
}

export default DateZenTest;
