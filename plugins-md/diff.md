
# 📏 Diff Plugin

The Diff Plugin for DateZen enables you to calculate precise differences between two date instances using a variety of time units. This is particularly useful for determining elapsed time in days, hours, minutes, and more.

This plugin is self-contained and can also be used independently as a standalone function — simply pass in two date parts and a desired unit or array of units.

## 📘 Supported Units

| Unit   | Meaning                 | Example Output |
|--------|-------------------------|----------------|
| `ms`   | Milliseconds            | `60000`        |
| `s`    | Seconds                 | `60`           |
| `m`    | Minutes                 | `1`            |
| `h`    | Hours                   | `0`            |
| `d`    | Days                    | `0`            |
| `w`    | Weeks                   | `0`            |

If an array of units is passed, the return value is an object with each unit as key and the corresponding value.

---

## 🧪 Usage Examples

```ts
import dz from 'datezen';
import diff from 'datezen/diff';

// As standalone function
diff(
  dz({ year: 2024, month: 6, day: 1 }),
  dz({ year: 2024, month: 6, day: 2 }),
  'd'
); // → 1

diff(
  1717243200000,
  1717243200000 + 3_600_000,
  ['h', 'm', 's']
); // → { h: 1, m: 0, s: 0 }

```