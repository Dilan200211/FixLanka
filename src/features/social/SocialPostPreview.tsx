import React, { useState } from 'react';
import { Eye, Image as ImageIcon, Info, Heart, MessageCircle, Repeat2, Share, ThumbsUp } from 'lucide-react';

type Platform = 'twitter' | 'linkedin' | 'facebook' | 'instagram';

const PLATFORM_LIMITS: Record<Platform, { name: string; maxChars: number; color: string }> = {
  twitter: { name: 'Twitter / X', maxChars: 280, color: '#1da1f2' },
  linkedin: { name: 'LinkedIn', maxChars: 3000, color: '#0a66c2' },
  facebook: { name: 'Facebook', maxChars: 63206, color: '#1877f2' },
  instagram: { name: 'Instagram', maxChars: 2200, color: '#e1306c' },
};

export default function SocialPostPreview() {
  const [platform, setPlatform] = useState<Platform>('twitter');
  const [displayName, setDisplayName] = useState<string>('Alex Rivera');
  const [handle, setHandle] = useState<string>('alexrivera');
  const [postText, setPostText] = useState<string>(
    'Testing our new browser-based utility tools on FixLanka Tools! 🚀 Local memory processing means zero server uploads and total file privacy. What tools would you like to see next?'
  );
  const [attachedImage, setAttachedImage] = useState<string | null>(null);

  const limitInfo = PLATFORM_LIMITS[platform];
  const charCount = postText.length;
  const isOverLimit = charCount > limitInfo.maxChars;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAttachedImage(url);
  };

  return (
    <div className="space-y-6 text-xs">
      {/* Platform Switcher Tabs */}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(PLATFORM_LIMITS) as Platform[]).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPlatform(p)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              platform === p
                ? 'bg-brand-600 text-white shadow'
                : 'bg-dark-surface border border-dark-border text-dark-secondary hover:border-brand-500/40'
            }`}
          >
            {PLATFORM_LIMITS[p].name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Editor */}
        <div className="p-5 rounded-xl bg-dark-surface border border-dark-border space-y-4">
          <h2 className="font-bold text-dark-text uppercase tracking-wider text-xs">Post Details</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-dark-secondary font-medium mb-1">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-lg text-dark-text"
              />
            </div>

            <div>
              <label className="block text-dark-secondary font-medium mb-1">Handle / Username</label>
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-lg text-dark-text"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between font-medium text-dark-secondary mb-1">
              <span>Post Caption / Text</span>
              <span className={`font-mono ${isOverLimit ? 'text-rose-400 font-bold' : 'text-dark-secondary'}`}>
                {charCount} / {limitInfo.maxChars} chars
              </span>
            </div>
            <textarea
              rows={6}
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder="Write your post here..."
              className="w-full px-3.5 py-2.5 bg-dark-card border border-dark-border rounded-lg text-dark-text placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            />
          </div>

          <div>
            <label className="block text-dark-secondary font-medium mb-1.5">Attach Media (Optional)</label>
            <div className="flex items-center gap-3">
              <label className="px-3 py-2 rounded-lg bg-dark-card border border-dark-border hover:border-brand-500/40 text-dark-secondary cursor-pointer transition-colors flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" /> Choose Image
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>

              {attachedImage && (
                <button
                  type="button"
                  onClick={() => setAttachedImage(null)}
                  className="text-rose-400 hover:underline"
                >
                  Remove Attachment
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Live Simulation Card */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-dark-secondary font-medium">
            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-brand-600 dark:text-brand-400" /> Simulated Feed Preview
            </span>
            <span className="text-[11px] text-dark-muted">Visual approximation</span>
          </div>

          {/* Twitter / X Replica */}
          {platform === 'twitter' && (
            <div className="p-4 rounded-xl border border-dark-border bg-[#000000] text-dark-text shadow-xl max-w-md mx-auto">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-dark-raised border border-dark-border flex items-center justify-center font-bold text-dark-text flex-shrink-0">
                  {displayName.substring(0, 1)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm truncate">{displayName}</span>
                    <span className="text-dark-muted text-xs truncate">@{handle}</span>
                    <span className="text-dark-muted text-xs">· 1m</span>
                  </div>

                  <p className="mt-1 text-sm whitespace-pre-wrap leading-relaxed text-dark-text">{postText}</p>

                  {attachedImage && (
                    <div className="mt-3 rounded-2xl overflow-hidden border border-dark-border max-h-60 bg-black">
                      <img src={attachedImage} alt="Post Attachment" className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-4 text-dark-muted max-w-xs text-xs">
                    <span className="flex items-center gap-1 hover:text-blue-400 cursor-pointer">
                      <MessageCircle className="w-3.5 h-3.5" /> 12
                    </span>
                    <span className="flex items-center gap-1 hover:text-brand-600 dark:text-brand-400 cursor-pointer">
                      <Repeat2 className="w-3.5 h-3.5" /> 5
                    </span>
                    <span className="flex items-center gap-1 hover:text-rose-400 cursor-pointer">
                      <Heart className="w-3.5 h-3.5" /> 48
                    </span>
                    <span className="flex items-center gap-1 hover:text-blue-400 cursor-pointer">
                      <Share className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* LinkedIn Replica */}
          {platform === 'linkedin' && (
            <div className="p-4 rounded-xl border border-dark-border bg-[#1b1f23] text-dark-text shadow-xl max-w-md mx-auto space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center font-bold text-white flex-shrink-0">
                  {displayName.substring(0, 1)}
                </div>
                <div>
                  <p className="font-bold text-sm text-dark-text">{displayName}</p>
                  <p className="text-[11px] text-dark-secondary">Founder & Engineer • 1st</p>
                  <p className="text-[10px] text-dark-muted">Just now • 🌐</p>
                </div>
              </div>

              <p className="text-sm whitespace-pre-wrap leading-relaxed text-dark-text">{postText}</p>

              {attachedImage && (
                <div className="rounded-lg overflow-hidden border border-dark-border max-h-60">
                  <img src={attachedImage} alt="Post Attachment" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="pt-2 border-t border-dark-border flex items-center justify-around text-dark-secondary text-xs">
                <span className="flex items-center gap-1 hover:text-blue-400 cursor-pointer">
                  <ThumbsUp className="w-3.5 h-3.5" /> Like
                </span>
                <span className="flex items-center gap-1 hover:text-blue-400 cursor-pointer">
                  <MessageCircle className="w-3.5 h-3.5" /> Comment
                </span>
                <span className="flex items-center gap-1 hover:text-blue-400 cursor-pointer">
                  <Repeat2 className="w-3.5 h-3.5" /> Repost
                </span>
              </div>
            </div>
          )}

          {/* Facebook Replica */}
          {platform === 'facebook' && (
            <div className="p-4 rounded-xl border border-dark-border bg-[#242526] text-dark-text shadow-xl max-w-md mx-auto space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white flex-shrink-0">
                  {displayName.substring(0, 1)}
                </div>
                <div>
                  <p className="font-bold text-sm text-dark-text">{displayName}</p>
                  <p className="text-[11px] text-dark-secondary">Just now • 👥</p>
                </div>
              </div>

              <p className="text-sm whitespace-pre-wrap leading-relaxed text-dark-text">{postText}</p>

              {attachedImage && (
                <div className="rounded-lg overflow-hidden border border-dark-border max-h-60">
                  <img src={attachedImage} alt="Post Attachment" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          )}

          {/* Instagram Replica */}
          {platform === 'instagram' && (
            <div className="p-4 rounded-xl border border-dark-border bg-[#121212] text-dark-text shadow-xl max-w-md mx-auto space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-purple-600 p-[2px]">
                  <div className="w-full h-full rounded-full bg-black flex items-center justify-center font-bold text-dark-text text-[10px]">
                    {displayName.substring(0, 1)}
                  </div>
                </div>
                <span className="font-bold text-xs">{handle}</span>
              </div>

              {attachedImage ? (
                <div className="rounded-lg overflow-hidden border border-dark-border aspect-square bg-black">
                  <img src={attachedImage} alt="Post Attachment" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="p-8 text-center bg-dark-surface rounded-lg border border-dark-border text-dark-muted text-xs">
                  Attach an image to preview Instagram feed appearance
                </div>
              )}

              <p className="text-xs text-dark-text">
                <strong className="mr-1.5">{handle}</strong>
                {postText}
              </p>
            </div>
          )}

          <div className="p-3 rounded-lg bg-dark-surface border border-dark-border flex items-center gap-2 text-[11px] text-dark-secondary">
            <Info className="w-3.5 h-3.5 flex-shrink-0" />
            <span>This simulator renders an approximation based on current platform UI standards.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
