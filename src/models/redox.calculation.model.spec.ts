import { describe, expect, it } from 'vitest';
import { RedoxCalculation } from './redox.calculation.model';

describe('RedoxCalculation', () => {
  describe('legend', () => {
    it('formats the applied current density to one decimal', () => {
      const curve = new RedoxCalculation(740, 618, 3, 1, '#d40707');
      expect(curve.legend).toBe('3.0 mA/m²');
    });
  });

  describe('deltapotential', () => {
    it('returns the absolute Xon/Xoff gap converted from mV to V', () => {
      const curve = new RedoxCalculation(740, 618, 3, 1, '#d40707');
      expect(curve.deltapotential).toBeCloseTo(0.122, 6);
    });
  });

  describe('fx', () => {
    it('returns a positive corrosion rate for a typical depolarisation gap', () => {
      const curve = new RedoxCalculation(740, 618, 3, 1, '#d40707');
      expect(curve.fx(curve.deltapotential)).toBeCloseTo(0.000288962726, 9);
    });
  });

  describe('icorr', () => {
    it('rates a wide depolarisation gap as passive', () => {
      const curve = new RedoxCalculation(740, 618, 3, 1, '#d40707');
      const result = curve.icorr();
      expect(result.effect).toBe('passive');
      expect(result.result).toBeCloseTo(0.289, 3);
    });

    it('rates a narrower gap as low risk', () => {
      const curve = new RedoxCalculation(630, 618, 3, 1, '#d40707');
      expect(curve.icorr().effect).toBe('low');
    });

    it('rates a narrower gap still as moderate risk', () => {
      const curve = new RedoxCalculation(628, 618, 3, 1, '#d40707');
      expect(curve.icorr().effect).toBe('moderate');
    });

    it('rates the narrowest gap as high risk', () => {
      const curve = new RedoxCalculation(622, 618, 3, 1, '#d40707');
      expect(curve.icorr().effect).toBe('high');
    });

    it('falls back to an empty, uncoloured result before the form is usable', () => {
      const curve = new RedoxCalculation(0, 0, 0, 0, '#d40707');
      const result = curve.icorr();
      expect(result.effect).toBe('');
      expect(result.result).toBe(0);
    });
  });

  describe('drawline', () => {
    it('traces an SVG path across the requested step count', () => {
      const curve = new RedoxCalculation(740, 618, 3, 1, '#d40707');
      const path = curve.drawline(200, 1618, 1000, 1e4, 1e5);
      expect(path.startsWith('M ')).toBe(true);
      // one initial "M x y" sample plus 2 * steps "L x y" samples across the range
      expect(path.split(' L ').length).toBe(402);
    });
  });
});
