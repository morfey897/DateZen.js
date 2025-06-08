/**
 * CORE TYPES
 */
export type TimeUnit = 'ms' | 's' | 'm' | 'h' | 'd';

export type NumericLike =
  | number
  | {
      [Symbol.toPrimitive](hint: 'number' | 'string' | 'default'): number;
    }
  | {
      valueOf(): number;
    };

export type Parts = {
  year: number;
  leapYear: boolean;
  month: number;
  monthIndex: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  millisecond: number;
  weekday: number;
};

type InputType = {
  year: number;
  day: number;
  hour?: number;
  minute?: number;
  second?: number;
  millisecond?: number;
};

export type DateZenInput =
  | undefined
  | (InputType & { month: number })
  | (InputType & {
      monthIndex: number;
    })
  | string
  | number
  | { value: number; unit: TimeUnit };

/**
 * PLUGIN TYPES
 */
export type PluginParts = Partial<{
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  millisecond: number;
}>;

export type DateZenPluginFormat = (
  date: PluginParts,
  pattern: string
) => string;

export type DateZenPluginDiff = (
  dateA: NumericLike,
  dateB: NumericLike,
  unit?: TimeUnit | TimeUnit[]
) => number | Record<TimeUnit, number>;

export type DateZenPluginTypes =
  | {
      type: 'format';
      fn: DateZenPluginFormat;
    }
  | {
      type: 'diff';
      fn: DateZenPluginDiff;
    };

export type PluginType = DateZenPluginTypes['type'];

export type PluginFunction<T extends PluginType> = Extract<
  DateZenPluginTypes,
  { type: T }
>['fn'];
