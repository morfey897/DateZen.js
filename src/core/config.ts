// 01.01.1970 00:00:00 settings
const joining = (days: number, index: number, arr: number[]) =>
  days + (index > 0 ? arr.slice(0, index).reduce((a, b) => a + b, 0) : 0);

export const MONTHS = [
  [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] as const,
  [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] as const,
] as const;

export const commulativeMonths = (isLeap: number, upto1970: boolean) => {
  if (upto1970) {
    return [0, ...MONTHS[isLeap]].map(joining);
  }
  return [...MONTHS[isLeap], 0].reverse().map(joining);
};
