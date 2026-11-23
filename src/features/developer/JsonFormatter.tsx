import React, { useState } from 'react';
import { Braces, Copy, Check, Download, AlertCircle, FileText, Minimize2 } from 'lucide-react';
import { formatBytes } from '../../lib/formatting/bytes';
import { downloadText } from '../../lib/download/download';

export default function JsonFormatter() {
  const [inputJson, setInputJson] = useState<string>('{\n  "name": "FixLanka Tools",\n  "version": "1.0.0",\n  "features": ["privacy", "client-side", "fast"],\n  "free": true\n}');
  const [outputJson, setOutputJson] = useState<string>('');
  const [indentation, setIndentation] = useState<number | string>(2);
  const [errorInfo, setErrorInfo] = useState<{ message: string; line?: number; column?: number } | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [metrics, setMetrics] = useState<{ keys: number; size: number } | null>(null);

  const formatJson = (indent: number | string = indentation) => {
    setErrorInfo(null);
    if (!inputJson.trim()) {
      setOutputJson('');
      setMetrics(null);
      return;
    }

    try {
      const parsed = JSON.parse(inputJson);
      const space = indent === 'tab' ? '\t' : indent === 0 ? 0 : Number(indent);
      const formatted = JSON.stringify(parsed, null, space);
      setOutputJson(formatted);

      // Calculate keys count
      const countKeys = (obj: any): number => {
        if (typeof obj !== 'object' || obj === null) return 0;
        let c = Object.keys(obj).length;
        for (const k in obj) {
          if (typeof obj[k] === 'object') c += countKeys(obj[k]);
        }
        return c;
      };

      setMetrics({
        keys: countKeys(parsed),
        size: new Blob([formatted]).size,
      });
    } catch (err: any) {
      // Extract line & column if available
      const msg = err.message || 'Invalid JSON syntax';
      let line: number | undefined;
      let col: number | undefined;

      const posMatch = msg.match(/position (\d+)/i);
      if (posMatch) {
        const pos = parseInt(posMatch[1], 10);
        const lines = inputJson.slice(0, pos).split('\n');
        line = lines.length;
        col = lines[lines.length - 1].length + 1;
      }

      setErrorInfo({ message: msg, line, column: col });
    }
  };

  const minifyJson = () => {
    setIndentation(0);
    formatJson(0);
  };

  const handleCopy = () => {
    const textToCopy = outputJson || inputJson;
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const content = outputJson || inputJson;
    if (!content) return;
    downloadText(content, 'formatted.json', 'application/json');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setInputJson(content);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 text-xs">
      {/* Top Action Bar */}
      <div className="p-4 rounded-xl bg-dark-surface border border-dark-border flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <label className="text-slate-300 font-medium">Indent:</label>
          <select
            value={indentation}
            onChange={(e) => {
              const val = e.target.value === 'tab' ? 'tab' : parseInt(e.target.value);
              setIndentation(val);
              formatJson(val);
            }}
            className="px-2.5 py-1.5 bg-dark-card border border-slate-700/60 rounded-lg text-slate-100"
          >
            <option value={2}>2 Spaces</option>
            <option value={4}>4 Spaces</option>
            <option value="tab">Tab Character</option>
          </select>

          <button
            type="button"
            onClick={minifyJson}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-card border border-slate-700/60 hover:border-slate-500 text-slate-300 transition-colors"
          >
            <Minimize2 className="w-3.5 h-3.5" /> Minify
          </button>
        </div>

        <div className="flex items-center gap-2">
          <label className="px-3 py-1.5 rounded-lg bg-dark-card border border-slate-700/60 hover:border-slate-500 text-slate-300 cursor-pointer transition-colors flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" /> Open File
            <input type="file" accept=".json,application/json,text/plain" onChange={handleFileUpload} className="hidden" />
          </label>

          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-card border border-slate-700/60 hover:border-slate-500 text-slate-300 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Download
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {errorInfo && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">JSON Syntax Error</p>
            <p className="mt-0.5">{errorInfo.message}</p>
            {errorInfo.line && (
              <p className="text-[11px] text-rose-300 mt-1">
                Detected at Line {errorInfo.line}, Column {errorInfo.column}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Editor Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Raw Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-slate-400 font-medium">
            <span>Input JSON:</span>
            <span>{formatBytes(new Blob([inputJson]).size)}</span>
          </div>
          <textarea
            rows={16}
            value={inputJson}
            onChange={(e) => {
              setInputJson(e.target.value);
            }}
            placeholder="Paste raw JSON here..."
            className="w-full p-3.5 bg-dark-card border border-slate-700/60 rounded-xl text-slate-100 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/50 leading-relaxed resize-y"
          />
          <button
            type="button"
            onClick={() => formatJson(indentation)}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow flex items-center justify-center gap-2"
          >
            <Braces className="w-4 h-4" /> Format & Validate JSON
          </button>
        </div>

        {/* Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-slate-400 font-medium">
            <span>Formatted Output:</span>
            {metrics && (
              <span className="text-emerald-400 font-mono">
                {metrics.keys} keys • {formatBytes(metrics.size)}
              </span>
            )}
          </div>
          <textarea
            readOnly
            rows={16}
            value={outputJson || (errorInfo ? '' : inputJson)}
            placeholder="Formatted JSON will appear here..."
            className="w-full p-3.5 bg-dark-surface border border-slate-800 rounded-xl text-slate-100 font-mono text-xs focus:outline-none leading-relaxed resize-y"
          />
        </div>
      </div>
    </div>
  );
}
