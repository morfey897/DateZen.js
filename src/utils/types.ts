export type NumericLike =
  | number
  | {
      [Symbol.toPrimitive](hint: 'number' | 'string' | 'default'): number;
    }
  | {
      valueOf(): number;
    };

export type TimeUnit = 'ms' | 's' | 'm' | 'h' | 'd';

export type Parts = Partial<{
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  millisecond: number;
}>;
