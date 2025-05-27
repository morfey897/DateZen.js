import { DateZenInput } from '../types';
import DateZen from '../core/DateZen';

/**
 * Compares two values as DateZen objects and returns:
 * -1 if a < b
 *  0 if a === b
 *  1 if a > b
 */
function compare(
  a: DateZenInput | DateZen,
  b: DateZenInput | DateZen
): -1 | 0 | 1 {
  const dateA = a instanceof DateZen ? a : new DateZen(a);
  const dateB = b instanceof DateZen ? b : new DateZen(b);

  const diff = +dateA - +dateB;
  return Math.sign(diff) as -1 | 0 | 1;
}

export default compare;
