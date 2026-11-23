import React, { useState } from 'react';
import { Tag, Copy, Check, Eye, Globe } from 'lucide-react';

export default function MetaTagGenerator() {
  const [title, setTitle] = useState<string>('FixLanka Tools — Free, Privacy-First Online Toolbox');
  const [description, setDescription] = useState<string>('Powerful browser-based tools for images, PDFs, metadata, and developers. 100% private with zero server uploads.');
  const [url, setUrl] = useState<string>('https://fixlanka.com');
  const [image, setImage] = useState<string>('https://fixlanka.com/og-image.png');
  const [siteName, setSiteName] = useState<string>('FixLanka Tools');
  const [themeColor, setThemeColor] = useState<string>('#0b0d11');
  const [allowRobots, setAllowRobots] = useState<boolean>(true);
  const [twitterHandle, setTwitterHandle] = useState<string>('@fixlankatools');
  const [copied, setCopied] = useState<boolean>(false);

  // Generate HTML Tags
  const generateHtml = (): string => {
    return `<!-- Primary Meta Tags -->
<title>${title}</title>
<meta name="title" content="${title}" />
<meta name="description" content="${description}" />
<link rel="canonical" href="${url}" />
<meta name="theme-color" content="${themeColor}" />
<meta name="robots" content="${allowRobots ? 'index, follow' : 'noindex, nofollow'}" />

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:url" content="${url}" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:image" content="${image}" />
<meta property="og:site_name" content="${siteName}" />

<!-- Twitter / X -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:url" content="${url}" />
<meta name="twitter:title" content="${title}" />
<meta name="twitter:description" content="${description}" />
<meta name="twitter:image" content="${image}" />
${twitterHandle ? `<meta name="twitter:site" content="${twitterHandle}" />` : ''}`.trim();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateHtml());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 text-xs">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Configuration Form */}
        <div className="p-5 rounded-xl bg-dark-surface border border-dark-border space-y-4">
          <h3 className="font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Tag className="w-4 h-4 text-emerald-400" /> Meta Tag Settings
          </h3>

          <div>
            <div className="flex justify-between font-medium text-slate-300 mb-1">
              <span>Page Title</span>
              <span className={`font-mono ${title.length > 60 ? 'text-amber-400' : 'text-slate-400'}`}>
                {title.length}/60 chars
              </span>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-dark-card border border-slate-700/60 rounded-lg text-slate-100"
            />
          </div>

          <div>
            <div className="flex justify-between font-medium text-slate-300 mb-1">
              <span>Meta Description</span>
              <span className={`font-mono ${description.length > 160 ? 'text-amber-400' : 'text-slate-400'}`}>
                {description.length}/160 chars
              </span>
            </div>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-dark-card border border-slate-700/60 rounded-lg text-slate-100"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Canonical URL</label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-3 py-2 bg-dark-card border border-slate-700/60 rounded-lg text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Social Image URL</label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full px-3 py-2 bg-dark-card border border-slate-700/60 rounded-lg text-slate-100 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Site Brand Name</label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full px-3 py-2 bg-dark-card border border-slate-700/60 rounded-lg text-slate-100"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Theme Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={themeColor}
                  onChange={(e) => setThemeColor(e.target.value)}
                  className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={themeColor}
                  onChange={(e) => setThemeColor(e.target.value)}
                  className="w-full px-2 py-1.5 bg-dark-card border border-slate-700/60 rounded-lg text-slate-100 font-mono"
                />
              </div>
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Twitter Handle</label>
              <input
                type="text"
                value={twitterHandle}
                onChange={(e) => setTwitterHandle(e.target.value)}
                className="w-full px-3 py-2 bg-dark-card border border-slate-700/60 rounded-lg text-slate-100"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer pt-2 text-slate-300 font-medium">
            <input
              type="checkbox"
              checked={allowRobots}
              onChange={(e) => setAllowRobots(e.target.checked)}
              className="w-4 h-4 rounded accent-emerald-500"
            />
            <span>Allow Search Engines to Index & Follow (robots.txt friendly)</span>
          </label>
        </div>

        {/* Live Previews Column */}
        <div className="space-y-4">
          {/* Google SERP Preview */}
          <div className="p-5 rounded-xl bg-dark-surface border border-dark-border space-y-2">
            <h4 className="font-bold text-slate-300 flex items-center gap-2 mb-2">
              <Globe className="w-4 h-4 text-blue-400" /> Google Search Preview
            </h4>
            <div className="p-4 rounded-lg bg-[#202124] border border-slate-800 space-y-1">
              <div className="text-[11px] text-slate-400 truncate">{url}</div>
              <div className="text-base font-medium text-[#8ab4f8] hover:underline cursor-pointer truncate">
                {title || 'Page Title'}
              </div>
              <div className="text-xs text-[#bdc1c6] line-clamp-2 leading-relaxed">
                {description || 'Page meta description will appear here in search engine results.'}
              </div>
            </div>
          </div>

          {/* Social Card Preview */}
          <div className="p-5 rounded-xl bg-dark-surface border border-dark-border space-y-2">
            <h4 className="font-bold text-slate-300 flex items-center gap-2 mb-2">
              <Eye className="w-4 h-4 text-emerald-400" /> Social Card Preview
            </h4>
            <div className="rounded-lg border border-slate-800 bg-[#16181c] overflow-hidden">
              <div className="h-32 bg-slate-800 flex items-center justify-center text-slate-500 text-xs overflow-hidden">
                {image ? (
                  <img src={image} alt="Preview" className="w-full h-full object-cover" onError={(e) => { (e.target as any).style.display = 'none'; }} />
                ) : (
                  'Social Share Image'
                )}
              </div>
              <div className="p-3 space-y-1">
                <p className="text-[10px] uppercase text-slate-500 tracking-wider font-semibold truncate">{siteName}</p>
                <p className="text-xs font-bold text-white line-clamp-1">{title}</p>
                <p className="text-[11px] text-slate-400 line-clamp-2">{description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Generated Code Section */}
      <div className="p-5 rounded-xl bg-dark-surface border border-dark-border space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-bold text-white">Generated HTML Meta Tags</span>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied HTML!' : 'Copy Meta Tags'}
          </button>
        </div>

        <pre className="p-4 rounded-xl bg-dark-card border border-slate-800 text-slate-200 font-mono text-xs whitespace-pre-wrap leading-relaxed overflow-x-auto">
          {generateHtml()}
        </pre>
      </div>
    </div>
  );
}
