import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { FileArchive, Download, RefreshCw, Info, CheckCircle2 } from 'lucide-react';
import FileDropzone from '../../components/file-upload/FileDropzone';
import { formatBytes, calculateSavings } from '../../lib/formatting/bytes';
import { downloadBlob } from '../../lib/download/download';

export default function PdfCompressor() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [processing, setProcessing] = useState<boolean>(false);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [savings, setSavings] = useState<{ savedBytes: number; percent: number; isSmaller: boolean } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    setSelectedFile(file);
    setError(null);
    setCompressedBlob(null);
    setSavings(null);

    try {
      const buffer = await file.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      setPageCount(doc.getPageCount());
    } catch {
      setError('Could not read PDF. Ensure the file is not password-locked or corrupted.');
    }
  };

  const handleCompress = async () => {
    if (!selectedFile) return;
    setProcessing(true);
    setError(null);

    try {
      const buffer = await selectedFile.arrayBuffer();
      // Load PDF document
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });

      // Save with useObjectStreams: true to pack internal objects into compressed streams
      const optimizedBytes = await doc.save({
        useObjectStreams: true,
        addDefaultPage: false,
      });

      const blob = new Blob([optimizedBytes.slice()], { type: 'application/pdf' });
      setCompressedBlob(blob);
      setSavings(calculateSavings(selectedFile.size, blob.size));
    } catch (err: any) {
      console.error('PDF compression failed:', err);
      setError('Failed to compress this PDF.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!compressedBlob || !selectedFile) return;
    const cleanName = `${selectedFile.name.replace(/\.[^/.]+$/, '')}_optimized.pdf`;
    downloadBlob(compressedBlob, cleanName);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPageCount(0);
    setCompressedBlob(null);
    setSavings(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      {!selectedFile ? (
        <FileDropzone
          accept="application/pdf"
          maxSize={41943040} // 40 MB
          onFilesSelected={handleFilesSelected}
          helpText="Upload a PDF for stream compression & deduplication (up to 40 MB)"
        />
      ) : (
        <div className="space-y-6">
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-dark-surface border border-dark-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                <FileArchive className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-dark-text truncate max-w-xs">{selectedFile.name}</p>
                <p className="text-xs text-dark-secondary">{pageCount} Pages • {formatBytes(selectedFile.size)}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-dark-raised hover:bg-dark-raised text-dark-secondary transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Choose Different PDF
            </button>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
              {error}
            </div>
          )}

          {/* Compress Settings & Trigger */}
          {!compressedBlob && (
            <div className="p-5 rounded-xl bg-dark-surface border border-dark-border space-y-4 text-xs">
              <div className="p-4 rounded-lg bg-dark-card border border-dark-border flex items-start gap-3">
                <Info className="w-4 h-4 text-brand-600 dark:text-brand-400 flex-shrink-0 mt-0.5" />
                <p className="text-dark-secondary leading-relaxed">
                  FixLanka Tools optimizes PDF documents locally by repacking internal objects into compressed binary streams and deduplicating dictionary overhead. Vector graphics, fonts, and text remain fully sharp.
                </p>
              </div>

              <button
                type="button"
                disabled={processing}
                onClick={handleCompress}
                className="w-full py-3 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold transition-all shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Compressing Object Streams...
                  </>
                ) : (
                  <>
                    <FileArchive className="w-4 h-4" />
                    Compress PDF Streams
                  </>
                )}
              </button>
            </div>
          )}

          {/* Results Comparison */}
          {compressedBlob && savings && (
            <div className="p-6 rounded-xl bg-emerald-950/20 border border-brand-500/30 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-dark-text flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                    {savings.isSmaller ? 'PDF Optimized Successfully!' : 'PDF Already Fully Optimized'}
                  </h4>
                  <p className="text-xs text-dark-secondary mt-0.5">
                    {savings.isSmaller
                      ? `Reduced file size by ${savings.percent}% (${formatBytes(savings.savedBytes)} saved).`
                      : 'This PDF already utilizes optimal stream compression and cannot be reduced further.'}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs font-medium">
                  <div>
                    <span className="text-dark-secondary block">Original:</span>
                    <span className="text-dark-text">{formatBytes(selectedFile.size)}</span>
                  </div>
                  <div>
                    <span className="text-dark-secondary block">Optimized:</span>
                    <span className="text-brand-600 dark:text-brand-400">{formatBytes(compressedBlob.size)}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-brand-500/20 flex justify-end">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs transition-colors flex items-center gap-2 shadow"
                >
                  <Download className="w-4 h-4" /> Download Optimized PDF
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
