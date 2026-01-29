import { describe, it, expect } from 'vitest';
import {
  kgToLb,
  lbToKg,
  cmToIn,
  inToCm,
  displayWeight,
  displayHeight,
  parseWeight,
  parseHeight,
} from './unitConversions';

describe('Unit Conversions', () => {
  describe('Weight Conversions', () => {
    it('should convert kg to lb correctly', () => {
      expect(kgToLb(1)).toBeCloseTo(2.20462);
      expect(kgToLb(10)).toBeCloseTo(22.0462);
    });

    it('should convert lb to kg correctly', () => {
      expect(lbToKg(2.20462)).toBeCloseTo(1);
      expect(lbToKg(22.0462)).toBeCloseTo(10);
    });

    it('should format display weight correctly', () => {
      expect(displayWeight(10, 'kg')).toBe('10.00');
      expect(displayWeight(1, 'lb')).toBe('2.20');
    });

    it('should parse weight correctly', () => {
      expect(parseWeight(10, 'kg')).toBe(10);
      expect(parseWeight(2.20462, 'lb')).toBeCloseTo(1);
    });
  });

  describe('Height Conversions', () => {
    it('should convert cm to in correctly', () => {
      expect(cmToIn(2.54)).toBe(1);
      expect(cmToIn(25.4)).toBe(10);
    });

    it('should convert in to cm correctly', () => {
      expect(inToCm(1)).toBe(2.54);
      expect(inToCm(10)).toBe(25.4);
    });

    it('should format display height correctly', () => {
      expect(displayHeight(100, 'cm')).toBe('100.0');
      expect(displayHeight(2.54, 'in')).toBe('1.0');
    });

    it('should parse height correctly', () => {
      expect(parseHeight(100, 'cm')).toBe(100);
      expect(parseHeight(1, 'in')).toBe(2.54);
    });
  });
});
