import React, { useState } from 'react';
import { Copy, Check, Download, AlertCircle, RefreshCw, Upload } from 'lucide-react';
import { downloadText } from '../../lib/download/download';

export default function Base64Tool() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [inputText, setInputText] = useState<string>('Hello from FixLanka Tools! 🚀');
  const [outputText, setOutputText] = useState<string>('');
  const [urlSafe, setUrlSafe] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // UTF-8 safe encode helper
  const encodeUtf8Base64 = (str: string, isUrlSafe: boolean): string => {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(str);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    let base64 = btoa(binary);
    if (isUrlSafe) {
      base64 = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }
    return base64;
  };

  // UTF-8 safe decode helper
  const decodeUtf8Base64 = (base64Str: string, isUrlSafe: boolean): string => {
    let clean = base64Str.trim();
    if (isUrlSafe) {
      clean = clean.replace(/-/g, '+').replace(/_/g, '/');
      while (clean.length % 4 !== 0) clean += '=';
    }
    const binary = atob(clean);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const decoder = new TextDecoder();
    return decoder.decode(bytes);
  };

  const handleProcess = () => {
    setError(null);
    if (!inputText) {
      setOutputText('');
      return;
    }

    try {
      if (mode === 'encode') {
        const res = encodeUtf8Base64(inputText, urlSafe);
        setOutputText(res);
      } else {
        const res = decodeUtf8Base64(inputText, urlSafe);
        setOutputText(res);
      }
    } catch (err: any) {
      setError('Invalid Base64 string. Please verify the characters and padding.');
    }
  };

  // Auto-process on input or mode change
  React.useEffect(() => {
    handleProcess();
  }, [inputText, mode, urlSafe]);

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!outputText) return;
    const name = mode === 'encode' ? 'encoded.b64' : 'decoded.txt';
    downloadText(outputText, name);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (mode === 'encode') {
        // Read file as Data URL
        setInputText(result);
      } else {
        setInputText(result);
      }
    };
    if (mode === 'encode') {
      reader.readAsDataURL(file);
    } else {
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6 text-xs">
      {/* Mode Navigation Bar */}
      <div className="p-4 rounded-xl bg-dark-surface border border-dark-border flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="flex bg-dark-card p-1 rounded-lg border border-dark-border">
            <button
              type="button"
              onClick={() => {
                setMode('encode');
                setInputText('FixLanka Tools — Privacy First 🔒');
              }}
              className={`px-4 py-1.5 rounded-md font-semibold transition-all ${
                mode === 'encode' ? 'bg-brand-600 text-white' : 'text-dark-secondary hover:text-white'
              }`}
            >
              Encode
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('decode');
                setInputText('Rml4TGFua2EgVG9vbHMg4oCUIFByaXZhY3kgRmlyc3Qg8J+UkQ==');
              }}
              className={`px-4 py-1.5 rounded-md font-semibold transition-all ${
                mode === 'decode' ? 'bg-brand-600 text-white' : 'text-dark-secondary hover:text-white'
              }`}
            >
              Decode
            </button>
          </div>

          <label className="flex items-center gap-2 cursor-pointer ml-3 text-dark-secondary font-medium">
            <input
              type="checkbox"
              checked={urlSafe}
              onChange={(e) => setUrlSafe(e.target.checked)}
              className="w-4 h-4 rounded accent-brand-600 bg-dark-card border-dark-border"
            />
            <span>URL-Safe Base64</span>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <label className="px-3 py-1.5 rounded-lg bg-dark-card border border-dark-border hover:border-brand-500/40 text-dark-secondary cursor-pointer transition-colors flex items-center gap-1.5">
            <Upload className="w-3.5 h-3.5" /> Upload File
            <input type="file" onChange={handleFileUpload} className="hidden" />
          </label>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-card border border-dark-border hover:border-brand-500/40 text-dark-secondary transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-medium transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Download
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Input / Output Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div className="space-y-2">
          <label className="block text-dark-secondary font-medium">
            {mode === 'encode' ? 'Text or Payload to Encode (UTF-8):' : 'Base64 String to Decode:'}
          </label>
          <textarea
            rows={12}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type or paste text..."
            className="w-full p-3.5 bg-dark-card border border-dark-border rounded-xl text-dark-text font-mono text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/50 leading-relaxed resize-y"
          />
        </div>

        {/* Output */}
        <div className="space-y-2">
          <label className="block text-dark-secondary font-medium">
            {mode === 'encode' ? 'Base64 Output:' : 'Decoded UTF-8 Text:'}
          </label>
          <textarea
            readOnly
            rows={12}
            value={outputText}
            placeholder="Processed output..."
            className="w-full p-3.5 bg-dark-surface border border-dark-border rounded-xl text-dark-text font-mono text-xs focus:outline-none leading-relaxed resize-y break-all"
          />
        </div>
      </div>
    </div>
  );
}
