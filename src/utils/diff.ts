import { NumericLike, TimeUnit } from './types';

/**
 * Converts milliseconds to the specified unit.
 */
function convert(ms: number, unit: TimeUnit): number {
  switch (unit) {
    case 'm':
      return Math.floor(ms / (60 * 1_000));
    case 'h':
      return Math.floor(ms / (3_600 * 1_000));
    case 'd':
      return Math.floor(ms / (86_400 * 1_000));
    case 's':
      return Math.floor(ms / 1_000);
    default:
      return ms;
  }
}

/**
 * Returns the difference between two DateZen instances in the specified unit(s).
 */
function diff(
  dateA: NumericLike,
  dateB: NumericLike,
  unit: TimeUnit | TimeUnit[] = 'ms'
): number | Record<TimeUnit, number> {
  let totalMillseconds = Math.abs(+dateA - +dateB);

  if (Array.isArray(unit)) {
    const orderedUnits: [TimeUnit, number][] = unit
      .map((u): [TimeUnit, number] => {
        switch (u) {
          case 'd':
            return ['d', 86_400 * 1_000];
          case 'h':
            return ['h', 3_600 * 1_000];
          case 'm':
            return ['m', 60 * 1_000];
          case 's':
            return ['s', 1_000];
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
  }
  return convert(totalMillseconds, unit);
}

export default diff;
