import DateZen from './core/DateZen.class';
import { DateZenInput } from './core/types';

/**
 * Factory function to create a DateZen instance.
 * @param input - Optional input to initialize the DateZen instance.
 * @returns DateZen instance
 */
function dz(input?: DateZenInput): DateZen {
  return new DateZen(input);
}

export default dz;
