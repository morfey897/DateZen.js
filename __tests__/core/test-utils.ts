import DateZen from '@/core/DateZen.class';

export const generateCases = (
  from: number,
  to: number,
  TOTAL: number
): Array<[string, number]> => {
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
    const ts = Math.floor(from + Math.random() * diff);
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
