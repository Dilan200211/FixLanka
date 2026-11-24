import React, { useState } from 'react';
import { Download, Sliders, RefreshCw, Layers, CheckCircle2 } from 'lucide-react';
import FileDropzone from '../../components/file-upload/FileDropzone';
import { formatBytes, calculateSavings } from '../../lib/formatting/bytes';
import { downloadBlob } from '../../lib/download/download';

interface CompressedItem {
  id: string;
  file: File;
  originalSize: number;
  compressedSize: number;
  compressedBlob: Blob;
  previewUrl: string;
  originalPreviewUrl: string;
  savings: { savedBytes: number; percent: number; isSmaller: boolean };
}

export default function ImageCompressor() {
  const [items, setItems] = useState<CompressedItem[]>([]);
  const [quality, setQuality] = useState<number>(0.8);
  const [processing, setProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const compressSingleFile = async (file: File, q: number): Promise<CompressedItem> => {
    const origUrl = URL.createObjectURL(file);

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = origUrl;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          URL.revokeObjectURL(origUrl);
          return reject(new Error('Canvas context failed'));
        }

        // Target format: WebP for PNG/WebP, otherwise JPEG
        const targetType =
          file.type === 'image/png' || file.type === 'image/webp'
            ? 'image/webp'
            : 'image/jpeg';

        if (targetType === 'image/jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              URL.revokeObjectURL(origUrl);
              return reject(new Error('Compression blob creation failed'));
            }
            const compressedUrl = URL.createObjectURL(blob);
            const savings = calculateSavings(file.size, blob.size);

            resolve({
              id: Math.random().toString(36).substring(7),
              file,
              originalSize: file.size,
              compressedSize: blob.size,
              compressedBlob: blob,
              previewUrl: compressedUrl,
              originalPreviewUrl: origUrl,
              savings,
            });
          },
          targetType,
          q
        );
      };
      img.onerror = () => {
        URL.revokeObjectURL(origUrl);
        reject(new Error(`Could not decode image "${file.name}".`));
      };
    });
  };

  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return;
    setProcessing(true);
    setError(null);

    try {
      const compressedResults: CompressedItem[] = [];
      for (const file of files) {
        const item = await compressSingleFile(file, quality);
        compressedResults.push(item);
      }
      setItems((prev) => [...prev, ...compressedResults]);
    } catch (err: any) {
      console.error('Batch compression error:', err);
      setError(err?.message || 'Could not compress image. Ensure it is a supported JPEG, PNG, or WebP file.');
    } finally {
      setProcessing(false);
    }
  };

  const handleRecompressAll = async () => {
    if (items.length === 0 || processing) return;
    setProcessing(true);
    setError(null);
    try {
      const sourceFiles = items.map((item) => item.file);
      items.forEach((item) => {
        URL.revokeObjectURL(item.previewUrl);
        URL.revokeObjectURL(item.originalPreviewUrl);
      });
      const updated: CompressedItem[] = [];
      for (const file of sourceFiles) {
        updated.push(await compressSingleFile(file, quality));
      }
      setItems(updated);
    } catch (err: any) {
      setError(err?.message || 'Re-compression failed.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownloadSingle = (item: CompressedItem) => {
    const ext = item.compressedBlob.type === 'image/webp' ? 'webp' : 'jpg';
    const filename = `${item.file.name.replace(/\.[^/.]+$/, '')}_compressed.${ext}`;
    downloadBlob(item.compressedBlob, filename);
  };

  const handleDownloadAll = () => {
    items.forEach((item, index) => {
      setTimeout(() => {
        handleDownloadSingle(item);
      }, index * 200);
    });
  };

  const handleClearAll = () => {
    items.forEach((item) => {
      URL.revokeObjectURL(item.previewUrl);
      URL.revokeObjectURL(item.originalPreviewUrl);
    });
    setItems([]);
  };

  return (
    <div className="space-y-6">
      {/* Settings Bar */}
      <div className="p-5 rounded-xl bg-dark-surface border border-dark-border flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3 flex-1 min-w-[240px]">
          <Sliders className="w-4 h-4 text-brand-600 dark:text-brand-400 flex-shrink-0" />
          <div className="w-full">
            <div className="flex justify-between font-medium text-dark-secondary mb-1">
              <span>Compression Quality</span>
              <span className="text-brand-600 dark:text-brand-400 font-mono font-bold">{Math.round(quality * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="0.95"
              step="0.05"
              value={quality}
              onChange={(e) => setQuality(parseFloat(e.target.value))}
              className="w-full accent-brand-600 cursor-pointer"
            />
          </div>
        </div>

        {items.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleRecompressAll}
              disabled={processing}
              className="px-3.5 py-2 rounded-lg bg-dark-raised hover:bg-dark-raised/80 border border-dark-border text-dark-text font-medium transition-colors"
            >
              Apply {Math.round(quality * 100)}% Quality
            </button>
            <button
              type="button"
              onClick={handleDownloadAll}
              className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-semibold flex items-center gap-1.5 transition-colors shadow"
            >
              <Download className="w-3.5 h-3.5" /> Download All ({items.length})
            </button>
            <button
              type="button"
              onClick={handleClearAll}
              className="px-3 py-2 rounded-lg bg-dark-raised hover:bg-dark-raised text-dark-secondary transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Clear
            </button>
          </div>
        )}
      </div>

      {/* Upload Dropzone */}
      <FileDropzone
        accept="image/jpeg,image/png,image/webp"
        maxSize={31457280} // 30 MB
        multiple={true}
        disabled={processing}
        onFilesSelected={handleFilesSelected}
        helpText="Drag & drop one or multiple images (JPEG, PNG, WebP up to 30 MB each)"
      />

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
          {error}
        </div>
      )}

      {processing && (
        <div className="p-8 text-center text-dark-secondary">
          <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs font-medium">Compressing in local browser memory...</p>
        </div>
      )}

      {/* Compressed Items List */}
      {items.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-dark-secondary flex items-center gap-2">
            <Layers className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            Processed Images ({items.length})
          </h3>

          <div className="grid grid-cols-1 gap-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-dark-surface border border-dark-border flex flex-wrap items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.previewUrl}
                    alt={item.file.name}
                    className="w-14 h-14 object-cover rounded-lg border border-dark-border"
                  />
                  <div>
                    <p className="text-sm font-semibold text-dark-text truncate max-w-xs">{item.file.name}</p>
                    <div className="flex items-center gap-3 text-xs text-dark-secondary mt-0.5">
                      <span>{formatBytes(item.originalSize)}</span>
                      <span>→</span>
                      <span className="text-brand-600 dark:text-brand-400 font-semibold">{formatBytes(item.compressedSize)}</span>
                      <span className="px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20 text-[10px] font-bold">
                        -{item.savings.percent}%
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDownloadSingle(item)}
                  className="px-4 py-2 rounded-lg bg-dark-raised hover:bg-brand-600 text-dark-text hover:text-white font-medium text-xs transition-colors flex items-center gap-1.5 ml-auto border border-dark-border hover:border-brand-500"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
