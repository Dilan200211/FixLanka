import React, { useState, useEffect } from 'react';
import { Key, Copy, Check, RefreshCw, ShieldCheck, ShieldAlert } from 'lucide-react';

export default function PasswordGenerator() {
  const [length, setLength] = useState<number>(20);
  const [includeUpper, setIncludeUpper] = useState<boolean>(true);
  const [includeLower, setIncludeLower] = useState<boolean>(true);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState<boolean>(true);

  const [password, setPassword] = useState<string>('');
  const [entropy, setEntropy] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  const generatePassword = () => {
    let charset = '';
    if (includeUpper) charset += 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    if (includeLower) charset += 'abcdefghijkmnopqrstuvwxyz';
    if (includeNumbers) charset += '23456789';
    if (includeSymbols) charset += '!@#$%^&*()-_=+[]{}|;:,.<>?';

    if (!excludeAmbiguous) {
      if (includeUpper) charset += 'IO';
      if (includeLower) charset += 'l';
      if (includeNumbers) charset += '01';
    }

    if (!charset) {
      setPassword('');
      setEntropy(0);
      return;
    }

    // Cryptographically secure randomness via window.crypto.getRandomValues
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);

    let result = '';
    for (let i = 0; i < length; i++) {
      result += charset[array[i] % charset.length];
    }

    setPassword(result);

    // Calculate Shannon entropy: length * log2(charset.length)
    const ent = Math.round(length * Math.log2(charset.length));
    setEntropy(ent);
  };

  useEffect(() => {
    generatePassword();
  }, [length, includeUpper, includeLower, includeNumbers, includeSymbols, excludeAmbiguous]);

  const handleCopy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStrengthLabel = (ent: number) => {
    if (ent >= 80) return { label: 'Very Strong', color: 'text-brand-600 dark:text-brand-400', bar: 'bg-emerald-500 w-full' };
    if (ent >= 60) return { label: 'Strong', color: 'text-teal-400', bar: 'bg-teal-500 w-3/4' };
    if (ent >= 40) return { label: 'Moderate', color: 'text-amber-400', bar: 'bg-amber-500 w-1/2' };
    return { label: 'Weak', color: 'text-rose-400', bar: 'bg-rose-500 w-1/4' };
  };

  const strength = getStrengthLabel(entropy);

  return (
    <div className="space-y-6 text-xs max-w-2xl mx-auto">
      {/* Generated Password Box */}
      <div className="p-6 rounded-2xl bg-dark-surface border border-dark-border space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-dark-secondary font-semibold tracking-wider uppercase text-[11px] flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" /> Cryptographically Random Password
          </span>
          <span className={`font-semibold ${strength.color}`}>
            {strength.label} ({entropy} bits entropy)
          </span>
        </div>

        {/* Display Field */}
        <div className="flex items-center gap-2 p-3 bg-dark-card border border-dark-border rounded-xl">
          <input
            type="text"
            readOnly
            value={password}
            className="w-full bg-transparent text-dark-text font-mono text-base font-bold tracking-wider focus:outline-none select-all"
          />

          <button
            type="button"
            onClick={generatePassword}
            className="p-2 rounded-lg bg-dark-raised hover:bg-dark-raised text-dark-secondary hover:text-white transition-colors"
            title="Generate New Password"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-bold transition-all shadow flex items-center gap-1.5 flex-shrink-0"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        {/* Strength Meter Bar */}
        <div className="w-full h-1.5 bg-dark-raised rounded-full overflow-hidden">
          <div className={`h-full transition-all duration-300 ${strength.bar}`}></div>
        </div>
      </div>

      {/* Configuration Controls */}
      <div className="p-6 rounded-2xl bg-dark-surface border border-dark-border space-y-5">
        <div>
          <div className="flex justify-between font-semibold text-dark-text mb-2">
            <span>Password Length</span>
            <span className="font-mono text-brand-600 dark:text-brand-400 font-bold text-sm">{length} characters</span>
          </div>
          <input
            type="range"
            min="8"
            max="64"
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value))}
            className="w-full accent-brand-600 cursor-pointer"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-dark-border">
          <label className="flex items-center gap-2.5 p-3 rounded-lg bg-dark-card border border-dark-border cursor-pointer">
            <input
              type="checkbox"
              checked={includeUpper}
              onChange={(e) => setIncludeUpper(e.target.checked)}
              className="w-4 h-4 rounded accent-brand-600"
            />
            <span className="text-dark-text font-medium">Uppercase Letters (A-Z)</span>
          </label>

          <label className="flex items-center gap-2.5 p-3 rounded-lg bg-dark-card border border-dark-border cursor-pointer">
            <input
              type="checkbox"
              checked={includeLower}
              onChange={(e) => setIncludeLower(e.target.checked)}
              className="w-4 h-4 rounded accent-brand-600"
            />
            <span className="text-dark-text font-medium">Lowercase Letters (a-z)</span>
          </label>

          <label className="flex items-center gap-2.5 p-3 rounded-lg bg-dark-card border border-dark-border cursor-pointer">
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={(e) => setIncludeNumbers(e.target.checked)}
              className="w-4 h-4 rounded accent-brand-600"
            />
            <span className="text-dark-text font-medium">Numbers (0-9)</span>
          </label>

          <label className="flex items-center gap-2.5 p-3 rounded-lg bg-dark-card border border-dark-border cursor-pointer">
            <input
              type="checkbox"
              checked={includeSymbols}
              onChange={(e) => setIncludeSymbols(e.target.checked)}
              className="w-4 h-4 rounded accent-brand-600"
            />
            <span className="text-dark-text font-medium">Special Symbols (!@#$%)</span>
          </label>
        </div>

        <div className="pt-2">
          <label className="flex items-center gap-2.5 cursor-pointer text-dark-secondary">
            <input
              type="checkbox"
              checked={excludeAmbiguous}
              onChange={(e) => setExcludeAmbiguous(e.target.checked)}
              className="w-4 h-4 rounded accent-brand-600"
            />
            <span>Exclude ambiguous characters (avoid confusing <code>0</code> and <code>O</code>, <code>1</code> and <code>l</code>)</span>
          </label>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-emerald-950/15 border border-brand-500/20 text-dark-secondary flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-brand-600 dark:text-brand-400 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Zero Storage Guarantee:</strong> Generated passwords use <code>window.crypto.getRandomValues()</code> and reside strictly in your browser RAM. They are never sent to a server, saved in cookies, or logged.
        </p>
      </div>
    </div>
  );
}
