import { describe, expect, it } from 'vitest';
import { converters, find, formatNumber, temp } from './conversion';
import { parseCsv, serializeCsv } from './csv';

describe('conversion primitives', () => {
  it('converts meters to feet with the expected factor', () => {
    expect(find('meters-to-feet').convert(10)).toBeCloseTo(32.80839895, 6);
  });
  it('converts pounds back to kilograms through the inverse function', () => {
    expect(find('kg-to-lbs').inverse(22.046226218)).toBeCloseTo(10, 6);
  });
  it('handles temperature offsets in both directions', () => {
    expect(temp(0, 'c', 'f')).toBeCloseTo(32, 8);
    expect(temp(32, 'f', 'c')).toBeCloseTo(0, 8);
    expect(temp(0, 'c', 'k')).toBeCloseTo(273.15, 8);
  });
  it('keeps the converter catalog populated and formats precision', () => {
    expect(converters.length).toBeGreaterThan(20);
    expect(formatNumber(32.80839895, '4 decimals')).toBe('32.8084');
    expect(formatNumber(Number.POSITIVE_INFINITY, 'Auto')).toBe('—');
  });
});

describe('CSV helpers', () => {
  it('parses quoted commas and escaped quotes', () => {
    const parsed = parseCsv('name,note\nConvertKit,"local, fast"\n"A""B",ready');
    expect(parsed.headers).toEqual(['name', 'note']);
    expect(parsed.rows[0]).toEqual(['ConvertKit', 'local, fast']);
    expect(parsed.rows[1]).toEqual(['A"B', 'ready']);
  });
  it('serializes a downloadable CSV without corrupting special values', () => {
    expect(serializeCsv(['name','note'], [['ConvertKit','local, fast']])).toBe('name,note\nConvertKit,"local, fast"');
  });
});
