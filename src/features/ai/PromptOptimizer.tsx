import React, { useState } from 'react';
import { Wand2, Copy, Check, RefreshCw, Sparkles, BookOpen } from 'lucide-react';

type PromptCategory = 'coding' | 'image' | 'writing' | 'research' | 'system';

interface TemplateOption {
  label: string;
  category: PromptCategory;
  raw: string;
}

const TEMPLATES: TemplateOption[] = [
  {
    label: 'Code Refactoring',
    category: 'coding',
    raw: 'Refactor this TypeScript function for better readability and performance.',
  },
  {
    label: 'Midjourney Cinematic Photo',
    category: 'image',
    raw: 'A vintage espresso machine in a modern minimalist cafe at golden hour.',
  },
  {
    label: 'High-Converting Landing Page Copy',
    category: 'writing',
    raw: 'Write landing page hero copy for a privacy-first file utility.',
  },
  {
    label: 'Academic Paper Summary',
    category: 'research',
    raw: 'Summarize the core methodology and limitations of this research study.',
  },
];

export default function PromptOptimizer() {
  const [category, setCategory] = useState<PromptCategory>('coding');
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [role, setRole] = useState<string>('Staff Software Engineer');
  const [audience, setAudience] = useState<string>('Senior Developers');
  const [optimizedPrompt, setOptimizedPrompt] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const optimizePromptText = () => {
    if (!inputPrompt.trim()) return;

    let enhanced = '';

    if (category === 'coding') {
      enhanced = `### ROLE
You are an expert ${role || 'Principal Software Engineer'} specializing in robust, maintainable architecture.

### OBJECTIVE
${inputPrompt.trim()}

### GUIDELINES & CONSTRAINTS
1. Target Audience: ${audience || 'Production Environment'}.
2. Code Standards: Use modern best practices, strict type safety, and clean modular functions.
3. Edge Cases: Identify and handle null, undefined, network failure, and memory bounds.
4. Explanations: Provide a concise breakdown of architectural decisions followed by the complete code block.
5. No Fluff: Avoid pleasantries; begin directly with the solution.`;
    } else if (category === 'image') {
      enhanced = `/imagine prompt: ${inputPrompt.trim()}, 8k resolution, cinematic lighting, shot on 35mm lens, f/1.8, photorealistic, intricate textures, octane render, volumetric smoke, photorealistic depth of field, hyper-detailed, award-winning photography --ar 16:9 --style raw --v 6.0 --q 2 --no blur, watermark, deformed, bad anatomy`;
    } else if (category === 'writing') {
      enhanced = `### ROLE & PERSONA
You are an elite direct-response copywriter and content strategist.

### PRIMARY GOAL
${inputPrompt.trim()}

### AUDIENCE
Target persona: ${audience || 'Savvy tech professionals'}.

### FORMATTING & TONE
- Tone: Clear, persuasive, authoritative, and concise.
- Structure: Strong opening hook, problem agitation, solution clarity, bulleted key benefits, and an irresistible call-to-action (CTA).
- Constraint: Zero clichés (avoid words like "game-changer", "unleash", "delve").`;
    } else if (category === 'research') {
      enhanced = `### ROLE
You are a senior research analyst and scientific literature reviewer.

### RESEARCH INQUIRY
${inputPrompt.trim()}

### METHODOLOGICAL REQUIREMENTS
1. Analyze core assumptions and theoretical foundations.
2. Synthesize findings objectively, separating empirical data from speculative claims.
3. Highlight known counterarguments, limitations, and potential methodological biases.
4. Output Format: Executive Summary, Key Evidence, Critical Evaluation, and Next Questions.`;
    } else {
      enhanced = `### SYSTEM DIRECTIVE
You are an AI assistant designed for high accuracy and precision.

### USER QUERY
${inputPrompt.trim()}

### OPERATIONAL CONSTRAINTS
- Factuality: Provide only verified information. If uncertain, state the exact limitation.
- Tone: Neutral, objective, and dense with substance.
- Format: Use structured headings, bullet points, and code formatting where applicable.`;
    }

    setOptimizedPrompt(enhanced);
  };

  const handleCopy = () => {
    if (!optimizedPrompt) return;
    navigator.clipboard.writeText(optimizedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUseTemplate = (tmpl: TemplateOption) => {
    setCategory(tmpl.category);
    setInputPrompt(tmpl.raw);
    if (tmpl.category === 'coding') setRole('Principal Software Architect');
    if (tmpl.category === 'writing') setRole('Senior Copywriter');
  };

  return (
    <div className="space-y-6 text-xs">
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'coding', label: 'Coding & Tech' },
          { id: 'image', label: 'Midjourney / Image' },
          { id: 'writing', label: 'Copywriting' },
          { id: 'research', label: 'Research & Study' },
          { id: 'system', label: 'System Prompts' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              setCategory(tab.id as any);
              setOptimizedPrompt('');
            }}
            className={`px-3.5 py-2 rounded-lg font-semibold transition-all ${
              category === tab.id
                ? 'bg-emerald-600 text-white shadow'
                : 'bg-dark-surface border border-slate-700/60 text-slate-300 hover:border-slate-500'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Quick Templates Bar */}
      <div className="p-3.5 rounded-xl bg-dark-surface border border-dark-border flex flex-wrap items-center gap-2">
        <span className="text-slate-400 font-medium flex items-center gap-1.5 mr-1">
          <BookOpen className="w-3.5 h-3.5 text-emerald-400" /> Quick Starters:
        </span>
        {TEMPLATES.map((tmpl) => (
          <button
            key={tmpl.label}
            type="button"
            onClick={() => handleUseTemplate(tmpl)}
            className="px-2.5 py-1 rounded bg-dark-card border border-slate-700/60 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 text-[11px]"
          >
            {tmpl.label}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="p-5 rounded-xl bg-dark-surface border border-dark-border space-y-4">
        <div>
          <label className="block text-slate-200 font-semibold mb-1.5">
            Your Initial Idea or Draft Prompt:
          </label>
          <textarea
            rows={4}
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder="e.g. Build an authentication system in React with JWT..."
            className="w-full px-3.5 py-2.5 bg-dark-card border border-slate-700/60 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
        </div>

        {category !== 'image' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Target Persona / Role</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Staff Architect"
                className="w-full px-3 py-2 bg-dark-card border border-slate-700/60 rounded-lg text-slate-100"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Target Audience</label>
              <input
                type="text"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="e.g. Production Team"
                className="w-full px-3 py-2 bg-dark-card border border-slate-700/60 rounded-lg text-slate-100"
              />
            </div>
          </div>
        )}

        <button
          type="button"
          disabled={!inputPrompt.trim()}
          onClick={optimizePromptText}
          className="w-full py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold transition-all shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2"
        >
          <Wand2 className="w-4 h-4" /> Optimize Prompt Structure
        </button>
      </div>

      {/* Output Display */}
      {optimizedPrompt && (
        <div className="p-5 rounded-xl bg-emerald-950/15 border border-emerald-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400" /> Optimized Prompt
            </span>

            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy Prompt'}
            </button>
          </div>

          <pre className="p-4 rounded-xl bg-dark-card border border-slate-800 text-slate-200 font-mono text-xs whitespace-pre-wrap leading-relaxed overflow-x-auto">
            {optimizedPrompt}
          </pre>
        </div>
      )}
    </div>
  );
}
