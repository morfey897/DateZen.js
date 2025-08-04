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
  isLeapYear: boolean;
  weekday: number;
  year: number;
  month: number;
  monthIndex: number;
  day: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
};

type InputType = {
  year: number;
  day: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  milliseconds?: number;
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
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
}>;

export type Dictionary = {
  MMM?: string[]; // Short month names [e.g., Jan, Feb]
  MMMM?: string[]; // Full month names [e.g., January, February]
  MMMMM?: string[]; // Abbreviated month names [e.g., J, F]
  EEE?: string[]; // Abbreviated day names [e.g., Sun, Mon]
  EEEE?: string[]; // Full day names [e.g., Sunday, Monday]
  EEEEE?: string[]; // Short day names [e.g., S, M]
};

export type DateZenPluginFormat = (
  date: PluginParts,
  pattern: string,
  options?: {
    locale?: string;
    dictionary?: Dictionary;
  }
) => string;

export type DateZenPluginDiff = (
  dateA: NumericLike,
  dateB: NumericLike,
  unit?: TimeUnit | TimeUnit[]
) => number | Record<TimeUnit, number>;

export type DateZenPlugin = {
  format: DateZenPluginFormat;
  diff: DateZenPluginDiff;
};

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
