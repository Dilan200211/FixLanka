export interface DetectedSignature {
  isValid: boolean;
  detectedMime: string;
  extension: string;
  label: string;
}

/**
 * Validates a file's binary magic bytes against recognized formats
 */
export async function verifyFileSignature(file: File): Promise<DetectedSignature> {
  let buffer: ArrayBuffer;

  const slice = file.slice(0, 64);
  if (typeof (slice as any).arrayBuffer === 'function') {
    buffer = await (slice as any).arrayBuffer();
  } else if (typeof file.arrayBuffer === 'function') {
    const full = await file.arrayBuffer();
    buffer = full.slice(0, 64);
  } else {
    buffer = await new Promise<ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = reject;
      reader.readAsArrayBuffer(slice);
    });
  }

  const bytes = new Uint8Array(buffer);

  // JPEG: FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return { isValid: true, detectedMime: 'image/jpeg', extension: 'jpg', label: 'JPEG Image' };
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return { isValid: true, detectedMime: 'image/png', extension: 'png', label: 'PNG Image' };
  }

  // WebP: RIFF .... WEBP
  if (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return { isValid: true, detectedMime: 'image/webp', extension: 'webp', label: 'WebP Image' };
  }

  // GIF: GIF87a or GIF89a (47 49 46 38)
  if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38) {
    return { isValid: true, detectedMime: 'image/gif', extension: 'gif', label: 'GIF Image' };
  }

  // BMP: 42 4D ("BM")
  if (bytes[0] === 0x42 && bytes[1] === 0x4d) {
    return { isValid: true, detectedMime: 'image/bmp', extension: 'bmp', label: 'BMP Image' };
  }

  // TIFF: Little-endian (49 49 2A 00) or Big-endian (4D 4D 00 2A)
  if (
    (bytes[0] === 0x49 && bytes[1] === 0x49 && bytes[2] === 0x2a && bytes[3] === 0x00) ||
    (bytes[0] === 0x4d && bytes[1] === 0x4d && bytes[2] === 0x00 && bytes[3] === 0x2a)
  ) {
    return { isValid: true, detectedMime: 'image/tiff', extension: 'tiff', label: 'TIFF Image' };
  }

  // ICO: 00 00 01 00
  if (bytes[0] === 0x00 && bytes[1] === 0x00 && bytes[2] === 0x01 && bytes[3] === 0x00) {
    return { isValid: true, detectedMime: 'image/x-icon', extension: 'ico', label: 'ICO Icon' };
  }

  // PDF: %PDF (25 50 44 46)
  if (bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46) {
    return { isValid: true, detectedMime: 'application/pdf', extension: 'pdf', label: 'PDF Document' };
  }

  // ISOBMFF (ftyp at bytes 4-7): distinguishes AVIF/HEIC images from MP4/MOV video
  if (bytes[4] === 0x66 && bytes[5] === 0x74 && bytes[6] === 0x79 && bytes[7] === 0x70) {
    const brand = String.fromCharCode(bytes[8] || 0, bytes[9] || 0, bytes[10] || 0, bytes[11] || 0);
    if (brand === 'avif' || brand === 'avis') {
      return { isValid: true, detectedMime: 'image/avif', extension: 'avif', label: 'AVIF Image' };
    }
    if (brand === 'heic' || brand === 'heix' || brand === 'hevc' || brand === 'hevx' || brand === 'mif1' || brand === 'msf1') {
      return { isValid: true, detectedMime: 'image/heic', extension: 'heic', label: 'HEIC Image' };
    }
    return { isValid: true, detectedMime: 'video/mp4', extension: 'mp4', label: 'MP4 Video' };
  }

  // WebM / MKV: 1A 45 DF A3
  if (bytes[0] === 0x1a && bytes[1] === 0x45 && bytes[2] === 0xdf && bytes[3] === 0xa3) {
    return { isValid: true, detectedMime: 'video/webm', extension: 'webm', label: 'WebM Video' };
  }

  // SVG check (starts with <svg or <?xml)
  const headText = new TextDecoder().decode(bytes).trimStart().toLowerCase();
  if (headText.startsWith('<svg') || (headText.startsWith('<?xml') && (file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg')))) {
    return { isValid: true, detectedMime: 'image/svg+xml', extension: 'svg', label: 'SVG Vector Image' };
  }

  // Plain text / JSON fallback
  if (file.type === 'application/json' || file.name.endsWith('.json')) {
    return { isValid: true, detectedMime: 'application/json', extension: 'json', label: 'JSON Data' };
  }

  return {
    isValid: false,
    detectedMime: file.type || 'application/octet-stream',
    extension: file.name.split('.').pop() || '',
    label: 'Unknown / Generic Binary'
  };
}