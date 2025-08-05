import type {
  PluginParts as Parts,
  DateZenPluginFormat,
  Dictionary,
} from '@/shared/types';

const GLOBAL_DICTIONARY: Record<string, Dictionary> = {};

const getRegex = (key: string, flags?: string) =>
  new RegExp(`(?<![a-zA-Z0-9\\\\])(?<!\\\\)${key}(?![a-zA-Z0-9])`, flags);

const REG_EXP =
  /(?<![a-zA-Z0-9\\])(?<!\\)(Y{1,4}|M{1,5}|D{1,2}|E{1,5}|h{1,2}(?:\s*A|a)?|m{1,2}(?:\s*A|a)?|s{1,2}(?:\s*A|a)?|S|SSS(?:\s*A|a)?|A|a)(?![a-zA-Z0-9])/g;

const REMOVE_BACKSLASH = /\\([YMDhmsAa])/g;

const AM_PM = /(?:\s*)(A|a)(?:\s*)/;
const AM_PM_ONLY = /^(?:\s*)(A|a)(?:\s*)$/;

const toString = (value: number | undefined, key: string | number) => {
  const pad = typeof key === 'number' ? key : key.length;
  return String(value).padStart(pad, '0');
};

const toHH12 = (date: Parts, pad: number = 1) => {
  const rest = Number(date.hours) % 12;
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
  if (!Number.isFinite(value.hours)) return key;
  const h12 = Number(value.hours) >= 12 ? 'PM' : 'AM';
  if (isA) return h12;
  if (isa) return h12.toLowerCase();
  return false;
};

function replaceTokens(
  pattern: string,
  memoize: Map<string, string>,
  repeat: Set<string>
): string {
  const regexCache = new Map<string, RegExp>();
  const replaced = [...memoize.entries()].reduce((acc, [key, value]) => {
    let tokenRegex = regexCache.get(key);
    if (!tokenRegex) {
      tokenRegex = getRegex(key, repeat.has(key) ? 'g' : undefined);
      regexCache.set(key, tokenRegex);
    }
    return acc.replace(tokenRegex, value);
  }, pattern);

  return replaced.replace(REMOVE_BACKSLASH, '$1');
}

function getTranslation(
  key: string,
  index: number,
  options?: {
    dictionary?: Dictionary;
    locale?: string;
  }
) {
  const dict =
    options?.dictionary ||
    GLOBAL_DICTIONARY[options?.locale || Object.keys(GLOBAL_DICTIONARY)[0]];

  const translation = dict ? dict[key as keyof Dictionary] : undefined;
  const translationValue = translation ? translation[index] : undefined;
  return translationValue;
}

function getWeekday(date: Parts) {
  let y = date.year;
  let m = date.month;
  const d = date.day;
  if (typeof y !== 'number' || typeof m !== 'number' || typeof d !== 'number')
    return undefined;

  if (m < 3) {
    m += 12;
    y -= 1;
  }

  const K = y % 100;
  const J = Math.floor(y / 100);

  const h =
    (d +
      Math.floor((13 * (m + 1)) / 5) +
      K +
      Math.floor(K / 4) +
      Math.floor(J / 4) +
      5 * J) %
    7;

  return (h + 6) % 7; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
}

const isoWeekDay = (jsDay: number) => ((jsDay + 6) % 7) + 1;

function format(...params: Parameters<DateZenPluginFormat>): string {
  const [date, pattern, options] = params;
  const match = pattern.match(REG_EXP);

  if (!match) return pattern;

  const parts = new Map<string, string>();
  const repeat = new Set<string>();

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
        const h12 = Number(date.hours) >= 12 ? 'PM' : 'AM';
        parts.set(key, key === 'A' ? h12 : h12.toLowerCase());
      }
    } else {
      parts.set(key, toString(number, key));
    }
  };

  const len = match.length;
  for (let i = 0; i < len; i++) {
    const key = match[i];
    if (parts.has(key)) {
      repeat.add(key);
      continue;
    }
    // Process the Y/M/D parts first
    if (key.startsWith('Y')) {
      parts.set(key, toString(date.year, key));
      continue;
    }
    if (key.startsWith('M')) {
      if (key.length > 2) {
        const translationValue =
          typeof date.month === 'number'
            ? getTranslation(key, date.month - 1, options)
            : undefined;
        if (translationValue) {
          parts.set(key, translationValue);
        } else {
          throw new Error(
            `No translation found for key "${key}" by options.locale "${options?.locale}" or global dictionary. Formatting will fail..`
          );
        }
      } else {
        parts.set(key, toString(date.month, key));
      }
      continue;
    }
    if (key.startsWith('E')) {
      const weekday = getWeekday(date);
      if (key.length > 2) {
        const translationValue =
          typeof weekday === 'number'
            ? getTranslation(key, weekday, options)
            : undefined;
        if (translationValue) {
          parts.set(key, translationValue);
        } else {
          throw new Error(
            `No translation found for key "${key}" by options.locale "${options?.locale}" or global dictionary. Formatting will fail..`
          );
        }
      } else {
        parts.set(
          key,
          toString(
            typeof weekday === 'number' ? isoWeekDay(weekday) : undefined,
            key
          )
        );
      }
      continue;
    }
    if (key.startsWith('D')) {
      parts.set(key, toString(date.day, key));
      continue;
    }
    // Process the h part with AM/PM
    if (key.startsWith('h')) {
      replaceWithAMPM(key, date.hours, ['hh', 'h']);
      continue;
    }
    // Process the m part with AM/PM
    if (key.startsWith('m')) {
      replaceWithAMPM(key, date.minutes, ['mm', 'm']);
      continue;
    }
    // Process the s part with AM/PM
    if (key.startsWith('s')) {
      replaceWithAMPM(key, date.seconds, ['ss', 's']);
      continue;
    }
    // Process the S part without AM/PM
    if (key.startsWith('S')) {
      replaceWithAMPM(key, date.milliseconds, ['SSS', 'S']);
      continue;
    }
    // Process the A/a part
    if (key === 'A' || key === 'a') {
      replaceWithAMPM(key);
      continue;
    }
  }

  return replaceTokens(pattern, parts, repeat);
}

format.registerDictionary = (
  localeOrDictionaries: string | Record<string, Dictionary>,
  dictionary?: Dictionary
) => {
  if (typeof localeOrDictionaries === 'string' && dictionary) {
    GLOBAL_DICTIONARY[localeOrDictionaries] = Object.entries(dictionary).reduce(
      (acc, [key, value]) => {
        if (Array.isArray(value)) {
          acc[key as keyof Dictionary] = [...value];
        }
        return acc;
      },
      {} as Dictionary
    );
  } else if (
    typeof localeOrDictionaries === 'object' &&
    localeOrDictionaries !== null
  ) {
    Object.entries(localeOrDictionaries).forEach(([locale, dict]) => {
      GLOBAL_DICTIONARY[locale] = Object.entries(dict).reduce(
        (acc, [key, value]) => {
          if (Array.isArray(value)) {
            acc[key as keyof Dictionary] = [...value];
          }
          return acc;
        },
        {} as Dictionary
      );
    });
  }
  return format;
};

export default format;
