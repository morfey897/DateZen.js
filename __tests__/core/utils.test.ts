import { describe, expect } from '@jest/globals';
import { parseISOString } from '@/core/utils';

describe('utils', () => {
  describe('parseISOString', () => {
    it('should parse ISO string with millseconds', () => {
      const isoString = '2025-01-01T00:00:00.123Z';
      const ms = parseISOString(isoString);
      expect(typeof ms).toEqual('number');
      expect(ms).toEqual(Date.parse(isoString));
    });

    it('should parse ISO string without millseconds', () => {
      const isoString = '2025-01-01T00:00:00Z';
      const ms = parseISOString(isoString);
      expect(typeof ms).toEqual('number');
      expect(ms).toEqual(Date.parse(isoString));
    });

    it('should handle invalid ISO strings', () => {
      expect(parseISOString('invalid-date')).toBeNaN();
    });

    it('should handle empty strings', () => {
      expect(parseISOString('')).toBeNaN();
    });
  });
});
