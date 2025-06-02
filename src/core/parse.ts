import { DateZenInput } from './types';
import { calcDaysSinceEpoch, toMillseconds, isLeapYear } from './utils';
import { MONTHS } from './config';

const invalidInput = (
  y: number,
  m: number,
  d: number,
  hh: number,
  mm: number,
  ss: number,
  ms: number
) =>
  // Check validation hh
  hh < 0 ||
  hh > 23 ||
  // Check validation mm
  mm < 0 ||
  mm > 59 ||
  // Check validation ss
  ss < 0 ||
  ss > 59 ||
  // Check validation ms
  ms < 0 ||
  ms > 999 ||
  // Check validation m
  m < 1 ||
  m > 12 ||
  // Check validation d
  d < 1 ||
  d > MONTHS[isLeapYear(y)][m - 1] ||
  // Check validation y
  y < 0;

function parseISOString(input: string): number {
  const match = input.match(
    /^(\d+)-(\d{2})-(\d{2})[T ](\d{2}):(\d{2}):(\d{2})(\.\d+)?(?:Z)?$/
  );
  if (!match) return NaN;
  const [, y, m, d, hh, mm, ss, millsec] = match.map(Number);
  const ms = Number.isFinite(millsec) ? millsec * 1_000 : 0;
  if (invalidInput(y, m, d, hh, mm, ss, ms)) return NaN;
  const days = calcDaysSinceEpoch(y, m, d);
  return toMillseconds(days, hh, mm, ss, ms);
}

function parseNumber(input: number): number {
  return Number.isFinite(input) ? Math.floor(input) : NaN;
}

function parseObject(input: { value: number; unit: string }): number {
  const { value, unit } = input;
  switch (unit) {
    case 'ms':
      return Number.isFinite(value) ? Math.floor(value) : NaN;
    case 's':
      return Number.isFinite(value) ? Math.floor(value * 1_000) : NaN;
    case 'm':
      return Number.isFinite(value) ? Math.floor(value * 60_000) : NaN;
    case 'h':
      return Number.isFinite(value) ? Math.floor(value * 3_600_000) : NaN;
    case 'd':
      return Number.isFinite(value) ? Math.floor(value * 86_400_000) : NaN;
    default:
      return NaN;
  }
}

function parseParts(input: {
  year: number;
  month?: number;
  monthIndex?: number;
  day: number;
  hour?: number;
  minute?: number;
  second?: number;
  millisecond?: number;
}): number {
  const {
    year: y,
    day: d,
    hour: hh = 0,
    minute: mm = 0,
    second: ss = 0,
    millisecond: millsec = 0,
  } = input;

  let m: number;
  if ('monthIndex' in input && typeof input.monthIndex === 'number') {
    m = input.monthIndex + 1;
  } else if ('month' in input && typeof input.month === 'number') {
    m = input.month;
  } else {
    m = NaN;
  }

  const allAreNumbers = [y, m, d, hh, mm, ss, millsec].every((v) =>
    Number.isFinite(v)
  );

  if (!allAreNumbers) return NaN;
  if (invalidInput(y, m, d, hh, mm, ss, millsec)) return NaN;
  const days = calcDaysSinceEpoch(y, m, d);
  return toMillseconds(days, hh, mm, ss, millsec);
}

function parseInput(input?: DateZenInput): number {
  let ts: number = NaN;
  if (typeof input === 'string') {
    ts = parseISOString(input);
  } else if (typeof input === 'number') {
    ts = parseNumber(input);
  } else if (
    input &&
    typeof input === 'object' &&
    'value' in input &&
    'unit' in input
  ) {
    ts = parseObject(input);
  } else if (
    input &&
    typeof input === 'object' &&
    'year' in input &&
    ('month' in input || 'monthIndex' in input) &&
    'day' in input
  ) {
    ts = parseParts(input);
  } else {
    ts = Math.floor(Date.now());
  }

  return Number.isFinite(ts) &&
    ts >= Number.MIN_SAFE_INTEGER &&
    ts <= Number.MAX_SAFE_INTEGER
    ? ts
    : NaN;
}

export default parseInput;
