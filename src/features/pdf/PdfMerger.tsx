import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { FilePlus, ArrowUp, ArrowDown, Trash2, Download, RefreshCw, FileText } from 'lucide-react';
import FileDropzone from '../../components/file-upload/FileDropzone';
import { formatBytes } from '../../lib/formatting/bytes';
import { downloadBlob } from '../../lib/download/download';

interface PdfDocItem {
  id: string;
  file: File;
  pageCount: number;
  size: number;
}

export default function PdfMerger() {
  const [docList, setDocList] = useState<PdfDocItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [merging, setMerging] = useState<boolean>(false);
  const [mergedBlob, setMergedBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = async (files: File[]) => {
    setError(null);
    setLoading(true);

    try {
      const newItems: PdfDocItem[] = [];
      for (const file of files) {
        try {
          const buffer = await file.arrayBuffer();
          const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: false });
          newItems.push({
            id: Math.random().toString(36).substring(7),
            file,
            pageCount: pdfDoc.getPageCount(),
            size: file.size,
          });
        } catch (e: any) {
          if (e.message?.includes('encrypt') || e.message?.includes('password')) {
            setError(`File "${file.name}" is password-protected or encrypted. Please decrypt before merging.`);
          } else {
            setError(`Could not read "${file.name}". Ensure it is a valid, uncorrupted PDF document.`);
          }
        }
      }
      setDocList((prev) => [...prev, ...newItems]);
    } finally {
      setLoading(false);
    }
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    setDocList((prev) => {
      const next = [...prev];
      const temp = next[index - 1];
      next[index - 1] = next[index];
      next[index] = temp;
      return next;
    });
  };

  const moveDown = (index: number) => {
    if (index === docList.length - 1) return;
    setDocList((prev) => {
      const next = [...prev];
      const temp = next[index + 1];
      next[index + 1] = next[index];
      next[index] = temp;
      return next;
    });
  };

  const removeItem = (id: string) => {
    setDocList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleMerge = async () => {
    if (docList.length < 2) {
      setError('Please add at least 2 PDF documents to merge.');
      return;
    }

    setMerging(true);
    setError(null);

    try {
      const mergedPdf = await PDFDocument.create();

      for (const item of docList) {
        const buffer = await item.file.arrayBuffer();
        const srcDoc = await PDFDocument.load(buffer);
        const copiedPages = await mergedPdf.copyPages(srcDoc, srcDoc.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedBytes = await mergedPdf.save();
      const blob = new Blob([mergedBytes], { type: 'application/pdf' });
      setMergedBlob(blob);
    } catch (err: any) {
      console.error('Merge error:', err);
      setError('An error occurred while merging your PDF files.');
    } finally {
      setMerging(false);
    }
  };

  const handleDownload = () => {
    if (!mergedBlob) return;
    downloadBlob(mergedBlob, 'merged_document.pdf');
  };

  const handleReset = () => {
    setDocList([]);
    setMergedBlob(null);
    setError(null);
  };

  const totalPages = docList.reduce((acc, item) => acc + item.pageCount, 0);

  return (
    <div className="space-y-6">
      <FileDropzone
        accept="application/pdf"
        maxSize={52428800} // 50 MB
        multiple={true}
        onFilesSelected={handleFilesSelected}
        helpText="Select two or more PDF documents to combine (up to 50 MB each)"
      />

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
          {error}
        </div>
      )}

      {loading && (
        <div className="p-4 text-center text-slate-400 text-xs">
          Reading PDF page structures in browser memory...
        </div>
      )}

      {/* Document Queue List */}
      {docList.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              Documents to Merge ({docList.length}) • Total: {totalPages} Pages
            </h3>

            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Clear List
            </button>
          </div>

          <div className="space-y-2">
            {docList.map((item, index) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-dark-surface border border-dark-border flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-[11px]">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-slate-100 truncate max-w-xs sm:max-w-md">{item.file.name}</p>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      {item.pageCount} {item.pageCount === 1 ? 'page' : 'pages'} • {formatBytes(item.size)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => moveUp(index)}
                    className="p-1.5 rounded-lg bg-dark-card border border-slate-700/60 hover:border-slate-500 text-slate-300 disabled:opacity-30"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={index === docList.length - 1}
                    onClick={() => moveDown(index)}
                    className="p-1.5 rounded-lg bg-dark-card border border-slate-700/60 hover:border-slate-500 text-slate-300 disabled:opacity-30"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="p-1.5 rounded-lg bg-dark-card border border-slate-700/60 hover:border-rose-500 hover:text-rose-400 text-slate-400 ml-1"
                    title="Remove"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Merge Action Button */}
          {!mergedBlob && (
            <button
              type="button"
              disabled={merging || docList.length < 2}
              onClick={handleMerge}
              className="w-full py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-sm transition-all shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 mt-4"
            >
              {merging ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Merging {totalPages} Pages in Browser Memory...
                </>
              ) : (
                <>
                  <FilePlus className="w-4 h-4" />
                  Merge {docList.length} PDFs into One Document
                </>
              )}
            </button>
          )}

          {/* Download Final Result */}
          {mergedBlob && (
            <div className="p-6 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-white">Combined PDF Generated Successfully!</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Total pages: {totalPages} • Merged file size: {formatBytes(mergedBlob.size)}
                </p>
              </div>

              <button
                type="button"
                onClick={handleDownload}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center gap-2 shadow"
              >
                <Download className="w-4 h-4" /> Download Merged PDF
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
