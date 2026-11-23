import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Split, Download, RefreshCw, FileText, Check } from 'lucide-react';
import FileDropzone from '../../components/file-upload/FileDropzone';
import { formatBytes } from '../../lib/formatting/bytes';
import { downloadBlob } from '../../lib/download/download';

export default function PdfSplitter() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [rangeInput, setRangeInput] = useState<string>('');
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [processing, setProcessing] = useState<boolean>(false);
  const [extractedBlob, setExtractedBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    setSelectedFile(file);
    setError(null);
    setExtractedBlob(null);

    try {
      const buffer = await file.arrayBuffer();
      const doc = await PDFDocument.load(buffer);
      const total = doc.getPageCount();
      setPageCount(total);
      // Select first page by default
      setSelectedPages(new Set([1]));
      setRangeInput('1');
    } catch (err: any) {
      setError('Could not parse PDF. Ensure the file is not password-encrypted.');
    }
  };

  const parseRangeString = (input: string, maxPages: number): Set<number> => {
    const pages = new Set<number>();
    const parts = input.split(',').map((p) => p.trim());

    for (const part of parts) {
      if (part.includes('-')) {
        const [startStr, endStr] = part.split('-');
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);
        if (!isNaN(start) && !isNaN(end)) {
          const s = Math.max(1, Math.min(start, end));
          const e = Math.min(maxPages, Math.max(start, end));
          for (let i = s; i <= e; i++) pages.add(i);
        }
      } else {
        const p = parseInt(part, 10);
        if (!isNaN(p) && p >= 1 && p <= maxPages) {
          pages.add(p);
        }
      }
    }
    return pages;
  };

  const handleRangeTextChange = (text: string) => {
    setRangeInput(text);
    if (pageCount > 0) {
      const parsed = parseRangeString(text, pageCount);
      setSelectedPages(parsed);
    }
  };

  const togglePage = (pageNumber: number) => {
    const next = new Set(selectedPages);
    if (next.has(pageNumber)) {
      next.delete(pageNumber);
    } else {
      next.add(pageNumber);
    }
    setSelectedPages(next);
    // Sync to range string
    const arr = Array.from(next).sort((a, b) => a - b);
    setRangeInput(arr.join(', '));
  };

  const selectAll = () => {
    const all = new Set<number>();
    for (let i = 1; i <= pageCount; i++) all.add(i);
    setSelectedPages(all);
    setRangeInput(`1-${pageCount}`);
  };

  const clearSelection = () => {
    setSelectedPages(new Set());
    setRangeInput('');
  };

  const handleExtract = async () => {
    if (!selectedFile || selectedPages.size === 0) return;
    setProcessing(true);
    setError(null);

    try {
      const buffer = await selectedFile.arrayBuffer();
      const srcDoc = await PDFDocument.load(buffer);
      const newDoc = await PDFDocument.create();

      // Convert 1-based page numbers to 0-based indices in sorted order
      const sortedPageIndices = Array.from(selectedPages)
        .sort((a, b) => a - b)
        .map((p) => p - 1);

      const copied = await newDoc.copyPages(srcDoc, sortedPageIndices);
      copied.forEach((page) => newDoc.addPage(page));

      const newBytes = await newDoc.save();
      const blob = new Blob([newBytes], { type: 'application/pdf' });
      setExtractedBlob(blob);
    } catch (err: any) {
      console.error('Extraction error:', err);
      setError('An error occurred during page extraction.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!extractedBlob || !selectedFile) return;
    const cleanName = `${selectedFile.name.replace(/\.[^/.]+$/, '')}_pages_${Array.from(selectedPages).slice(0, 3).join('-')}.pdf`;
    downloadBlob(extractedBlob, cleanName);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPageCount(0);
    setSelectedPages(new Set());
    setRangeInput('');
    setExtractedBlob(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      {!selectedFile ? (
        <FileDropzone
          accept="application/pdf"
          maxSize={52428800} // 50 MB
          onFilesSelected={handleFilesSelected}
          helpText="Upload a PDF to extract or split pages (up to 50 MB)"
        />
      ) : (
        <div className="space-y-6">
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-dark-surface border border-dark-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                <FileText className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white truncate max-w-xs">{selectedFile.name}</p>
                <p className="text-xs text-slate-400">{pageCount} Total Pages • {formatBytes(selectedFile.size)}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Choose Different PDF
            </button>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
              {error}
            </div>
          )}

          {/* Page Range Input Controls */}
          <div className="p-5 rounded-xl bg-dark-surface border border-dark-border space-y-4 text-xs">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-semibold text-slate-200">Page Range to Extract</label>
                <div className="flex gap-2 text-[11px]">
                  <button type="button" onClick={selectAll} className="text-emerald-400 hover:underline">Select All</button>
                  <span>•</span>
                  <button type="button" onClick={clearSelection} className="text-slate-400 hover:underline">Clear</button>
                </div>
              </div>

              <input
                type="text"
                value={rangeInput}
                onChange={(e) => handleRangeTextChange(e.target.value)}
                placeholder="e.g. 1-3, 5, 7-9"
                className="w-full px-3.5 py-2.5 bg-dark-card border border-slate-700/60 rounded-lg text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Type comma-separated page numbers or ranges (e.g. 1-4, 6, 8-10). Currently selected: <strong>{selectedPages.size} pages</strong>.
              </p>
            </div>

            {/* Interactive Page Chips (up to 60 pages visually) */}
            {pageCount <= 100 && (
              <div>
                <span className="text-slate-400 block mb-2 font-medium">Or Click Individual Pages:</span>
                <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-1">
                  {Array.from({ length: pageCount }, (_, i) => i + 1).map((num) => {
                    const isSelected = selectedPages.has(num);
                    return (
                      <button
                        key={num}
                        type="button"
                        onClick={() => togglePage(num)}
                        className={`w-9 h-9 rounded-lg border text-xs font-semibold flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-emerald-600 border-emerald-500 text-white'
                            : 'bg-dark-card border-slate-700/60 text-slate-300 hover:border-slate-500'
                        }`}
                      >
                        {num}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <button
              type="button"
              disabled={processing || selectedPages.size === 0}
              onClick={handleExtract}
              className="w-full py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold transition-all shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 mt-2"
            >
              {processing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Generating Split PDF...
                </>
              ) : (
                <>
                  <Split className="w-4 h-4" /> Extract Selected {selectedPages.size} Pages
                </>
              )}
            </button>
          </div>

          {/* Results Download */}
          {extractedBlob && (
            <div className="p-6 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" /> New PDF Ready!
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Contains {selectedPages.size} pages • Size: {formatBytes(extractedBlob.size)}
                </p>
              </div>

              <button
                type="button"
                onClick={handleDownload}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center gap-2 shadow"
              >
                <Download className="w-4 h-4" /> Download Extracted PDF
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
