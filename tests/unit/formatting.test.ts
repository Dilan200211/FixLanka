import { describe, it, expect } from 'vitest';
import { formatBytes, calculateSavings } from '../../src/lib/formatting/bytes';

describe('formatBytes', () => {
  it('formats zero bytes correctly', () => {
    expect(formatBytes(0)).toBe('0 Bytes');
  });

  it('formats bytes into KB and MB', () => {
    expect(formatBytes(1024)).toBe('1 KB');
    expect(formatBytes(1048576)).toBe('1 MB');
    expect(formatBytes(5242880)).toBe('5 MB');
  });

  it('handles negative or invalid values gracefully', () => {
    expect(formatBytes(-10)).toBe('0 Bytes');
  });
});

describe('calculateSavings', () => {
  it('calculates savings percentage accurately', () => {
    const res = calculateSavings(1000, 400);
    expect(res.savedBytes).toBe(600);
    expect(res.percent).toBe(60);
    expect(res.isSmaller).toBe(true);
  });

  it('handles zero or non-shrinking files', () => {
    const res = calculateSavings(500, 600);
    expect(res.percent).toBe(0);
    expect(res.isSmaller).toBe(false);
  });
});
