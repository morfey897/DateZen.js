import { NumericLike } from './types';
/**
 * Compares two values as DateZen objects and returns:
 * -1 if a < b
 *  0 if a === b
 *  1 if a > b
 */
function compare(dateA: NumericLike, dateB: NumericLike): -1 | 0 | 1 {
  const diff = +dateA - +dateB;
  if (isNaN(diff)) {
    throw new TypeError('Cannot compare invalid DateZen instances');
  }
  if (!isFinite(diff)) {
    throw new RangeError(
      'Cannot compare DateZen instances with infinite values'
    );
  }
  if (diff < 0) return -1;
  if (diff > 0) return 1;
  return 0;
}

export default compare;
