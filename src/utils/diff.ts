import { DateZenInput } from '../core/types';
import DateZen from '../core/DateZen';
import {
  SEC_IN_DAY,
  SEC_IN_MIN,
  SEC_IN_HOUR,
  MILLSEC_IN_SEC,
} from '../core/config';

type TimeUnit = 'ms' | 's' | 'm' | 'h' | 'd';

/**
 * Converts milliseconds to the specified unit.
 */
function convert(ms: number, unit: TimeUnit): number {
  switch (unit) {
    case 'm':
      return Math.floor(ms / (SEC_IN_MIN * MILLSEC_IN_SEC));
    case 'h':
      return Math.floor(ms / (SEC_IN_HOUR * MILLSEC_IN_SEC));
    case 'd':
      return Math.floor(ms / (SEC_IN_DAY * MILLSEC_IN_SEC));
    case 's':
      return Math.floor(ms / MILLSEC_IN_SEC);
    default:
      return ms;
  }
}

/**
 * Returns the difference between two DateZen instances in the specified unit(s).
 */
function diff(
  a: DateZenInput | DateZen,
  b: DateZenInput | DateZen,
  unit: TimeUnit | TimeUnit[] = 'ms'
): number | Record<TimeUnit, number> {
  const dateA = a instanceof DateZen ? a : new DateZen(a);
  const dateB = b instanceof DateZen ? b : new DateZen(b);

  let totalMillseconds = Math.abs(+dateA - +dateB);

  if (Array.isArray(unit)) {
    const orderedUnits: [TimeUnit, number][] = unit
      .map((u): [TimeUnit, number] => {
        switch (u) {
          case 'd':
            return ['d', SEC_IN_DAY * MILLSEC_IN_SEC];
          case 'h':
            return ['h', SEC_IN_HOUR * MILLSEC_IN_SEC];
          case 'm':
            return ['m', SEC_IN_MIN * MILLSEC_IN_SEC];
          case 's':
            return ['s', MILLSEC_IN_SEC];
          default:
            return ['ms', 1];
        }
      })
      .sort(([, secA], [, secB]) => secB - secA);

    const result: Record<TimeUnit, number> = {} as Record<TimeUnit, number>;

    for (const [u, milsecondsInUnit] of orderedUnits) {
      result[u] = Math.floor(totalMillseconds / milsecondsInUnit);
      totalMillseconds %= milsecondsInUnit;
    }

    return result;
  } else {
    return convert(totalMillseconds, unit);
  }
}

export default diff;
