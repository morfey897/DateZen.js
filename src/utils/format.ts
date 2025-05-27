import { DateZenInput, Parts } from '../types';
import DateZen from '../core/DateZen';

enum TU {
  ms = 'ms',
  s = 's',
  ss = 'ss',
  m = 'm',
  mm = 'mm',
  h = 'h',
  hh = 'hh',
  D = 'D',
  DD = 'DD',
  M = 'M',
  MM = 'MM',
  Y = 'Y',
  YY = 'YY',
  YYY = 'YYY',
  YYYY = 'YYYY',
  A = 'A',
  a = 'a',
}

const getRegex = (key: string, flags?: string) =>
  new RegExp(`(?<![a-zA-Z0-9\\\\])(?<!\\\\)${key}(?![a-zA-Z0-9])`, flags);

const REG_EXP = getRegex(
  `(${[
    TU.Y,
    TU.YY,
    TU.YYY,
    TU.YYYY,
    TU.M,
    TU.MM,
    TU.D,
    TU.DD,
    TU.h,
    TU.hh,
    `${TU.h}\\s*${TU.A}`,
    `${TU.h}\\s*${TU.a}`,
    TU.m,
    TU.mm,
    `${TU.m}\\s*${TU.A}`,
    `${TU.m}\\s*${TU.a}`,
    TU.s,
    TU.ss,
    `${TU.s}\\s*${TU.A}`,
    `${TU.s}\\s*${TU.a}`,
    TU.ms,
    `${TU.ms}\\s*${TU.A}`,
    `${TU.ms}\\s*${TU.a}`,
    TU.A,
    TU.a,
  ].join('|')})`,
  'g'
);

const REMOVE_BACKSLASH = /\\([YMDhmsAa])/g;

const AM_PM = new RegExp(`${TU.A}|${TU.a}`);
const AM_PM_ONLY = new RegExp(`^${TU.A}|${TU.a}$`);

const toHH12 = (date: Parts, pad: number = 1) => {
  const rest = Number(date.hour) % 12;
  const hour12 = rest === 0 ? 12 : rest;
  return hour12.toString().padStart(pad, '0');
};

const handlers: {
  [key in TU]: (value: Parts, key?: string) => string;
} = {
  // Year
  [TU.Y]: (value) => Number(value.year).toString(),
  [TU.YY]: (value) => Number(value.year).toString().padStart(2, '0'),
  [TU.YYY]: (value) => Number(value.year).toString().padStart(3, '0'),
  [TU.YYYY]: (value) => Number(value.year).toString().padStart(4, '0'),
  // Month
  [TU.M]: (value) => (Number(value.month) + 1).toString(),
  [TU.MM]: (value) => (Number(value.month) + 1).toString().padStart(2, '0'),
  // Day
  [TU.D]: (value) => Number(value.day).toString(),
  [TU.DD]: (value) => Number(value.day).toString().padStart(2, '0'),
  // Hour
  [TU.h]: (value) => Number(value.hour).toString(),
  [TU.hh]: (value) => Number(value.hour).toString().padStart(2, '0'),
  // Minute
  [TU.m]: (value) => Number(value.minute).toString(),
  [TU.mm]: (value) => Number(value.minute).toString().padStart(2, '0'),
  // Second
  [TU.s]: (value) => Number(value.second).toString(),
  [TU.ss]: (value) => Number(value.second).toString().padStart(2, '0'),
  // Millisecond
  [TU.ms]: (value) => Number(value.millisecond).toString().padStart(3, '0'),
  // AM/PM
  [TU.A]: (value) => (Number(value.hour) >= 12 ? 'PM' : 'AM'),
  [TU.a]: (value) => (Number(value.hour) >= 12 ? 'pm' : 'am'),
};

// AM/PM with hour
const getAMPM = (value: Parts, key?: string): string | boolean => {
  if (!key) return false;
  const isAMPM = AM_PM_ONLY.test(key);
  if (isAMPM) return true;
  const isA = key.endsWith(TU.A);
  const isa = key.endsWith(TU.a);
  if (!isA && !isa) return false;
  if (!Number.isFinite(value.hour)) return key.endsWith(TU.A) ? TU.A : TU.a;
  if (isA) return handlers.A(value);
  if (isa) return handlers.a(value);
  return false;
};

function replaceTokens(pattern: string, memoize: Map<string, string>): string {
  const regexCache = new Map<string, RegExp>();

  const replaced = [...memoize.entries()].reduce((acc, [key, value]) => {
    let tokenRegex = regexCache.get(key);
    if (!tokenRegex) {
      tokenRegex = getRegex(key);
      regexCache.set(key, tokenRegex);
    }

    return acc.replace(tokenRegex, value);
  }, pattern);

  return replaced.replace(REMOVE_BACKSLASH, '$1');
}

function format(input: DateZenInput | DateZen, pattern: string) {
  const match = pattern.match(REG_EXP);

  if (!match) return pattern;

  const parts = new Map<string, string>();
  const dateZn = input instanceof DateZen ? input : new DateZen(input);

  const date = dateZn.toParts();

  const replaceWithAMPM = (key: string, p?: string[]) => {
    const ampm = getAMPM(date, key);
    if (ampm) {
      if (parts.has(TU.h)) {
        parts.set(TU.h, toHH12(date));
      }
      if (parts.has(TU.hh)) {
        parts.set(TU.hh, toHH12(date, 2));
      }
      if (typeof ampm === 'string') {
        const value =
          p?.reduce(
            (acc, v) => acc.replace(getRegex(v), handlers[v as TU](date)),
            key.replace(AM_PM, ampm)
          ) || '';
        parts.set(key, value);
      } else if (ampm === true) {
        parts.set(key, handlers[key as TU](date));
      }
    } else {
      parts.set(key, handlers[key as TU](date));
    }
  };

  for (const key of match) {
    if (parts.has(key)) continue;
    // Process the Y/M/D parts first
    if (key.startsWith(TU.Y) || key.startsWith(TU.M) || key.startsWith(TU.D)) {
      parts.set(key, handlers[key as TU](date));
      continue;
    }
    // Process the h part with AM/PM
    if (key.startsWith(TU.h)) {
      replaceWithAMPM(key, [TU.hh, TU.h]);
      continue;
    }
    // Process the ms part without AM/PM
    if (key.startsWith(TU.ms)) {
      replaceWithAMPM(key, [TU.ms]);
      continue;
    }
    // Process the m part with AM/PM
    if (key.startsWith(TU.m)) {
      replaceWithAMPM(key, [TU.mm, TU.m]);
      continue;
    }
    // Process the s part with AM/PM
    if (key.startsWith(TU.s)) {
      replaceWithAMPM(key, [TU.ss, TU.s]);
      continue;
    }
    // Process the A/a part
    if (key === TU.A || key === TU.a) {
      replaceWithAMPM(key);
      continue;
    }
  }

  return replaceTokens(pattern, parts);
}

export default format;
