import MathFunc from '@/shared/math';
import type { TimeUnit, DateZenPluginDiff } from '@/shared/types';

/**
 * Converts milliseconds to the specified unit.
 */
function convert(ms: number, unit: TimeUnit): number {
  switch (unit) {
    case 'm':
      return MathFunc.floor(ms / (60 * 1_000));
    case 'h':
      return MathFunc.floor(ms / (3_600 * 1_000));
    case 'd':
      return MathFunc.floor(ms / (86_400 * 1_000));
    case 's':
      return MathFunc.floor(ms / 1_000);
    default:
      return ms;
  }
}

/**
 * Returns the difference between two DateZen instances in the specified unit(s).
 */
function diff(
  ...params: Parameters<DateZenPluginDiff>
): ReturnType<DateZenPluginDiff> {
  const [dateA, dateB, unitValue] = params;
  const unit = unitValue ?? 'ms';
  let totalMillseconds = Math.abs(+dateA - +dateB);

  if (Array.isArray(unit)) {
    const orderedUnits: [TimeUnit, number][] = unit
      .map((u): [TimeUnit, number] => {
        switch (u) {
          case 'd':
            return [u, 86_400_000];
          case 'h':
            return [u, 3_600_000];
          case 'm':
            return [u, 60_000];
          case 's':
            return [u, 1_000];
          default:
            return ['ms', 1];
        }
      })
      .sort(([, secA], [, secB]) => secB - secA);

    const result: Record<TimeUnit, number> = {} as Record<TimeUnit, number>;

    for (const [u, milsecondsInUnit] of orderedUnits) {
      result[u] = MathFunc.floor(totalMillseconds / milsecondsInUnit);
      totalMillseconds %= milsecondsInUnit;
    }

    return result;
  }
  return convert(totalMillseconds, unit);
}

export default diff;
