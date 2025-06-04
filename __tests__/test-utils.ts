import DateZen from '@/core/DateZen.class';

export const generateCases = (
  a: number | string,
  b: number | string,
  TOTAL: number,
  random: boolean = true
): Array<[string, number]> => {
  const from = typeof a === 'number' ? a : new Date(a).getTime();
  const to = typeof b === 'number' ? b : new Date(b).getTime();

  const TIME: Array<[string, number]> = [];
  const diff = to - from;
  for (let i = 0; i < TOTAL; i++) {
    if (i === 0) {
      TIME.push([new Date(from).toISOString(), from]);
      continue;
    } else if (i === TOTAL - 1) {
      TIME.push([new Date(to).toISOString(), to]);
      continue;
    }
    const ts = random
      ? Math.floor(from + Math.random() * diff)
      : from + i * Math.floor(diff / TOTAL);
    TIME.push([new Date(ts).toISOString(), ts]);
  }
  return [...TIME].sort((a, b) => a[1] - b[1]);
};

export const dToFObj = (date: Date) => ({
  yyyy: date.getUTCFullYear(),
  mm: date.getUTCMonth() + 1,
  mmIndex: date.getUTCMonth(),
  dd: date.getUTCDate(),
  d: date.getUTCDay(),
  h: date.getUTCHours(),
  m: date.getUTCMinutes(),
  s: date.getUTCSeconds(),
  ms: date.getUTCMilliseconds(),
});

export const dToUObj = (date: Date) => ({
  week: date.getUTCDay(),
  iso: date.toISOString(),
  timestamp: date.getTime(),
});

export const dzToFObj = (dateZen: DateZen) => ({
  yyyy: dateZen.year(),
  mm: dateZen.month(),
  mmIndex: dateZen.monthIndex(),
  dd: dateZen.day(),
  d: dateZen.weekday(),
  h: dateZen.hours(),
  m: dateZen.minutes(),
  s: dateZen.seconds(),
  ms: dateZen.millseconds(),
});

export const dzToUObj = (dateZen: DateZen) => ({
  week: dateZen.weekday(),
  iso: dateZen.toISOString(),
  timestamp: dateZen.toMillseconds(),
});

export const ISOtoDateString = (input: string) => {
  const match = input.match(
    /^(\d+)-(\d{2})-(\d{2})[T ](\d{2}):(\d{2}):(\d{2})(\.\d+)?(?:Z)?$/
  );
  if (!match) return null;
  const [, y, m, d, hh, mm, ss, millsec] = match.map(Number);
  const ms = Number.isFinite(millsec) ? millsec * 1_000 : 0;
  return {
    y,
    m,
    d,
    hh,
    mm,
    ss,
    ms,
  };
};
