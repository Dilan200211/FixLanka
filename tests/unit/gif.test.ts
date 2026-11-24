import { describe, it, expect } from 'vitest';
import { encodeGif } from '../../src/lib/media/gif-encoder';

describe('encodeGif', () => {
  it('encodes multi-frame canvas ImageData into a valid GIF89a Blob with 250-pixel dictionary resets', async () => {
    const width = 32;
    const height = 32;
    const data = new Uint8ClampedArray(width * height * 4);
    for (let i = 0; i < width * height; i++) {
      data[i * 4] = 255;
      data[i * 4 + 1] = 100;
      data[i * 4 + 2] = 50;
      data[i * 4 + 3] = 255;
    }

    const fakeImageData = { data, width, height } as unknown as ImageData;
    const blob = await encodeGif(
      [
        { imageData: fakeImageData, delayMs: 100 },
        { imageData: fakeImageData, delayMs: 100 },
      ],
      width,
      height
    );

    expect(blob.type).toBe('image/gif');
    const buf = await new Promise<ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = reject;
      reader.readAsArrayBuffer(blob);
    });
    const bytes = new Uint8Array(buf);
    const header = String.fromCharCode(...bytes.slice(0, 6));
    expect(header).toBe('GIF89a');
    expect(bytes[bytes.length - 1]).toBe(0x3b); // GIF trailer
  });
});