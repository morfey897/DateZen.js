export type Parts = {
  year: number;
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
  | { value: number; unit: 'ms' | 's' | 'm' | 'h' | 'd' };
