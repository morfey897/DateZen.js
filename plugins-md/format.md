# 🎨 Format Plugin

The Format Plugin for DateZen allows you to render UTC-based date instances into human-readable string formats using intuitive tokens.
This plugin is self-contained and can also be used independently as a standalone function — simply pass in the required date parts and a format string without needing to instantiate a DateZen object.

## 📘 Supported Tokens

| Token  | Meaning              | Example |
| ------ | -------------------- | ------- |
| `YYYY` | 4-digit year         | `2024`  |
| `YY`   | 2-digit year         | `24`    |
| `M`    | Month (1–12)         | `6`     |
| `MM`   | Month (01–12)        | `06`    |
| `D`    | Day of month         | `1`     |
| `DD`   | Day of month (01–31) | `01`    |
| `h`    | Hours (0–23)         | `15`    |
| `hh`   | Hours (00–23)        | `15`    |
| `m`    | Minutes (0–59)       | `4`     |
| `mm`   | Minutes (00–59)      | `04`    |
| `s`    | Seconds (0–59)       | `5`     |
| `ss`   | Seconds (00–59)      | `05`    |
| `S`    | Milliseconds (0–999) | `23`    |
| `SSS`  | Milliseconds padded  | `023`   |
| `A`    | Up meridiem (AM/PM)  | `PM`    |
| `a`    | Low meridiem (am/pm) | `pm`    |

---

## 🧪 Usage Examples

```ts
// Use format plugin as standalone function
import format from 'datezen/format';
format(
  {
    year: 2024,
    month: 6,
    day: 1,
    hour: 15,
    minute: 4,
    second: 5,
    millisecond: 23,
  },
  "I'll get the price in YYYY-MM-DD hh:mm:ss.SSS"
); // "I'll get the price in 2024-06-01 15:04:05.023"

format(
  {
    year: 2024,
    month: 6,
    day: 1,
    hour: 9,
    minute: 30,
    second: 15,
    millisecond: 0,
  },
  'hh:mm:ss A'
); // → "09:30:15 AM"
```