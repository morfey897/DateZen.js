import DateZen from './core/DateZen';

/**
 * Factory function to create a DateZen instance.
 * @param input - Optional input to initialize the DateZen instance.
 * @returns DateZen instance
 */
function dz(input?: any): DateZen {
  return new DateZen(input);
}

export default dz;
