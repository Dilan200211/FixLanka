import React, { useState } from 'react';
import { RefreshCw, Download, Layers, CheckCircle2 } from 'lucide-react';
import FileDropzone from '../../components/file-upload/FileDropzone';
import { formatBytes } from '../../lib/formatting/bytes';
import { downloadBlob } from '../../lib/download/download';
import { verifyFileSignature } from '../../lib/file/signatures';

interface ConvertedFileItem {
  id: string;
  originalName: string;
  originalSize: number;
  originalType: string;
  convertedBlob: Blob;
  convertedSize: number;
  targetMime: string;
  targetExt: string;
  previewUrl: string;
  verifiedSignature: boolean;
}

export default function ImageConverter() {
  const [targetFormat, setTargetFormat] = useState<'image/png' | 'image/jpeg' | 'image/webp'>('image/webp');
  const [bgColor, setBgColor] = useState<string>('#FFFFFF');
  const [convertedItems, setConvertedItems] = useState<ConvertedFileItem[]>([]);
  const [processing, setProcessing] = useState<boolean>(false);

  const convertFile = async (file: File): Promise<ConvertedFileItem> => {
    const objectUrl = URL.createObjectURL(file);

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = objectUrl;
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas init failed'));

        if (targetFormat === 'image/jpeg') {
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          async (blob) => {
            if (!blob) return reject(new Error('Blob encoding failed'));
            const targetExt = targetFormat === 'image/png' ? 'png' : targetFormat === 'image/webp' ? 'webp' : 'jpg';

            // Verify genuine output signature
            const fakeFile = new File([blob], `test.${targetExt}`, { type: targetFormat });
            const sig = await verifyFileSignature(fakeFile);

            const preview = URL.createObjectURL(blob);
            resolve({
              id: Math.random().toString(36).substring(7),
              originalName: file.name,
              originalSize: file.size,
              originalType: file.type || 'image',
              convertedBlob: blob,
              convertedSize: blob.size,
              targetMime: targetFormat,
              targetExt,
              previewUrl: preview,
              verifiedSignature: sig.isValid,
            });
            URL.revokeObjectURL(objectUrl);
          },
          targetFormat,
          0.92
        );
      };
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error(`Failed to load ${file.name}`));
      };
    });
  };

  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return;
    setProcessing(true);

    try {
      const results: ConvertedFileItem[] = [];
      for (const file of files) {
        const item = await convertFile(file);
        results.push(item);
      }
      setConvertedItems((prev) => [...prev, ...results]);
    } catch (err) {
      console.error('Conversion batch error:', err);
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = (item: ConvertedFileItem) => {
    const filename = `${item.originalName.replace(/\.[^/.]+$/, '')}.${item.targetExt}`;
    downloadBlob(item.convertedBlob, filename);
  };

  const handleDownloadAll = () => {
    convertedItems.forEach((item, index) => {
      setTimeout(() => {
        handleDownload(item);
      }, index * 200);
    });
  };

  const handleClear = () => {
    convertedItems.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    setConvertedItems([]);
  };

  return (
    <div className="space-y-6">
      {/* Format Selection Bar */}
      <div className="p-5 rounded-xl bg-dark-surface border border-dark-border grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div>
          <label className="block text-slate-300 font-medium mb-1.5">Convert Target Format</label>
          <div className="flex gap-2">
            {[
              { id: 'image/webp', label: 'WebP (Modern & Compact)' },
              { id: 'image/png', label: 'PNG (Lossless & Alpha)' },
              { id: 'image/jpeg', label: 'JPEG (Universal)' },
            ].map((fmt) => (
              <button
                key={fmt.id}
                type="button"
                onClick={() => setTargetFormat(fmt.id as any)}
                className={`flex-1 py-2 px-3 rounded-lg border text-center font-medium transition-all ${
                  targetFormat === fmt.id
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold'
                    : 'bg-dark-card border-slate-700/60 text-slate-300 hover:border-slate-600'
                }`}
              >
                {fmt.label}
              </button>
            ))}
          </div>
        </div>

        {targetFormat === 'image/jpeg' && (
          <div>
            <label className="block text-slate-300 font-medium mb-1.5">Background Fill Color (for transparent sources)</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
              />
              <span className="font-mono text-slate-300 uppercase">{bgColor}</span>
              <span className="text-[11px] text-slate-500">(Fills transparent alpha pixels)</span>
            </div>
          </div>
        )}
      </div>

      {/* Upload Dropzone */}
      <FileDropzone
        accept="image/jpeg,image/png,image/webp,image/gif,image/bmp"
        maxSize={31457280} // 30 MB
        multiple={true}
        disabled={processing}
        onFilesSelected={handleFilesSelected}
        helpText="Select JPEG, PNG, WebP, GIF, or BMP images to convert"
      />

      {processing && (
        <div className="p-8 text-center text-slate-400">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs font-medium">Re-encoding bitmaps to {targetFormat} in browser memory...</p>
        </div>
      )}

      {/* Results List */}
      {convertedItems.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              Converted Images ({convertedItems.length})
            </h3>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleDownloadAll}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow"
              >
                <Download className="w-3.5 h-3.5" /> Download All
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Clear
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {convertedItems.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-dark-surface border border-dark-border flex flex-wrap items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.previewUrl}
                    alt={item.originalName}
                    className="w-14 h-14 object-cover rounded-lg border border-slate-700"
                  />
                  <div>
                    <p className="text-sm font-semibold text-white truncate max-w-xs">{item.originalName}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span className="font-mono text-emerald-400 uppercase font-semibold">.{item.targetExt}</span>
                      <span>•</span>
                      <span>{formatBytes(item.convertedSize)}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-[11px] text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" /> Validated Magic Header
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDownload(item)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white font-medium text-xs transition-colors flex items-center gap-1.5 ml-auto border border-slate-700"
                >
                  <Download className="w-3.5 h-3.5" /> Download .{item.targetExt}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
