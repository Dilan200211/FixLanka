import { describe, it, expect } from 'vitest';

describe('Base64 Processing', () => {
  it('correctly encodes and decodes Unicode/UTF-8 strings without corruption', () => {
    const text = 'Hello FixLanka! 🚀 世界';
    
    // Encode with TextEncoder
    const encoder = new TextEncoder();
    const bytes = encoder.encode(text);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64 = btoa(binary);

    // Decode with TextDecoder
    const rawBinary = atob(base64);
    const decodedBytes = new Uint8Array(rawBinary.length);
    for (let i = 0; i < rawBinary.length; i++) {
      decodedBytes[i] = rawBinary.charCodeAt(i);
    }
    const decoder = new TextDecoder();
    const result = decoder.decode(decodedBytes);

    expect(result).toBe(text);
  });
});
