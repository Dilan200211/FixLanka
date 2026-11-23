/**
 * Lightweight, pure client-side GIF89a encoder
 * Converts HTML5 Canvas ImageData frames into an animated GIF Blob
 */

export interface GifFrame {
  imageData: ImageData;
  delayMs: number;
}

export async function encodeGif(
  frames: GifFrame[],
  width: number,
  height: number,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const bytes: number[] = [];

  // Helper write routines
  const writeByte = (b: number) => bytes.push(b & 0xff);
  const writeShort = (s: number) => {
    bytes.push(s & 0xff);
    bytes.push((s >> 8) & 0xff);
  };
  const writeString = (str: string) => {
    for (let i = 0; i < str.length; i++) {
      bytes.push(str.charCodeAt(i));
    }
  };

  // 1. GIF89a Header
  writeString('GIF89a');

  // 2. Logical Screen Descriptor
  writeShort(width);
  writeShort(height);
  // GCT Flag = 1, Color Res = 7 (8 bits), Sort = 0, GCT Size = 7 (256 colors) -> 0xF7
  writeByte(0xf7);
  writeByte(0); // Background Color Index
  writeByte(0); // Pixel Aspect Ratio

  // Build a standard 256-color web palette (6x6x6 color cube + 40 grays)
  const palette: number[][] = [];
  for (let r = 0; r < 6; r++) {
    for (let g = 0; g < 6; g++) {
      for (let b = 0; b < 6; b++) {
        palette.push([Math.round((r * 255) / 5), Math.round((g * 255) / 5), Math.round((b * 255) / 5)]);
      }
    }
  }
  while (palette.length < 256) {
    const val = Math.round(((palette.length - 216) * 255) / 39);
    palette.push([val, val, val]);
  }

  // Write Global Color Table (3 bytes * 256)
  for (let i = 0; i < 256; i++) {
    writeByte(palette[i][0]);
    writeByte(palette[i][1]);
    writeByte(palette[i][2]);
  }

  // 3. Netscape 2.0 Application Extension (for Infinite Loop)
  writeByte(0x21); // Extension Introducer
  writeByte(0xff); // App Extension Label
  writeByte(11); // Block Size
  writeString('NETSCAPE2.0');
  writeByte(3); // Sub-block Size
  writeByte(1); // Loop Sub-block Index
  writeShort(0); // Loop count (0 = infinity)
  writeByte(0); // Block Terminator

  // 4. Encode each frame
  for (let f = 0; f < frames.length; f++) {
    const frame = frames[f];
    const data = frame.imageData.data;
    const delayHundredths = Math.max(2, Math.round(frame.delayMs / 10));

    // Graphic Control Extension
    writeByte(0x21); // Extension Introducer
    writeByte(0xf9); // Graphic Control Label
    writeByte(4); // Block Size
    writeByte(0x04); // Disposal: Do not dispose (0x04 = restore to background, 0 = no disposal)
    writeShort(delayHundredths); // Delay time
    writeByte(0); // Transparent color index
    writeByte(0); // Block Terminator

    // Image Descriptor
    writeByte(0x2c); // Image Separator
    writeShort(0); // Left
    writeShort(0); // Top
    writeShort(width); // Width
    writeShort(height); // Height
    writeByte(0); // No Local Color Table

    // Map RGB to closest palette index
    const indexedPixels = new Uint8Array(width * height);
    for (let i = 0; i < width * height; i++) {
      const pr = data[i * 4];
      const pg = data[i * 4 + 1];
      const pb = data[i * 4 + 2];

      // Approximate fast cube mapping
      const cr = Math.min(5, Math.max(0, Math.round((pr / 255) * 5)));
      const cg = Math.min(5, Math.max(0, Math.round((pg / 255) * 5)));
      const cb = Math.min(5, Math.max(0, Math.round((pb / 255) * 5)));
      indexedPixels[i] = cr * 36 + cg * 6 + cb;
    }

    // Simple LZW Encoder (minimum code size 8)
    const minCodeSize = 8;
    writeByte(minCodeSize);

    // Uncompressed LZW stream using clear codes & subblocks
    const clearCode = 1 << minCodeSize; // 256
    const eoiCode = clearCode + 1; // 257

    // Pack bits helper
    let curBit = 0;
    let curByte = 0;
    const subBlock: number[] = [];

    const emitBits = (val: number, bits: number) => {
      for (let b = 0; b < bits; b++) {
        if ((val & (1 << b)) !== 0) {
          curByte |= 1 << curBit;
        }
        curBit++;
        if (curBit === 8) {
          subBlock.push(curByte);
          curByte = 0;
          curBit = 0;
          if (subBlock.length === 254) {
            writeByte(subBlock.length);
            for (let sb = 0; sb < subBlock.length; sb++) writeByte(subBlock[sb]);
            subBlock.length = 0;
          }
        }
      }
    };

    // Emit initial clear code
    emitBits(clearCode, 9);

    // Emit pixels (9 bits each)
    for (let p = 0; p < indexedPixels.length; p++) {
      emitBits(indexedPixels[p], 9);
      if (p > 0 && p % 4096 === 0) {
        emitBits(clearCode, 9);
      }
    }

    // Emit End Of Information
    emitBits(eoiCode, 9);

    // Flush remaining bits
    if (curBit > 0) {
      subBlock.push(curByte);
    }
    if (subBlock.length > 0) {
      writeByte(subBlock.length);
      for (let sb = 0; sb < subBlock.length; sb++) writeByte(subBlock[sb]);
      subBlock.length = 0;
    }
    writeByte(0); // Sub-block terminator

    if (onProgress) {
      onProgress(Math.round(((f + 1) / frames.length) * 100));
    }
  }

  // 5. GIF Trailer
  writeByte(0x3b);

  return new Blob([new Uint8Array(bytes)], { type: 'image/gif' });
}
