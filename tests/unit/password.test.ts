import { describe, it, expect } from 'vitest';

describe('Password Generator Logic', () => {
  it('generates password of specified length with Web Crypto API', () => {
    const length = 24;
    const charset = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*()';
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);

    let result = '';
    for (let i = 0; i < length; i++) {
      result += charset[array[i] % charset.length];
    }

    expect(result.length).toBe(length);
    // Shannon entropy for length 24 and charset length 67: 24 * log2(67) ≈ 145 bits
    const entropy = Math.round(length * Math.log2(charset.length));
    expect(entropy).toBeGreaterThan(120);
  });
});
