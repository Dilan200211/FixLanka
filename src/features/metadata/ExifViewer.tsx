import React, { useState } from 'react';
import exifr from 'exifr';
import { Camera, MapPin, Sliders, Calendar, Download, Copy, Check, RefreshCw } from 'lucide-react';
import FileDropzone from '../../components/file-upload/FileDropzone';
import { formatBytes } from '../../lib/formatting/bytes';
import { downloadText } from '../../lib/download/download';

export default function ExifViewer() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [metadata, setMetadata] = useState<Record<string, any> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    setSelectedFile(file);
    setError(null);
    setMetadata(null);

    // Create object URL for preview
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    setLoading(true);
    try {
      // Parse full EXIF, IPTC, XMP, GPS, TIFF
      const data = await exifr.parse(file, {
        tiff: true,
        xmp: true,
        icc: true,
        iptc: true,
        jfif: true,
        ihdr: true,
        gps: true,
        reviveValues: true,
      });

      if (!data || Object.keys(data).length === 0) {
        setError('No embedded EXIF or metadata tags were found in this image. It may have been stripped or web-optimized.');
      } else {
        setMetadata(data);
      }
    } catch (err: any) {
      console.error('EXIF parsing error:', err);
      setError('Could not extract metadata from this file. The format may be unsupported or corrupted.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
    setMetadata(null);
    setError(null);
  };

  const copyJson = () => {
    if (!metadata) return;
    navigator.clipboard.writeText(JSON.stringify(metadata, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadReport = () => {
    if (!metadata || !selectedFile) return;
    const jsonStr = JSON.stringify(metadata, null, 2);
    downloadText(jsonStr, `${selectedFile.name.replace(/\.[^/.]+$/, '')}_metadata.json`, 'application/json');
  };

  return (
    <div className="space-y-6">
      {!selectedFile ? (
        <FileDropzone
          accept="image/jpeg,image/png,image/webp,image/tiff"
          maxSize={52428800} // 50MB
          onFilesSelected={handleFilesSelected}
          helpText="Supports JPEG, TIFF, PNG, and WebP (up to 50 MB)"
        />
      ) : (
        <div className="space-y-6">
          {/* File Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-dark-surface border border-dark-border">
            <div className="flex items-center gap-3">
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-12 h-12 object-cover rounded-lg border border-dark-border"
                />
              )}
              <div>
                <p className="text-sm font-semibold text-dark-text truncate max-w-xs">{selectedFile.name}</p>
                <p className="text-xs text-dark-secondary">{formatBytes(selectedFile.size)} • {selectedFile.type || 'image'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {metadata && (
                <>
                  <button
                    type="button"
                    onClick={copyJson}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-dark-raised hover:bg-dark-raised text-dark-text border border-dark-border transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied' : 'Copy JSON'}
                  </button>
                  <button
                    type="button"
                    onClick={downloadReport}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-brand-600 hover:bg-brand-700 text-white transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download JSON
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-dark-raised hover:bg-dark-raised text-dark-secondary transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Change Image
              </button>
            </div>
          </div>

          {/* Loading indicator */}
          {loading && (
            <div className="p-12 text-center text-dark-secondary">
              <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-sm font-medium">Extracting EXIF & IPTC Chunks...</p>
            </div>
          )}

          {/* Error / Missing Metadata state */}
          {error && (
            <div className="p-6 rounded-xl bg-dark-surface border border-dark-border text-center space-y-2">
              <p className="text-sm font-semibold text-amber-400">{error}</p>
              <p className="text-xs text-dark-secondary">
                Tip: Many social platforms (like WhatsApp, Twitter, and Instagram) strip EXIF metadata upon upload to protect user privacy.
              </p>
            </div>
          )}

          {/* Structured Metadata Display */}
          {metadata && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Camera & Hardware */}
              <div className="p-5 rounded-xl bg-dark-surface border border-dark-border space-y-3">
                <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 font-semibold text-xs tracking-wider uppercase">
                  <Camera className="w-4 h-4" /> Camera & Hardware
                </div>
                <dl className="divide-y divide-slate-800 text-xs">
                  <div className="py-2 flex justify-between">
                    <dt className="text-dark-secondary">Make / Brand</dt>
                    <dd className="font-medium text-dark-text">{metadata.Make || 'Not specified'}</dd>
                  </div>
                  <div className="py-2 flex justify-between">
                    <dt className="text-dark-secondary">Camera Model</dt>
                    <dd className="font-medium text-dark-text">{metadata.Model || 'Not specified'}</dd>
                  </div>
                  <div className="py-2 flex justify-between">
                    <dt className="text-dark-secondary">Lens Model</dt>
                    <dd className="font-medium text-dark-text">{metadata.LensModel || 'Not specified'}</dd>
                  </div>
                  <div className="py-2 flex justify-between">
                    <dt className="text-dark-secondary">Software / Firmware</dt>
                    <dd className="font-medium text-dark-text">{metadata.Software || 'Not specified'}</dd>
                  </div>
                </dl>
              </div>

              {/* Exposure & Capture Settings */}
              <div className="p-5 rounded-xl bg-dark-surface border border-dark-border space-y-3">
                <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs tracking-wider uppercase">
                  <Sliders className="w-4 h-4" /> Exposure & Settings
                </div>
                <dl className="divide-y divide-slate-800 text-xs">
                  <div className="py-2 flex justify-between">
                    <dt className="text-dark-secondary">Shutter Speed</dt>
                    <dd className="font-medium text-dark-text">
                      {metadata.ExposureTime
                        ? metadata.ExposureTime >= 1
                          ? `${metadata.ExposureTime}s`
                          : `1/${Math.round(1 / metadata.ExposureTime)}s`
                        : 'Not specified'}
                    </dd>
                  </div>
                  <div className="py-2 flex justify-between">
                    <dt className="text-dark-secondary">Aperture (F-Stop)</dt>
                    <dd className="font-medium text-dark-text">{metadata.FNumber ? `f/${metadata.FNumber}` : 'Not specified'}</dd>
                  </div>
                  <div className="py-2 flex justify-between">
                    <dt className="text-dark-secondary">ISO Speed</dt>
                    <dd className="font-medium text-dark-text">{metadata.ISO || 'Not specified'}</dd>
                  </div>
                  <div className="py-2 flex justify-between">
                    <dt className="text-dark-secondary">Focal Length</dt>
                    <dd className="font-medium text-dark-text">
                      {metadata.FocalLength ? `${metadata.FocalLength} mm` : 'Not specified'}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Timestamps & Dimensions */}
              <div className="p-5 rounded-xl bg-dark-surface border border-dark-border space-y-3">
                <div className="flex items-center gap-2 text-purple-400 font-semibold text-xs tracking-wider uppercase">
                  <Calendar className="w-4 h-4" /> Dates & Dimensions
                </div>
                <dl className="divide-y divide-slate-800 text-xs">
                  <div className="py-2 flex justify-between">
                    <dt className="text-dark-secondary">Original Date Taken</dt>
                    <dd className="font-medium text-dark-text">
                      {metadata.DateTimeOriginal ? new Date(metadata.DateTimeOriginal).toLocaleString() : 'Not recorded'}
                    </dd>
                  </div>
                  <div className="py-2 flex justify-between">
                    <dt className="text-dark-secondary">Resolution</dt>
                    <dd className="font-medium text-dark-text">
                      {(metadata.ExifImageWidth || metadata.ImageWidth) && (metadata.ExifImageHeight || metadata.ImageHeight)
                        ? `${metadata.ExifImageWidth || metadata.ImageWidth} × ${metadata.ExifImageHeight || metadata.ImageHeight} px`
                        : 'Not recorded'}
                    </dd>
                  </div>
                  <div className="py-2 flex justify-between">
                    <dt className="text-dark-secondary">Orientation</dt>
                    <dd className="font-medium text-dark-text">{metadata.Orientation ? `Orientation ${metadata.Orientation}` : '1 (Normal)'}</dd>
                  </div>
                </dl>
              </div>

              {/* GPS Geolocation */}
              <div className="p-5 rounded-xl bg-dark-surface border border-dark-border space-y-3">
                <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs tracking-wider uppercase">
                  <MapPin className="w-4 h-4" /> GPS Geolocation
                </div>
                {metadata.latitude && metadata.longitude ? (
                  <div className="space-y-3">
                    <dl className="divide-y divide-slate-800 text-xs">
                      <div className="py-2 flex justify-between">
                        <dt className="text-dark-secondary">Latitude</dt>
                        <dd className="font-mono text-dark-text">{metadata.latitude.toFixed(6)}°</dd>
                      </div>
                      <div className="py-2 flex justify-between">
                        <dt className="text-dark-secondary">Longitude</dt>
                        <dd className="font-mono text-dark-text">{metadata.longitude.toFixed(6)}°</dd>
                      </div>
                      {metadata.altitude && (
                        <div className="py-2 flex justify-between">
                          <dt className="text-dark-secondary">Altitude</dt>
                          <dd className="font-medium text-dark-text">{Math.round(metadata.altitude)} meters</dd>
                        </div>
                      )}
                    </dl>
                    <a
                      href={`https://www.openstreetmap.org/?mlat=${metadata.latitude}&mlon=${metadata.longitude}#map=16/${metadata.latitude}/${metadata.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-colors"
                    >
                      <MapPin className="w-3.5 h-3.5" /> View on OpenStreetMap →
                    </a>
                  </div>
                ) : (
                  <div className="py-4 text-center text-xs text-dark-muted">
                    No GPS coordinates detected in this file.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
