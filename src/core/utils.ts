import { Output } from './constants';

export function accumulateDays(
  total: number,
  mask: number[],
  output: Output.index
): number;

export function accumulateDays(
  total: number,
  mask: number[],
  output: Output.rest
): number;

export function accumulateDays(
  total: number,
  mask: number[],
  output: undefined
): [number, number];

export function accumulateDays(
  total: number,
  mask: number[],
  output: Output | undefined
): number | [number, number] {
  let index = 0;
  let rest = total;
  const length = mask.length;

  do {
    let newDays = mask[index];
    if (typeof newDays !== 'number' || rest < newDays) {
      break;
    }
    rest -= newDays;
    index = (index + 1) % length;
  } while (rest >= 0);
  if (output === Output.index) return index;
  if (output === Output.rest) return rest;
  return [index, rest];
}

export function binarySearch(
  target: number,
  mask: number[],
  output: Output.index
): number;

export function binarySearch(
  target: number,
  mask: number[],
  output: Output.rest
): number;

export function binarySearch(
  target: number,
  mask: number[],
  output: undefined
): [number, number];

export function binarySearch(
  target: number,
  mask: number[],
  output: Output | undefined
): number | [number, number] {
  let left = 0;
  let right = mask.length - 1;

  do {
    const mid = Math.floor((left + right) / 2);
    if (target >= mask[mid] && target < mask[mid + 1]) {
      if (output === Output.index) return mid;
      if (output === Output.rest) return target - mask[mid];
      return [mid, target - mask[mid]];
    }

    if (mask[mid] > target) {
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  } while (left <= right);

  if (output === Output.index || output === Output.rest) return -1;
  return [-1, -1];
}

export function isLeapYear(year: number): number {
  return Number((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0);
}
