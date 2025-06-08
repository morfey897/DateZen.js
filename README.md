# 📅 DateZen

> Lightweight, native-independent date utility library supporting full-range calculations — from `0001-01-01` to `275760-09-13`.

## 📖 Table of Contents
- [Features](#-features)
- [Installation](#-installation)
- [Creating an Instance](#-creating-an-instance)
- [API Reference](#-api-reference)
- [Plugin System](#-plugin-system)
- [Format Plugin](./plugins-md/format.md)
- [Diff Plugin](./plugins-md/diff.md)
- [Why DateZen?](#-why-datezen)
- [Architecture](#-architecture)
- [Math-Powered Precision](#-math-powered-precision)
- [Benchmarks](#-benchmarks-vs-native-date)
- [Planned features](#-planned-features)
- [Community / Contributing](#-community--contributing)
- [License](#-license)


## ✨ Features

- ⚖️ Zero dependency & fully native-independent
- 🪶 Works from `0001-01-01T00:00:00.000Z` to `275760-09-13T00:00:00.000Z`
- 🔢 Pure mathematical timestamp handling (no `Date` under the hood)
- 🧩 Plugin system for extensibility (e.g. formatting, diffing, comparing)
- 🧪 Tested against native JS behavior (via benchmarks and precision tests)


## 🚀 Installation

```bash
npm install datezen
```
or
```bash
yarn add datezen
```


## 📦 Creating an Instance

You can create a DateZen instance in various ways depending on your input format:

```ts
import dz from 'datezen';

/**
 * From an ISO string
 */
const a = dz('2024-06-01T12:00:00Z');

/**
 * From a timestamp in milliseconds
 */
const b = dz(1717243200000);

/**
 * From a value + unit object
 * Type: { value: number; unit: 'ms' | 's' | 'm' | 'h' | 'd' }
 */
const c1 = dz({ value: 86400, unit: 's' }); // → 1 day in seconds
const c2 = dz({ value: 86400000, unit: 'ms' }); // → 1 day in milliseconds
const c3 = dz({ value: 1440, unit: 'm' }); // → 1 day in minutes
const c4 = dz({ value: 24, unit: 'h' }); // → 1 day in hours
const c5 = dz({ value: 1, unit: 'd' }); // → 1 day

/**
 * From a full date object
 * Type: { year: number; month: number (1–12); day: number; hour?: number; minute?: number; second?: number; millisecond?: number }
 */
const d = dz({
  year: 2024,
  month: 6, //June
  day: 1,
  hour: 12,
  minute: 0,
  second: 0,
  millisecond: 0,
});

/**
 * From a date object using monthIndex
 * Type: { year: number; monthIndex: number (0–11); day: number; hour?: number; minute?: number; second?: number; millisecond?: number }
 */
const e = dz({
  year: 2024,
  monthIndex: 4, // May
  day: 1,
});

/**
 * From current time (default)
 */
const now = dz();
```


### 🧩 API Reference (Table View)

| Method                         | Return Type          | Description                                             |
|--------------------------------|----------------------|---------------------------------------------------------|
| `toMilliseconds()`             | `number`             | Returns the timestamp in milliseconds.                  |
| `toSeconds()`                  | `number`             | Returns the timestamp in seconds.                       |
| `milliseconds()`               | `number`             | Milliseconds part of the time (0–999).                  |
| `seconds()`                    | `number`             | Seconds part of the time (0–59).                        |
| `minutes()`                    | `number`             | Minutes part of the time (0–59).                        |
| `hours()`                      | `number`             | Hours part of the time (0–23).                          |
| `weekday()`                    | `number`             | Day of the week (0–6, where 0 is Sunday).               |
| `year()`                       | `number`             | Returns the full year.                                  |
| `monthIndex()`                 | `number`             | Month (0–11).                                           |
| `month()`                      | `number`             | Month (1–12).                                           |
| `day()`                        | `number`             | Day of the month (1–31).                                |
| `isLeapYear()`                 | `boolean`            | Checks if the year is a leap year.                      |
| `toParts()`                    | `object`             | Returns all components of the date.                     |
| `toISOString()`                | `string`             | Returns ISO string if valid; otherwise `"Invalid Date"`.|
| `toString()`                   | `string`             | Same as `toISOString()`.                                |
| `add({...})`                   | `DateZen`            | Returns a new instance with time added.                 |
| `sub({...})`                   | `DateZen`            | Returns a new instance with time subtracted.            |
| `isInvalid()`                  | `boolean`            | Returns `true` if the date is invalid.                  |
| `isSame(other)`                | `boolean`            | Checks if the given date is equal.                      |
| `isBefore(other)`              | `boolean`            | Checks if the date is before the given date.            |
| `isAfter(other)`               | `boolean`            | Checks if the date is after the given date.             |
| `isBetween(a, b)`              | `boolean`            | Returns true if date is strictly between `a` and `b`.   |
| `format(pattern)` *(plugin)*   | `string`             | Formats the date according to the pattern.              |
|                                |                      | Requires `format` plugin.                               |
| `diff(other, unit)` *(plugin)* | `number` or `object` | Calculates time difference. Requires `diff` plugin.     |
| `use(type, fn)`                | `void`               | Registers a plugin for the instance.                    |
 -----------------------------------------------------------------------------------------------------------------


## 🔌 Plugin System

DateZen supports plugins that extend its functionality in a modular way.
You can use them globally via `dz.use()` or locally via `instance.use()`.

- [🎨 Format Plugin](./plugins-md/format.md)
- [📏 Diff Plugin](./plugins-md/diff.md)

Register plugin globally:

```ts
import dz from 'datezen';
import formatPlugin from 'datezen/format';
import diffPlugin from 'datezen/diff';

dz.use('format', formatPlugin).use('diff', diffPlugin);

const date = dz('2024-06-01T12:00:00Z');
console.log(date.format('YYYY-MM-DD')); // → "2024-06-01"

/**
 * To override or apply plugins only to the current instance, use the .use() method.
 * This allows per-instance plugin behavior without affecting global configuration.
 * @param {{ year: number; month: number; day: number; hours: number; minutes: number; seconds: number; milliseconds: number }} - Time to subtract
 * @param {string} - pattern
 */
data.use('format', function (data: PartDate, pattern: string) {
  return pattern;
});
```


## 🧱 Architecture

- Internally uses millisecond-based math to calculate date/time
- Day calculations are performed using purely mathematical functions without iteration
- Binary search optimizations for month lookup
- No reliance on Date, Intl, or locale-specific behavior
- Memory-safe design with local memoization


## 💡 Why DateZen?

Working with dates in JavaScript is often complex and unpredictable. Native date handling lacks clear formatting support and often fails when dealing with negative timestamps (i.e., dates before 1970). This inconsistency leads to cumbersome workarounds and increased code complexity.

Most libraries are simply wrappers over native `Date` behavior. My goal was to build a fully independent and transparent UTC-based timestamp library — built entirely from scratch — that behaves consistently across all valid inputs.

If your goal is extreme performance, native solutions might be better suited and should be tailored for your needs. However, if your priorities are clarity, formatting, manipulation, and consistent behavior across all ranges, DateZen is for you.


## ⚙️ Math-Powered Precision

All core calculations in DateZen — including conversion from timestamps to date parts — are built upon pure mathematical formulas with **O(1)** complexity, ensuring reliable and fast computations at scale.


## 🧪 Benchmarks (vs Native Date)

Performance is not the primary goal. DateZen focuses on range, predictability, and extensibility over raw speed.


## 🛠 Planned Features

The following improvements are planned to enhance DateZen's capabilities:

- 🕐 **Timezone Parsing Support**  
  Add native support for parsing ISO strings with timezone offsets (e.g., `+02:00`, `Z`).

- 🌐 **Timezone Plugin**  
  A plugin to allow conversion between UTC and arbitrary IANA timezones (e.g., `Europe/Berlin`, `America/New_York`).

- 📊 **Compare Plugin**  
  Enables sorting and comparison operations across date instances (e.g., `.compare(a, b)`).

- 📦 **CDN Support**  
  Coming soon via jsDelivr or unpkg.


## 💬 Community / Contributing
Contributions are welcome! Feel free to open issues or PRs.


## 📄 License

[MIT License](./LICENSE) © 2025 Maksym Cherniavskyi
