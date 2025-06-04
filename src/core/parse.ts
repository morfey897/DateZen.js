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
) => {
  const isFinite = Number.isFinite;
  return (
    // Check validation y
    y < 0 ||
    !isFinite(y) ||
    // Check validation m
    m < 1 ||
    m > 12 ||
    !isFinite(m) ||
    // Check validation d
    d < 1 ||
    d > MONTHS[isLeapYear(y)][m - 1] ||
    !isFinite(d) ||
    // Check validation hh
    hh < 0 ||
    hh > 23 ||
    !isFinite(hh) ||
    // Check validation mm
    mm < 0 ||
    mm > 59 ||
    !isFinite(mm) ||
    // Check validation ss
    ss < 0 ||
    ss > 59 ||
    !isFinite(ss) ||
    // Check validation ms
    ms < 0 ||
    ms > 999 ||
    !isFinite(ms)
  );
};

function parseISOString(input: string): number {
  const match = input.match(
    /^(\d+)-(\d{2})-(\d{2})[T ](\d{2}):(\d{2}):(\d{2})(\.\d+)?(?:Z)?$/
  );

  const parseInt = Number.parseInt;
  const y = parseInt(match?.[1] as string, 10);
  const m = parseInt(match?.[2] as string, 10);
  const d = parseInt(match?.[3] as string, 10);
  const hh = parseInt(match?.[4] as string, 10);
  const mm = parseInt(match?.[5] as string, 10);
  const ss = parseInt(match?.[6] as string, 10);
  const millsec = Number.parseFloat((match?.[7] as string) || '0');
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
  const type = typeof input;
  if (type === 'string') {
    return parseISOString(input as string);
  }
  if (type === 'number') {
    return parseNumber(input as number);
  }

  if (
    input &&
    typeof input === 'object' &&
    'value' in input &&
    'unit' in input
  ) {
    return parseObject(input);
  }
  if (
    input &&
    typeof input === 'object' &&
    'year' in input &&
    ('month' in input || 'monthIndex' in input) &&
    'day' in input
  ) {
    return parseParts(input);
  }
  return Date.now();
}

export default parseInput;
