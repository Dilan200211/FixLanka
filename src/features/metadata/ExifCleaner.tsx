import React, { useState } from 'react';
import exifr from 'exifr';
import { ShieldCheck, ShieldAlert, Download, RefreshCw, AlertTriangle, Eye } from 'lucide-react';
import FileDropzone from '../../components/file-upload/FileDropzone';
import { formatBytes, calculateSavings } from '../../lib/formatting/bytes';
import { downloadBlob } from '../../lib/download/download';

export default function ExifCleaner() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [cleanedBlob, setCleanedBlob] = useState<Blob | null>(null);
  const [cleanedPreview, setCleanedPreview] = useState<string | null>(null);
  const [detectedTags, setDetectedTags] = useState<{
    gps: boolean;
    device: boolean;
    timestamps: boolean;
    c2paWarning: boolean;
  }>({
    gps: false,
    device: false,
    timestamps: false,
    c2paWarning: false,
  });

  const [outputFormat, setOutputFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/jpeg');
  const [quality, setQuality] = useState<number>(0.92);
  const [processing, setProcessing] = useState(false);

  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    setSelectedFile(file);

    const origUrl = URL.createObjectURL(file);
    setOriginalPreview(origUrl);

    // Detect format
    if (file.type === 'image/png') {
      setOutputFormat('image/png');
    } else if (file.type === 'image/webp') {
      setOutputFormat('image/webp');
    } else {
      setOutputFormat('image/jpeg');
    }

    // Inspect metadata to see what personal data is present
    try {
      const data = await exifr.parse(file, {
        gps: true,
        tiff: true,
        xmp: true,
      });

      const hasGps = Boolean(data && (data.latitude || data.longitude));
      const hasDevice = Boolean(data && (data.Make || data.Model || data.SerialNumber || data.LensModel));
      const hasTimestamps = Boolean(data && (data.DateTimeOriginal || data.CreateDate));

      // Also check for C2PA / JUMBF manifests
      const buffer = await file.slice(0, Math.min(file.size, 1024 * 1024)).arrayBuffer();
      const bytes = new Uint8Array(buffer);
      let hasC2PA = false;
      // Search for 'c2pa' or 'jumb' box
      for (let i = 0; i < bytes.length - 4; i++) {
        if (
          (bytes[i] === 0x63 && bytes[i + 1] === 0x32 && bytes[i + 2] === 0x70 && bytes[i + 3] === 0x61) ||
          (bytes[i] === 0x6a && bytes[i + 1] === 0x75 && bytes[i + 2] === 0x6d && bytes[i + 3] === 0x62)
        ) {
          hasC2PA = true;
          break;
        }
      }

      setDetectedTags({
        gps: hasGps,
        device: hasDevice,
        timestamps: hasTimestamps,
        c2paWarning: hasC2PA,
      });
    } catch {
      // Default to unknown flags
    }
  };

  const handleClean = async () => {
    if (!selectedFile || !originalPreview) return;
    setProcessing(true);

    try {
      // Load image into HTMLImageElement
      const img = new Image();
      img.src = originalPreview;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      // Canvas strips all EXIF/GPS/Device chunks by drawing raw bitmap
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not initialize canvas context');

      // If output is JPEG and source may have transparent background, fill white
      if (outputFormat === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);

      // Export sanitized blob
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setProcessing(false);
            return;
          }
          setCleanedBlob(blob);
          const cleanUrl = URL.createObjectURL(blob);
          setCleanedPreview(cleanUrl);
          setProcessing(false);
        },
        outputFormat,
        outputFormat === 'image/png' ? undefined : quality
      );
    } catch (err) {
      console.error('Cleaning failed:', err);
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!cleanedBlob || !selectedFile) return;
    const ext = outputFormat === 'image/png' ? 'png' : outputFormat === 'image/webp' ? 'webp' : 'jpg';
    const cleanName = `${selectedFile.name.replace(/\.[^/.]+$/, '')}_clean.${ext}`;
    downloadBlob(cleanedBlob, cleanName);
  };

  const handleReset = () => {
    if (originalPreview) URL.revokeObjectURL(originalPreview);
    if (cleanedPreview) URL.revokeObjectURL(cleanedPreview);
    setSelectedFile(null);
    setOriginalPreview(null);
    setCleanedBlob(null);
    setCleanedPreview(null);
    setDetectedTags({ gps: false, device: false, timestamps: false, c2paWarning: false });
  };

  return (
    <div className="space-y-6">
      {!selectedFile ? (
        <FileDropzone
          accept="image/jpeg,image/png,image/webp"
          maxSize={31457280} // 30 MB
          onFilesSelected={handleFilesSelected}
          helpText="Upload JPEG, PNG, or WebP to scrub GPS & personal metadata (up to 30 MB)"
        />
      ) : (
        <div className="space-y-6">
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-dark-surface border border-dark-border">
            <div className="flex items-center gap-3">
              {originalPreview && (
                <img
                  src={originalPreview}
                  alt="Original"
                  className="w-12 h-12 object-cover rounded-lg border border-slate-700"
                />
              )}
              <div>
                <p className="text-sm font-semibold text-white truncate max-w-xs">{selectedFile.name}</p>
                <p className="text-xs text-slate-400">{formatBytes(selectedFile.size)} • Original Image</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Change File
            </button>
          </div>

          {/* Detected Privacy Flags Card */}
          <div className="p-5 rounded-xl bg-dark-surface border border-dark-border space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Personal Metadata Detected in Original:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className={`p-3 rounded-lg border flex items-center gap-2.5 ${
                detectedTags.gps
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                  : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
              }`}>
                {detectedTags.gps ? <ShieldAlert className="w-4 h-4 text-rose-400" /> : <ShieldCheck className="w-4 h-4 text-emerald-400" />}
                <span>{detectedTags.gps ? 'GPS Coordinates Found' : 'No GPS Location'}</span>
              </div>

              <div className={`p-3 rounded-lg border flex items-center gap-2.5 ${
                detectedTags.device
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
              }`}>
                {detectedTags.device ? <ShieldAlert className="w-4 h-4 text-amber-400" /> : <ShieldCheck className="w-4 h-4 text-emerald-400" />}
                <span>{detectedTags.device ? 'Camera/Device Info Found' : 'No Device Identifier'}</span>
              </div>

              <div className={`p-3 rounded-lg border flex items-center gap-2.5 ${
                detectedTags.timestamps
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
              }`}>
                {detectedTags.timestamps ? <ShieldAlert className="w-4 h-4 text-amber-400" /> : <ShieldCheck className="w-4 h-4 text-emerald-400" />}
                <span>{detectedTags.timestamps ? 'Timestamp Tags Found' : 'No Capture Timestamps'}</span>
              </div>
            </div>

            {/* C2PA Provenance Notification if Present */}
            {detectedTags.c2paWarning && (
              <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2.5 mt-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-400" />
                <p>
                  <strong>Content Credentials Notice:</strong> This image contains signed provenance manifests (C2PA). Stripping metadata or re-encoding will invalidate or remove the cryptographic credentials. FixLanka Tools does not silently strip signatures to conceal authorship.
                </p>
              </div>
            )}
          </div>

          {/* Configuration Controls */}
          <div className="p-5 rounded-xl bg-dark-surface border border-dark-border grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1.5">Output Sanitized Format</label>
              <select
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value as any)}
                className="w-full px-3 py-2 bg-dark-card border border-slate-700/60 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              >
                <option value="image/jpeg">JPEG (Universal Compatibility)</option>
                <option value="image/png">PNG (Preserves Transparency)</option>
                <option value="image/webp">WebP (High Quality & Compact)</option>
              </select>
            </div>

            {outputFormat !== 'image/png' && (
              <div>
                <div className="flex justify-between text-slate-300 font-medium mb-1.5">
                  <span>Re-encoding Quality</span>
                  <span className="text-emerald-400 font-mono">{Math.round(quality * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1"
                  step="0.02"
                  value={quality}
                  onChange={(e) => setQuality(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* Clean Action Button */}
          {!cleanedBlob && (
            <button
              type="button"
              disabled={processing}
              onClick={handleClean}
              className="w-full py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-sm transition-all shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2"
            >
              {processing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Sanitizing Image in Browser Memory...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Clean & Sanitize Image Metadata
                </>
              )}
            </button>
          )}

          {/* Output Results */}
          {cleanedBlob && (
            <div className="p-6 rounded-xl bg-emerald-950/15 border border-emerald-500/30 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> Image Successfully Sanitized
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    GPS coordinates, camera specs, and device IDs completely stripped.
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs font-medium">
                  <div>
                    <span className="text-slate-400 block">Original:</span>
                    <span className="text-slate-200">{formatBytes(selectedFile.size)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Sanitized:</span>
                    <span className="text-emerald-400">{formatBytes(cleanedBlob.size)}</span>
                  </div>
                </div>
              </div>

              {/* Clean Preview & Download */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-emerald-500/20">
                {cleanedPreview && (
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    <span>Orientation & colors visually preserved</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleDownload}
                  className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center gap-2 ml-auto shadow"
                >
                  <Download className="w-4 h-4" /> Download Sanitized Image
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
