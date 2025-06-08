import { PluginParts as Parts } from '@/types';

const getRegex = (key: string) =>
  new RegExp(`(?<![a-zA-Z0-9\\\\])(?<!\\\\)${key}(?![a-zA-Z0-9])`);

const REG_EXP =
  /(?<![a-zA-Z0-9\\])(?<!\\)(Y{1,4}|M{1,2}|D{1,2}|h{1,2}(?:\s*A|a)?|m{1,2}(?:\s*A|a)?|s{1,2}(?:\s*A|a)?|ms(?:\s*A|a)?|A|a)(?![a-zA-Z0-9])/g;

const REMOVE_BACKSLASH = /\\([YMDhmsAa])/g;

const AM_PM = /(?:\s*)(A|a)(?:\s*)/;
const AM_PM_ONLY = /^(?:\s*)(A|a)(?:\s*)$/;

const toString = (value: number | undefined, key: string | number) => {
  let pad = 1;
  if (typeof key === 'number') {
    pad = key;
  } else {
    pad = key === 'ms' ? 3 : key.length;
  }
  return String(value).padStart(pad, '0');
};

const toHH12 = (date: Parts, pad: number = 1) => {
  const rest = Number(date.hour) % 12;
  return toString(rest === 0 ? 12 : rest, pad);
};

// AM/PM with hour
const getAMPM = (value: Parts, key?: string): string | boolean => {
  if (!key) return false;
  const isAMPM = AM_PM_ONLY.test(key);
  if (isAMPM) return true;
  const isA = key.endsWith('A');
  const isa = key.endsWith('a');
  if (!isA && !isa) return false;
  if (!Number.isFinite(value.hour)) return key;
  const h12 = Number(value.hour) >= 12 ? 'PM' : 'AM';
  if (isA) return h12;
  if (isa) return h12.toLowerCase();
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

function format(date: Parts, pattern: string) {
  const match = pattern.match(REG_EXP);

  if (!match) return pattern;

  const parts = new Map<string, string>();

  const replaceWithAMPM = (key: string, number: number = 0, p?: string[]) => {
    const ampm = getAMPM(date, key);
    if (ampm) {
      if (parts.has('h')) parts.set('h', toHH12(date));
      if (parts.has('hh')) parts.set('hh', toHH12(date, 2));
      if (typeof ampm === 'string') {
        const value =
          p?.reduce(
            (acc, v) => acc.replace(getRegex(v), toString(number, v)),
            key.replace(AM_PM, ampm)
          ) || '';
        parts.set(key, value);
      } else if (ampm === true) {
        const h12 = Number(date.hour) >= 12 ? 'PM' : 'AM';
        parts.set(key, key === 'A' ? h12 : h12.toLowerCase());
      }
    } else {
      parts.set(key, toString(number, key));
    }
  };

  const len = match.length;
  for (let i = 0; i < len; i++) {
    const key = match[i];
    if (parts.has(key)) continue;
    // Process the Y/M/D parts first
    if (key.startsWith('Y')) {
      parts.set(key, toString(date.year, key));
      continue;
    }
    if (key.startsWith('M')) {
      parts.set(key, toString(date.month, key));
      continue;
    }
    if (key.startsWith('D')) {
      parts.set(key, toString(date.day, key));
      continue;
    }
    // Process the h part with AM/PM
    if (key.startsWith('h')) {
      replaceWithAMPM(key, date.hour, ['hh', 'h']);
      continue;
    }
    // Process the ms part without AM/PM
    if (key.startsWith('ms')) {
      replaceWithAMPM(key, date.millisecond, ['ms']);
      continue;
    }
    // Process the m part with AM/PM
    if (key.startsWith('m')) {
      replaceWithAMPM(key, date.minute, ['mm', 'm']);
      continue;
    }
    // Process the s part with AM/PM
    if (key.startsWith('s')) {
      replaceWithAMPM(key, date.second, ['ss', 's']);
      continue;
    }
    // Process the A/a part
    if (key === 'A' || key === 'a') {
      replaceWithAMPM(key);
      continue;
    }
  }

  return replaceTokens(pattern, parts);
}

export default format;
