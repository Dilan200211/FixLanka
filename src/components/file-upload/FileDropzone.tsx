import React, { useState, useRef } from 'react';
import { Upload, X, AlertCircle } from 'lucide-react';
import { formatBytes } from '../../lib/formatting/bytes';
import { verifyFileSignature } from '../../lib/file/signatures';

interface FileDropzoneProps {
  accept?: string;
  maxSize: number; // in bytes
  multiple?: boolean;
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
  helpText?: string;
}

export default function FileDropzone({
  accept,
  maxSize,
  multiple = false,
  onFilesSelected,
  disabled = false,
  helpText,
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFileList = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0 || disabled) return;
    setErrorMessage(null);

    const validFiles: File[] = [];
    const filesArray = Array.from(fileList);

    for (const file of filesArray) {
      // 1. File size check
      if (file.size > maxSize) {
        setErrorMessage(`File "${file.name}" exceeds the maximum limit of ${formatBytes(maxSize)}.`);
        return;
      }

      // 2. Magic byte / signature check (if binary file)
      if (file.size > 0 && !file.name.endsWith('.txt')) {
        const sig = await verifyFileSignature(file);
        // If image or PDF is requested, verify detected format matches
        if (accept && accept.includes('image/') && !sig.detectedMime.startsWith('image/')) {
          setErrorMessage(`File "${file.name}" does not appear to be a valid image.`);
          return;
        }
        if (accept && accept.includes('application/pdf') && sig.detectedMime !== 'application/pdf') {
          setErrorMessage(`File "${file.name}" is not a valid PDF document.`);
          return;
        }
      }

      validFiles.push(file);
      if (!multiple) break;
    }

    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    processFileList(e.dataTransfer.files);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFileList(e.target.files);
    // Reset input so the same file can be re-selected if removed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full space-y-3">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center p-8 sm:p-12 rounded-xl border-2 border-dashed transition-colors cursor-pointer ${
          disabled
            ? 'opacity-50 cursor-not-allowed border-dark-border bg-dark-raised/30'
            : isDragging
            ? 'border-brand-500 bg-brand-500/10'
            : 'border-dark-border-strong hover:border-brand-500/60 bg-dark-surface hover:bg-dark-raised/40'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInputChange}
          disabled={disabled}
          className="hidden"
        />

        <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mb-3">
          <Upload className="w-5 h-5 text-brand-600 dark:text-brand-400" />
        </div>

        <p className="text-sm font-semibold text-dark-text text-center">
          Click to choose a file or drag & drop here
        </p>
        <p className="text-xs text-dark-secondary mt-1 text-center">
          {helpText || `Max file size: ${formatBytes(maxSize)} ${multiple ? '• Multiple files allowed' : ''}`}
        </p>
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="ml-auto p-1 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
