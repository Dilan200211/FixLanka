import { describe, it, expect } from 'vitest';
import QRCode from 'qrcode';

describe('QR Code Generation', () => {
  it('generates a valid SVG QR code string', async () => {
    const payload = 'https://fixlanka.com';
    const svg = await QRCode.toString(payload, { type: 'svg' });
    expect(svg).toContain('<svg');
    expect(svg).toContain('</svg>');
  });

  it('generates a valid Data URL for PNG', async () => {
    const payload = 'WIFI:S:HomeNet;T:WPA;P:SecretPass;;';
    const dataUrl = await QRCode.toDataURL(payload);
    expect(dataUrl.startsWith('data:image/png;base64,')).toBe(true);
  });
});
