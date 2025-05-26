export type Parts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  millisecond: number;
  weekday: number;
};

export type DateZenInput =
  | undefined
  | {
      year: number;
      month: number;
      day: number;
      hour?: number;
      minute?: number;
      second?: number;
      millisecond?: number;
    }
  | string
  | number
  | { value: number; unit: 'ms' | 's' | 'm' | 'h' | 'd' };
