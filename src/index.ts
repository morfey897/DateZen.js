import DateZen, { globalPlugins } from '@/core/DateZen.class';
import { DateZenInput, PluginType, PluginFunction } from '@/types';

/**
 * Factory function to create a DateZen instance.
 * @param input - Optional input to initialize the DateZen instance.
 * @returns DateZen instance
 */
function dz(input?: DateZenInput): DateZen {
  return new DateZen(input);
}

/**
 * Method to register a plugin with DateZen.
 * @param type - Type of the plugin to register.
 * @param plugin - The plugin function to register.
 */
dz.use = function <T extends PluginType>(
  type: T,
  plugin: PluginFunction<T>
): void {
  globalPlugins.set(type, plugin);
};

export default dz;
