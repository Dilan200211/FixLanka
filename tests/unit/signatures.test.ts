import { describe, it, expect } from 'vitest';
import { verifyFileSignature } from '../../src/lib/file/signatures';

describe('verifyFileSignature', () => {
  it('detects genuine JPEG magic bytes (FF D8 FF)', async () => {
    const bytes = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]);
    const file = new File([bytes], 'photo.jpg', { type: 'image/jpeg' });
    const sig = await verifyFileSignature(file);
    expect(sig.isValid).toBe(true);
    expect(sig.detectedMime).toBe('image/jpeg');
  });

  it('detects genuine PNG magic bytes (89 50 4E 47)', async () => {
    const bytes = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    const file = new File([bytes], 'graphic.png', { type: 'image/png' });
    const sig = await verifyFileSignature(file);
    expect(sig.isValid).toBe(true);
    expect(sig.detectedMime).toBe('image/png');
  });

  it('detects genuine PDF magic bytes (%PDF)', async () => {
    const bytes = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x37]);
    const file = new File([bytes], 'doc.pdf', { type: 'application/pdf' });
    const sig = await verifyFileSignature(file);
    expect(sig.isValid).toBe(true);
    expect(sig.detectedMime).toBe('application/pdf');
  });

  it('rejects spoofed file with fake extension', async () => {
    const fakeBytes = new Uint8Array([0x00, 0x01, 0x02, 0x03]);
    const file = new File([fakeBytes], 'fake.jpg', { type: 'image/jpeg' });
    const sig = await verifyFileSignature(file);
    expect(sig.isValid).toBe(false);
  });
});
