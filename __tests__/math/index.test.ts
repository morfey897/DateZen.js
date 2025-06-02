import { describe, expect } from '@jest/globals';
import Math from '@/math';

describe('math', () => {
  describe('mod', () => {
    it('should return 0 for mod(5, 5)', () => {
      expect(Math.mod(5, 5)).toBe(0);
    });

    it('should return 1 for mod(6, 5)', () => {
      expect(Math.mod(6, 5)).toBe(1);
    });

    it('should return 4 for mod(-1, 5)', () => {
      expect(Math.mod(-1, 5)).toBe(4);
    });

    it('should return 3 for mod(-7, 5)', () => {
      expect(Math.mod(-7, 5)).toBe(3);
    });
  });

  describe('floor', () => {
    it('should return 5 for floor(5.9)', () => {
      expect(Math.floor(5.9)).toBe(5);
    });

    it('should return -6 for floor(-5.1)', () => {
      expect(Math.floor(-5.1)).toBe(-6);
    });

    it('should return -5 for floor(-5)', () => {
      expect(Math.floor(-5.0)).toBe(-5);
    });

    it('should return 0 for floor(0)', () => {
      expect(Math.floor(0)).toBe(0);
    });

    it('should return NaN for NaN input', () => {
      expect(Math.floor(NaN)).toBeNaN();
    });
  });
});
