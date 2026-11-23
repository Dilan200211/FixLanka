import React, { useState, useEffect } from 'react';
import { Scaling, Lock, Unlock, Download, RefreshCw, Eye } from 'lucide-react';
import FileDropzone from '../../components/file-upload/FileDropzone';
import { formatBytes } from '../../lib/formatting/bytes';
import { downloadBlob } from '../../lib/download/download';

export default function ImageResizer() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [origDimensions, setOrigDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [aspectLocked, setAspectLocked] = useState<boolean>(true);
  const [outputFormat, setOutputFormat] = useState<'image/png' | 'image/jpeg' | 'image/webp'>('image/jpeg');

  const [resizedBlob, setResizedBlob] = useState<Blob | null>(null);
  const [resizedUrl, setResizedUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    setSelectedFile(file);

    const url = URL.createObjectURL(file);
    setOriginalUrl(url);

    const img = new Image();
    img.src = url;
    img.onload = () => {
      setOrigDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      setWidth(img.naturalWidth);
      setHeight(img.naturalHeight);
    };
  };

  const handleWidthChange = (val: number) => {
    setWidth(val);
    if (aspectLocked && origDimensions.width > 0) {
      const ratio = origDimensions.height / origDimensions.width;
      setHeight(Math.round(val * ratio));
    }
  };

  const handleHeightChange = (val: number) => {
    setHeight(val);
    if (aspectLocked && origDimensions.height > 0) {
      const ratio = origDimensions.width / origDimensions.height;
      setWidth(Math.round(val * ratio));
    }
  };

  const handlePercentageScale = (percent: number) => {
    if (origDimensions.width === 0) return;
    const factor = percent / 100;
    setWidth(Math.round(origDimensions.width * factor));
    setHeight(Math.round(origDimensions.height * factor));
  };

  const handlePreset = (presetW: number, presetH: number) => {
    setWidth(presetW);
    setHeight(presetH);
    setAspectLocked(false);
  };

  const handleResize = () => {
    if (!originalUrl || width <= 0 || height <= 0) return;
    setProcessing(true);

    const img = new Image();
    img.src = originalUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setProcessing(false);
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      if (outputFormat === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setProcessing(false);
            return;
          }
          if (resizedUrl) URL.revokeObjectURL(resizedUrl);
          const newUrl = URL.createObjectURL(blob);
          setResizedBlob(blob);
          setResizedUrl(newUrl);
          setProcessing(false);
        },
        outputFormat,
        0.92
      );
    };
  };

  const handleDownload = () => {
    if (!resizedBlob || !selectedFile) return;
    const ext = outputFormat === 'image/png' ? 'png' : outputFormat === 'image/webp' ? 'webp' : 'jpg';
    const filename = `${selectedFile.name.replace(/\.[^/.]+$/, '')}_${width}x${height}.${ext}`;
    downloadBlob(resizedBlob, filename);
  };

  const handleReset = () => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (resizedUrl) URL.revokeObjectURL(resizedUrl);
    setSelectedFile(null);
    setOriginalUrl(null);
    setResizedBlob(null);
    setResizedUrl(null);
  };

  return (
    <div className="space-y-6">
      {!selectedFile ? (
        <FileDropzone
          accept="image/jpeg,image/png,image/webp,image/gif"
          maxSize={31457280} // 30 MB
          onFilesSelected={handleFilesSelected}
          helpText="Upload an image to resize dimensions (up to 30 MB)"
        />
      ) : (
        <div className="space-y-6">
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-dark-surface border border-dark-border">
            <div className="flex items-center gap-3">
              {originalUrl && (
                <img
                  src={originalUrl}
                  alt="Original"
                  className="w-12 h-12 object-cover rounded-lg border border-slate-700"
                />
              )}
              <div>
                <p className="text-sm font-semibold text-white truncate max-w-xs">{selectedFile.name}</p>
                <p className="text-xs text-slate-400">
                  {origDimensions.width} × {origDimensions.height} px • {formatBytes(selectedFile.size)}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Choose New Image
            </button>
          </div>

          {/* Controls Panel */}
          <div className="p-5 rounded-xl bg-dark-surface border border-dark-border space-y-4 text-xs">
            {/* Quick Presets */}
            <div>
              <span className="text-slate-400 font-medium block mb-2">Quick Standard Presets:</span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handlePreset(1920, 1080)}
                  className="px-2.5 py-1.5 rounded-lg bg-dark-card border border-slate-700 hover:border-emerald-500 text-slate-300"
                >
                  Full HD (1920×1080)
                </button>
                <button
                  type="button"
                  onClick={() => handlePreset(1080, 1080)}
                  className="px-2.5 py-1.5 rounded-lg bg-dark-card border border-slate-700 hover:border-emerald-500 text-slate-300"
                >
                  Square (1080×1080)
                </button>
                <button
                  type="button"
                  onClick={() => handlePreset(400, 400)}
                  className="px-2.5 py-1.5 rounded-lg bg-dark-card border border-slate-700 hover:border-emerald-500 text-slate-300"
                >
                  Avatar (400×400)
                </button>
                <button
                  type="button"
                  onClick={() => handlePreset(1280, 720)}
                  className="px-2.5 py-1.5 rounded-lg bg-dark-card border border-slate-700 hover:border-emerald-500 text-slate-300"
                >
                  720p HD (1280×720)
                </button>
              </div>
            </div>

            {/* Percentage Scale */}
            <div>
              <span className="text-slate-400 font-medium block mb-2">Scale by Percentage:</span>
              <div className="flex gap-2">
                {[25, 50, 75, 200].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => handlePercentageScale(pct)}
                    className="px-3 py-1.5 rounded-lg bg-dark-card border border-slate-700 hover:border-emerald-500 text-slate-300 font-mono"
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            {/* Explicit Dimension Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end pt-2 border-t border-slate-800">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Target Width (px)</label>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={width}
                  onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-dark-card border border-slate-700/60 rounded-lg text-slate-100 font-mono"
                />
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <label className="block text-slate-300 font-medium mb-1">Target Height (px)</label>
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={height}
                    onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-dark-card border border-slate-700/60 rounded-lg text-slate-100 font-mono"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setAspectLocked(!aspectLocked)}
                  className={`p-2.5 rounded-lg border transition-colors mt-5 ${
                    aspectLocked
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                  title={aspectLocked ? 'Aspect Ratio Locked' : 'Aspect Ratio Unlocked'}
                >
                  {aspectLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                </button>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Format</label>
                <select
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value as any)}
                  className="w-full px-3 py-2 bg-dark-card border border-slate-700/60 rounded-lg text-slate-100"
                >
                  <option value="image/jpeg">JPEG (.jpg)</option>
                  <option value="image/png">PNG (.png)</option>
                  <option value="image/webp">WebP (.webp)</option>
                </select>
              </div>
            </div>

            <button
              type="button"
              disabled={processing || width <= 0 || height <= 0}
              onClick={handleResize}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold transition-all shadow-md shadow-emerald-950/30 flex items-center justify-center gap-2 mt-2"
            >
              {processing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Resizing Image...
                </>
              ) : (
                <>
                  <Scaling className="w-4 h-4" /> Resize Image
                </>
              )}
            </button>
          </div>

          {/* Results Card */}
          {resizedBlob && resizedUrl && (
            <div className="p-6 rounded-xl bg-emerald-950/15 border border-emerald-500/30 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Eye className="w-4 h-4 text-emerald-400" /> Resized Successfully
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    New dimensions: {width} × {height} px • Output size: {formatBytes(resizedBlob.size)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleDownload}
                  className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center gap-2 shadow"
                >
                  <Download className="w-4 h-4" /> Download Resized Image
                </button>
              </div>

              {/* Output Preview */}
              <div className="max-h-72 overflow-hidden rounded-lg border border-slate-800 bg-black/40 flex items-center justify-center p-2">
                <img
                  src={resizedUrl}
                  alt="Resized Result"
                  className="max-h-64 object-contain rounded"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
