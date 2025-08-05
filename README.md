# 📅 DateZen

DateZen is a lightweight date manipulation library for JavaScript, written from scratch without relying on the native Date object. It enables full-range date operations, plugin-based extensibility, and consistent UTC behavior — ideal for applications requiring precision across historical or future timestamps. Handles timestamps from `0001-01-01` through `275760-09-13` with full mathematical precision.

[![NPM Version](https://img.shields.io/npm/v/datezen)](https://www.npmjs.com/package/datezen)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)


## 📖 Table of Contents
- [Features](#-features)
- [Installation](#-installation)
- [Creating an Instance](#-creating-an-instance)
- [API Reference](#-api-reference-table-view)
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


## 🛠 Usage

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


## 🧪 Unit Tests

DateZen is covered by comprehensive unit tests.  
To run them locally:

```bash
npm test
```

Tests are located in: `__tests__/*/*.test.ts`


## 💼 In Practice

Need to validate input, format it, and calculate a range? No problem:

```ts
const from = dz('2024-01-01');
const to = dz('2025-01-01');

console.log(from.format('MMM YYYY')); // "Jan 2024"
console.log(to.diff(from, 'days'));   // 366 (leap year)
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

dz.use('format', formatPlugin)
  .use('diff', diffPlugin);

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

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Latency avg (ns)</th>
      <th>Latency med (ns)</th>
      <th>Throughput avg (opts/s)</th>
      <th>Throughput med (opts/s)</th>
      <th>Samples</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Build DZ from TS</td>
      <td><span style="color:#f1c40f">207.8443</span></td>
      <td><span style="color:#f1c40f">208.0000</span></td>
      <td><span style="color:#2ecc71">5131117.5096</span></td>
      <td><span style="color:#2ecc71">4807692.2988</span></td>
      <td>96226</td>
    </tr>
    <tr>
      <td>Build Native from TS</td>
      <td><span style="color:#2ecc71">98.5723</span></td>
      <td><span style="color:#2ecc71">83.0000</span></td>
      <td><span style="color:#2ecc71">17733106.8982</span></td>
      <td><span style="color:#2ecc71">12048192.7850</span></td>
      <td>202897</td>
    </tr>
    <tr>
      <td>Build DayJS from TS</td>
      <td><span style="color:#f1c40f">196.7619</span></td>
      <td><span style="color:#f1c40f">167.0000</span></td>
      <td><span style="color:#2ecc71">5498373.6116</span></td>
      <td><span style="color:#2ecc71">5988023.9468</span></td>
      <td>101646</td>
    </tr>
    <tr><td colspan="6"></td></tr>
    <tr>
      <td>Build DZ from ISO</td>
      <td><span style="color:#e74c3c">566.9045</span></td>
      <td><span style="color:#e74c3c">458.0000</span></td>
      <td><span style="color:#f1c40f">2140430.0463</span></td>
      <td><span style="color:#f1c40f">2183406.1115</span></td>
      <td>35280</td>
    </tr>
    <tr>
      <td>Build Native from ISO</td>
      <td><span style="color:#f1c40f">319.3653</span></td>
      <td><span style="color:#f1c40f">167.0000</span></td>
      <td><span style="color:#2ecc71">6102465.1746</span></td>
      <td><span style="color:#2ecc71">5988023.9468</span></td>
      <td>65815</td>
    </tr>
    <tr>
      <td>Build DayJS from ISO</td>
      <td><span style="color:#f1c40f">356.3715</span></td>
      <td><span style="color:#f1c40f">292.0000</span></td>
      <td><span style="color:#2ecc71">3354573.6149</span></td>
      <td><span style="color:#2ecc71">3424657.5376</span></td>
      <td>56122</td>
    </tr>
    <tr><td colspan="6"></td></tr>
    <tr>
      <td>DZ .toISO()</td>
      <td><span style="color:#f1c40f">222.1195</span></td>
      <td><span style="color:#f1c40f">208.0000</span></td>
      <td><span style="color:#2ecc71">4802841.3759</span></td>
      <td><span style="color:#2ecc71">4807692.2988</span></td>
      <td>90042</td>
    </tr>
    <tr>
      <td>Native .toISO()</td>
      <td><span style="color:#e74c3c">538.2666</span></td>
      <td><span style="color:#e74c3c">500.0000</span></td>
      <td><span style="color:#f1c40f">1954982.5747</span></td>
      <td><span style="color:#f1c40f">1999999.9996</span></td>
      <td>37157</td>
    </tr>
    <tr>
      <td>DayJS .toISO()</td>
      <td><span style="color:#e74c3c">673.6686</span></td>
      <td><span style="color:#e74c3c">625.0000</span></td>
      <td><span style="color:#f1c40f">1583686.6206</span></td>
      <td><span style="color:#f1c40f">1600000.0008</span></td>
      <td>29689</td>
    </tr>
    <tr><td colspan="6"></td></tr>
    <tr>
      <td>DZ .format()</td>
      <td><span style="color:#e74c3c">3104.4745</span></td>
      <td><span style="color:#e74c3c">2708.0000</span></td>
      <td><span style="color:#f1c40f">361515.1437</span></td>
      <td><span style="color:#f1c40f">369276.2186</span></td>
      <td>6443</td>
    </tr>
    <tr>
      <td>Native .format()</td>
      <td><span style="color:#e74c3c">42199.7389</span></td>
      <td><span style="color:#e74c3c">38625.0000</span></td>
      <td><span style="color:#e74c3c">24717.3536</span></td>
      <td><span style="color:#e74c3c">25889.9676</span></td>
      <td>475</td>
    </tr>
    <tr>
      <td>DayJS .format()</td>
      <td><span style="color:#e74c3c">2342.8481</span></td>
      <td><span style="color:#e74c3c">1875.0000</span></td>
      <td><span style="color:#f1c40f">517796.3177</span></td>
      <td><span style="color:#f1c40f">533333.3334</span></td>
      <td>8681</td>
    </tr>
    <tr><td colspan="6"></td></tr>
    <tr>
      <td>DZ .toMillsec()</td>
      <td><span style="color:#f1c40f">210.1853</span></td>
      <td><span style="color:#f1c40f">208.0000</span></td>
      <td><span style="color:#2ecc71">5063008.1400</span></td>
      <td><span style="color:#2ecc71">4807692.2988</span></td>
      <td>95176</td>
    </tr>
    <tr>
      <td>Native .toMillsec().</td>
      <td><span style="color:#2ecc71">72.8140</span></td>
      <td><span style="color:#2ecc71">83.0000</span></td>
      <td><span style="color:#2ecc71">17656384.7662</span></td>
      <td><span style="color:#2ecc71">12048192.7850</span></td>
      <td>274673</td>
    </tr>
    <tr>
      <td>DayJS .toMillsec()</td>
      <td><span style="color:#f1c40f">188.7202</span></td>
      <td><span style="color:#f1c40f">167.0000</span></td>
      <td><span style="color:#2ecc71">5654137.9073</span></td>
      <td><span style="color:#2ecc71">5988023.9468</span></td>
      <td>105977</td>
    </tr>
  </tbody>
</table>

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

  You’ll be able to use DateZen directly in the browser via:

  ```html
  <script src="https://cdn.jsdelivr.net/npm/datezen"></script>
  ```


## 💬 Community / Contributing
Contributions are welcome! Feel free to open issues or PRs.


## 📄 License

[MIT License](./LICENSE) © 2025 Maksym Cherniavskyi
