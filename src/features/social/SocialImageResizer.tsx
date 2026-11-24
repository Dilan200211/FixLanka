import React, { useState } from 'react';
import { Maximize, Download, RefreshCw, Eye } from 'lucide-react';
import FileDropzone from '../../components/file-upload/FileDropzone';
import { formatBytes } from '../../lib/formatting/bytes';
import { downloadBlob } from '../../lib/download/download';

interface SocialPreset {
  id: string;
  platform: string;
  name: string;
  width: number;
  height: number;
}

const SOCIAL_PRESETS: SocialPreset[] = [
  { id: 'yt-thumb', platform: 'YouTube', name: 'Thumbnail', width: 1280, height: 720 },
  { id: 'yt-banner', platform: 'YouTube', name: 'Channel Banner', width: 2560, height: 1440 },
  { id: 'ig-square', platform: 'Instagram', name: 'Square Post', width: 1080, height: 1080 },
  { id: 'ig-portrait', platform: 'Instagram', name: 'Portrait Post', width: 1080, height: 1350 },
  { id: 'ig-story', platform: 'Instagram', name: 'Story / Reel', width: 1080, height: 1920 },
  { id: 'x-post', platform: 'Twitter / X', name: 'Timeline Post', width: 1200, height: 675 },
  { id: 'x-header', platform: 'Twitter / X', name: 'Profile Header', width: 1500, height: 500 },
  { id: 'fb-post', platform: 'Facebook', name: 'Feed Post', width: 1200, height: 630 },
  { id: 'fb-cover', platform: 'Facebook', name: 'Cover Photo', width: 820, height: 312 },
  { id: 'li-post', platform: 'LinkedIn', name: 'Shared Image', width: 1200, height: 627 },
  { id: 'li-banner', platform: 'LinkedIn', name: 'Profile Banner', width: 1584, height: 396 },
];

