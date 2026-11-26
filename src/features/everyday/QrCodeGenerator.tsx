import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Download, Copy, Check, RefreshCw, Wifi, Link, FileText, User } from 'lucide-react';
import { downloadText } from '../../lib/download/download';

type QrType = 'url' | 'text' | 'wifi' | 'vcard';

export default function QrCodeGenerator() {
  const [qrType, setQrType] = useState<QrType>('url');
  const [urlInput, setUrlInput] = useState<string>('https://fixlanka.com');
  const [textInput, setTextInput] = useState<string>('');

  // Wi-Fi Fields
  const [wifiSsid, setWifiSsid] = useState<string>('');
  const [wifiPassword, setWifiPassword] = useState<string>('');
  const [wifiType, setWifiType] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');

  // Contact vCard Fields
  const [contactName, setContactName] = useState<string>('');
  const [contactPhone, setContactPhone] = useState<string>('');
  const [contactEmail, setContactEmail] = useState<string>('');

  // Styling
  const [errorCorrection, setErrorCorrection] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [fgColor, setFgColor] = useState<string>('#000000');
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [size, setSize] = useState<number>(512);

  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [qrSvg, setQrSvg] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const escapeWifi = (str: string) => str.replace(/([\\;,:"])/g, '\\$1');

  // Compute payload string
  const getPayload = (): string => {
    if (qrType === 'url') return urlInput.trim() || 'https://fixlanka.com';
    if (qrType === 'text') return textInput.trim() || 'FixLanka Tools';
    if (qrType === 'wifi') {
      const ssid = escapeWifi(wifiSsid);
      if (wifiType === 'nopass') {
        return `WIFI:S:${ssid};T:nopass;;`;
      }
      return `WIFI:S:${ssid};T:${wifiType};P:${escapeWifi(wifiPassword)};;`;
    }
    if (qrType === 'vcard') {
      return `BEGIN:VCARD\nVERSION:3.0\nFN:${contactName}\nN:${contactName}\nTEL:${contactPhone}\nEMAIL:${contactEmail}\nEND:VCARD`;
    }
    return '';
  };

  const renderQr = async () => {
    const payload = getPayload();
    if (!payload) return;

    try {
      const dataUrl = await QRCode.toDataURL(payload, {
        width: size,
        margin: 2,
        errorCorrectionLevel: errorCorrection,
        color: {
          dark: fgColor,
          light: bgColor,
        },
      });
      setQrDataUrl(dataUrl);

      const svgString = await QRCode.toString(payload, {
        type: 'svg',
        margin: 2,
        errorCorrectionLevel: errorCorrection,
        color: {
          dark: fgColor,
          light: bgColor,
        },
      });
      setQrSvg(svgString);
    } catch (err) {
      console.error('QR rendering failed:', err);
    }
  };

  useEffect(() => {
    renderQr();
  }, [qrType, urlInput, textInput, wifiSsid, wifiPassword, wifiType, contactName, contactPhone, contactEmail, errorCorrection, fgColor, bgColor, size]);

  const downloadPng = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `qrcode_${qrType}.png`;
    a.click();
  };

  const downloadSvg = () => {
    if (!qrSvg) return;
    downloadText(qrSvg, `qrcode_${qrType}.svg`, 'image/svg+xml');
  };

  return (
    <div className="space-y-6 text-xs">
      {/* Category Selection Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'url', label: 'Website URL', icon: Link },
          { id: 'text', label: 'Plain Text', icon: FileText },
          { id: 'wifi', label: 'Wi-Fi Network', icon: Wifi },
          { id: 'vcard', label: 'Contact vCard', icon: User },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setQrType(tab.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-semibold transition-all ${
                qrType === tab.id
                  ? 'bg-brand-600 text-white shadow'
                  : 'bg-dark-surface border border-dark-border text-dark-secondary hover:border-brand-500/40'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Configuration */}
        <div className="p-5 rounded-xl bg-dark-surface border border-dark-border space-y-4">
          <h2 className="font-bold text-dark-text uppercase tracking-wider text-xs">Payload Information</h2>

          {qrType === 'url' && (
            <div>
              <label className="block text-dark-secondary font-medium mb-1">Target URL</label>
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-lg text-dark-text font-mono"
              />
            </div>
          )}

          {qrType === 'text' && (
            <div>
              <label className="block text-dark-secondary font-medium mb-1">Text Content</label>
              <textarea
                rows={4}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Enter text message or notes..."
                className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-lg text-dark-text"
              />
            </div>
          )}

          {qrType === 'wifi' && (
            <div className="space-y-3">
              <div>
                <label className="block text-dark-secondary font-medium mb-1">Network SSID (Name)</label>
                <input
                  type="text"
                  value={wifiSsid}
                  onChange={(e) => setWifiSsid(e.target.value)}
                  placeholder="MyHomeWifi"
                  className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-lg text-dark-text"
                />
              </div>
              <div>
                <label className="block text-dark-secondary font-medium mb-1">Network Password</label>
                <input
                  type="text"
                  value={wifiPassword}
                  onChange={(e) => setWifiPassword(e.target.value)}
                  placeholder="Password123"
                  className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-lg text-dark-text font-mono"
                />
              </div>
              <div>
                <label className="block text-dark-secondary font-medium mb-1">Security Type</label>
                <select
                  value={wifiType}
                  onChange={(e) => setWifiType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-lg text-dark-text"
                >
                  <option value="WPA">WPA / WPA2 / WPA3</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">None (Open Network)</option>
                </select>
              </div>
            </div>
          )}

          {qrType === 'vcard' && (
            <div className="space-y-3">
              <div>
                <label className="block text-dark-secondary font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Alex Rivera"
                  className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-lg text-dark-text"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-dark-secondary font-medium mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+1 555 0192"
                    className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-lg text-dark-text font-mono"
                  />
                </div>
                <div>
                  <label className="block text-dark-secondary font-medium mb-1">Email Address</label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="alex@example.com"
                    className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-lg text-dark-text font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Styling Options */}
          <div className="pt-4 border-t border-dark-border space-y-3">
            <h3 className="font-bold text-dark-secondary uppercase tracking-wider text-xs">Customization</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-dark-secondary font-medium mb-1">Error Correction</label>
                <select
                  value={errorCorrection}
                  onChange={(e) => setErrorCorrection(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 bg-dark-card border border-dark-border rounded-lg text-dark-text"
                >
                  <option value="L">Low (7%)</option>
                  <option value="M">Medium (15%)</option>
                  <option value="Q">Quartile (25%)</option>
                  <option value="H">High (30%)</option>
                </select>
              </div>

              <div>
                <label className="block text-dark-secondary font-medium mb-1">Foreground</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-7 h-7 rounded border border-dark-border bg-transparent cursor-pointer"
                  />
                  <span className="font-mono text-[11px] text-dark-secondary">{fgColor}</span>
                </div>
              </div>

              <div>
                <label className="block text-dark-secondary font-medium mb-1">Background</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-7 h-7 rounded border border-dark-border bg-transparent cursor-pointer"
                  />
                  <span className="font-mono text-[11px] text-dark-secondary">{bgColor}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live QR Preview & Export */}
        <div className="p-5 rounded-xl bg-dark-surface border border-dark-border flex flex-col items-center justify-between gap-6">
          <div className="text-center">
            <h2 className="font-bold text-dark-text uppercase tracking-wider text-xs">QR Code Preview</h2>
            <p className="text-[11px] text-dark-secondary mt-0.5">High-resolution vector-quality render</p>
          </div>

          {/* QR Display Card */}
          <div className="p-4 bg-white rounded-2xl shadow-2xl flex items-center justify-center max-w-[280px]">
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="Rendered QR Code" className="w-60 h-60 object-contain rounded" />
            ) : (
              <div className="w-60 h-60 flex items-center justify-center text-dark-secondary">Rendering...</div>
            )}
          </div>

          {/* Export Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 w-full">
            <button
              type="button"
              onClick={downloadPng}
              className="flex-1 min-w-[140px] py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold transition-all shadow flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" /> Download PNG
            </button>

            <button
              type="button"
              onClick={downloadSvg}
              className="flex-1 min-w-[140px] py-2.5 px-4 rounded-xl bg-dark-raised hover:bg-dark-raised text-dark-text border border-dark-border hover:border-brand-500/40 font-bold transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" /> Download SVG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
