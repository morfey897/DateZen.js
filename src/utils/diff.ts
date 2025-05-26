import { DateZenInput } from '../core/types';
import DateZen from '../core/DateZen';
import { SEC_IN_DAY, SEC_IN_MIN, SEC_IN_HOUR } from '../core/config';

type TimeUnit = 's' | 'm' | 'h' | 'd';

/**
 * Converts milliseconds to the specified unit.
 */
function convert(s: number, unit: TimeUnit): number {
  switch (unit) {
    case 'm':
      return Math.floor(s / SEC_IN_MIN);
    case 'h':
      return Math.floor(s / SEC_IN_HOUR);
    case 'd':
      return Math.floor(s / SEC_IN_DAY);
    default:
      return s;
  }
}

/**
 * Returns the difference between two DateZen instances in the specified unit(s).
 */
function diff(
  a: DateZenInput | DateZen,
  b: DateZenInput | DateZen,
  unit: TimeUnit | TimeUnit[] = 's'
): number | Record<TimeUnit, number> {
  const dateA = a instanceof DateZen ? a : new DateZen(a);
  const dateB = b instanceof DateZen ? b : new DateZen(b);

  let totalSeconds = Math.abs(+dateA - +dateB);

  if (Array.isArray(unit)) {
    const orderedUnits: [TimeUnit, number][] = unit
      .map((u): [TimeUnit, number] => {
        switch (u) {
          case 'd':
            return ['d', SEC_IN_DAY];
          case 'h':
            return ['h', SEC_IN_HOUR];
          case 'm':
            return ['m', SEC_IN_MIN];
          default:
            return ['s', 1];
        }
      })
      .sort(([, secA], [, secB]) => secB - secA);

    const result: Record<TimeUnit, number> = {} as Record<TimeUnit, number>;

    for (const [u, secondsInUnit] of orderedUnits) {
      result[u] = Math.floor(totalSeconds / secondsInUnit);
      totalSeconds %= secondsInUnit;
    }

    return result;
  } else {
    return convert(totalSeconds, unit);
  }
}

export default diff;