export default function SocialImageResizer() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [activePreset, setActivePreset] = useState<SocialPreset>(SOCIAL_PRESETS[0]);
  const [fitMode, setFitMode] = useState<'cover' | 'contain'>('cover');
  const [bgColor, setBgColor] = useState<string>('#0d1117');

  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setOutputBlob(null);
    setOutputUrl(null);
    setError(null);
  };

  const handleGenerate = () => {
    if (!previewUrl || !activePreset) return;
    setProcessing(true);
    setError(null);

    const img = new Image();
    img.src = previewUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = activePreset.width;
      canvas.height = activePreset.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setProcessing(false);
        setError('Could not initialize image canvas.');
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Background fill
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const targetW = activePreset.width;
      const targetH = activePreset.height;
      const imgW = img.naturalWidth;
      const imgH = img.naturalHeight;

      if (fitMode === 'contain') {
        const scale = Math.min(targetW / imgW, targetH / imgH);
        const w = imgW * scale;
        const h = imgH * scale;
        const x = (targetW - w) / 2;
        const y = (targetH - h) / 2;
        ctx.drawImage(img, x, y, w, h);
      } else {
        // Cover crop
        const scale = Math.max(targetW / imgW, targetH / imgH);
        const w = imgW * scale;
        const h = imgH * scale;
        const x = (targetW - w) / 2;
        const y = (targetH - h) / 2;
        ctx.drawImage(img, x, y, w, h);
      }

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setProcessing(false);
            setError('Failed to render output image.');
            return;
          }
          if (outputUrl) URL.revokeObjectURL(outputUrl);
          const url = URL.createObjectURL(blob);
          setOutputBlob(blob);
          setOutputUrl(url);
          setProcessing(false);
        },
        'image/png',
        0.95
      );
    };
    img.onerror = () => {
      setProcessing(false);
      setError('Could not decode this image file.');
    };
  };

  const handleDownload = () => {
    if (!outputBlob || !selectedFile) return;
    const cleanName = `${selectedFile.name.replace(/\.[^/.]+$/, '')}_${activePreset.id}.png`;
    downloadBlob(outputBlob, cleanName);
  };

  const handleReset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (outputUrl) URL.revokeObjectURL(outputUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
    setOutputBlob(null);
    setOutputUrl(null);
  };

  return (
    <div className="space-y-6 text-xs">
      {!selectedFile ? (
        <FileDropzone
          accept="image/jpeg,image/png,image/webp"
          maxSize={31457280} // 30 MB
          onFilesSelected={handleFilesSelected}
          helpText="Select an image to adapt for YouTube, Instagram, X, Facebook, and LinkedIn"
        />
      ) : (
        <div className="space-y-6">
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-dark-surface border border-dark-border">
            <div className="flex items-center gap-3">
              {previewUrl && (
                <img src={previewUrl} alt="Source" className="w-12 h-12 object-cover rounded-lg border border-dark-border" />
              )}
              <div>
                <p className="text-sm font-semibold text-dark-text truncate max-w-xs">{selectedFile.name}</p>
                <p className="text-xs text-dark-secondary">{formatBytes(selectedFile.size)} • Original Image</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-dark-raised hover:bg-dark-raised text-dark-secondary transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Choose Different Image
            </button>
          </div>

          {/* Social Platform Presets Grid */}
          <div className="p-5 rounded-xl bg-dark-surface border border-dark-border space-y-4">
            <h3 className="font-bold text-dark-text uppercase tracking-wider">Select Platform Preset</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {SOCIAL_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    setActivePreset(preset);
                    setOutputBlob(null);
                  }}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    activePreset.id === preset.id
                      ? 'bg-brand-500/15 border-brand-500 text-brand-600 dark:text-brand-400 font-semibold'
                      : 'bg-dark-card border-dark-border text-dark-secondary hover:border-brand-500/40'
                  }`}
                >
                  <p className="text-[10px] text-dark-secondary uppercase tracking-wider">{preset.platform}</p>
                  <p className="text-xs font-medium text-dark-text truncate mt-0.5">{preset.name}</p>
                  <p className="text-[11px] font-mono text-dark-secondary mt-1">
                    {preset.width} × {preset.height}
                  </p>
                </button>
              ))}
            </div>

            {/* Fit Mode & Background Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-dark-border">
              <div>
                <label className="block text-dark-secondary font-medium mb-1.5">Fitting Technique</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFitMode('cover')}
                    className={`flex-1 py-2 px-3 rounded-lg border font-medium ${
                      fitMode === 'cover'
                        ? 'bg-brand-600 text-white border-brand-500'
                        : 'bg-dark-card border-dark-border text-dark-secondary'
                    }`}
                  >
                    Cover Crop (Fill Canvas)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFitMode('contain')}
                    className={`flex-1 py-2 px-3 rounded-lg border font-medium ${
                      fitMode === 'contain'
                        ? 'bg-brand-600 text-white border-brand-500'
                        : 'bg-dark-card border-dark-border text-dark-secondary'
                    }`}
                  >
                    Contain (No Cropping)
                  </button>
                </div>
              </div>

              {fitMode === 'contain' && (
                <div>
                  <label className="block text-dark-secondary font-medium mb-1.5">Padding Background Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-8 h-8 rounded border border-dark-border bg-transparent cursor-pointer"
                    />
                    <span className="font-mono text-dark-secondary uppercase">{bgColor}</span>
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              disabled={processing}
              onClick={handleGenerate}
              className="w-full py-3 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold text-sm transition-all shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 mt-2"
            >
              {processing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Generating {activePreset.platform} Preset...
                </>
              ) : (
                <>
                  <Maximize className="w-4 h-4" /> Render {activePreset.platform} Graphic ({activePreset.width}×{activePreset.height})
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
              {error}
            </div>
          )}

          {/* Results Output */}
          {outputBlob && outputUrl && (
            <div className="p-6 rounded-xl bg-emerald-950/20 border border-brand-500/30 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-dark-text flex items-center gap-2">
                    <Eye className="w-4 h-4 text-brand-600 dark:text-brand-400" /> Ready for {activePreset.platform}!
                  </h4>
                  <p className="text-xs text-dark-secondary mt-0.5">
                    {activePreset.name} • {activePreset.width} × {activePreset.height} px • {formatBytes(outputBlob.size)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleDownload}
                  className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs transition-colors flex items-center gap-2 shadow"
                >
                  <Download className="w-4 h-4" /> Download Graphic
                </button>
              </div>

              <div className="flex justify-center p-3 bg-black/40 rounded-xl border border-dark-border">
                <img src={outputUrl} alt="Output" className="max-h-72 rounded object-contain shadow" />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
