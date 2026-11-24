import React, { useState, useRef } from 'react';
import { Film, Download, RefreshCw, Sliders, AlertTriangle } from 'lucide-react';
import FileDropzone from '../../components/file-upload/FileDropzone';
import { formatBytes } from '../../lib/formatting/bytes';
import { downloadBlob } from '../../lib/download/download';
import { encodeGif, type GifFrame } from '../../lib/media/gif-encoder';

export default function VideoToGif() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(0);

  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(3);
  const [fps, setFps] = useState<number>(10);
  const [targetWidth, setTargetWidth] = useState<number>(400);

  const [progress, setProgress] = useState<number>(0);
  const [processing, setProcessing] = useState<boolean>(false);
  const [gifBlob, setGifBlob] = useState<Blob | null>(null);
  const [gifPreviewUrl, setGifPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    setSelectedFile(file);
    setError(null);
    setGifBlob(null);

    const url = URL.createObjectURL(file);
    setVideoUrl(url);
  };

  const onVideoLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const dur = e.currentTarget.duration || 0;
    setDuration(dur);
    setStartTime(0);
    setEndTime(Math.min(dur, 4)); // Default segment up to 4s
  };

  const seekToTime = (video: HTMLVideoElement, targetTime: number): Promise<void> => {
    return new Promise((resolve) => {
      const clamped = Math.max(0, Math.min(targetTime, video.duration || targetTime));
      if (Math.abs(video.currentTime - clamped) < 0.001 && video.readyState >= 2) {
        resolve();
        return;
      }

      let finished = false;
      const done = () => {
        if (finished) return;
        finished = true;
        video.removeEventListener('seeked', done);
        clearTimeout(timer);
        resolve();
      };

      const timer = setTimeout(done, 1500);
      video.addEventListener('seeked', done);
      video.currentTime = clamped;
    });
  };

  const handleGenerateGif = async () => {
    if (!videoUrl || !videoRef.current) return;
    const video = videoRef.current;

    if (video.readyState < 2) {
      setError('Video is still loading. Please wait a second and try again.');
      return;
    }

    const segmentDuration = Math.max(0.2, endTime - startTime);
    const totalFrames = Math.min(180, Math.max(2, Math.round(segmentDuration * fps)));
    const frameDelayMs = 1000 / fps;

    setProcessing(true);
    setProgress(0);
    setError(null);

    try {
      const canvas = document.createElement('canvas');
      const aspect = (video.videoHeight || 300) / (video.videoWidth || 400);
      const width = targetWidth;
      const height = Math.max(1, Math.round(width * aspect));
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) throw new Error('Could not initialize canvas context');

      const frames: GifFrame[] = [];

      for (let i = 0; i < totalFrames; i++) {
        const time = startTime + (i / fps);
        await seekToTime(video, time);

        ctx.drawImage(video, 0, 0, width, height);
        const imgData = ctx.getImageData(0, 0, width, height);
        frames.push({
          imageData: imgData,
          delayMs: frameDelayMs,
        });

        setProgress(Math.round(((i + 1) / totalFrames) * 50));
      }

      // Encode frames into GIF89a
      const blob = await encodeGif(frames, width, height, (p) => {
        setProgress(50 + Math.round(p * 0.5));
      });

      if (gifPreviewUrl) URL.revokeObjectURL(gifPreviewUrl);
      const gifUrl = URL.createObjectURL(blob);
      setGifBlob(blob);
      setGifPreviewUrl(gifUrl);
    } catch (err: any) {
      console.error('GIF generation error:', err);
      setError('Could not process video. Try selecting a shorter segment or lower resolution.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!gifBlob || !selectedFile) return;
    const name = `${selectedFile.name.replace(/\.[^/.]+$/, '')}.gif`;
    downloadBlob(gifBlob, name);
  };

  const handleReset = () => {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    if (gifPreviewUrl) URL.revokeObjectURL(gifPreviewUrl);
    setSelectedFile(null);
    setVideoUrl(null);
    setGifBlob(null);
    setGifPreviewUrl(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      {!selectedFile ? (
        <FileDropzone
          accept="video/mp4,video/webm,video/quicktime"
          maxSize={104857600} // 100 MB
          onFilesSelected={handleFilesSelected}
          helpText="Select MP4, WebM, or MOV video to convert to animated GIF (up to 100 MB)"
        />
      ) : (
        <div className="space-y-6">
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-dark-surface border border-dark-border">
            <div>
              <p className="text-sm font-semibold text-dark-text truncate max-w-xs">{selectedFile.name}</p>
              <p className="text-xs text-dark-secondary">
                Duration: {duration.toFixed(1)}s • {formatBytes(selectedFile.size)}
              </p>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-dark-raised hover:bg-dark-raised text-dark-secondary transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Choose Different Video
            </button>
          </div>

          {/* Hidden/Embedded Video Element for Frame Seeking */}
          <div className="rounded-xl overflow-hidden border border-dark-border bg-black/40 p-2 max-w-md mx-auto">
            <video
              ref={videoRef}
              src={videoUrl || undefined}
              controls
              muted
              playsInline
              preload="auto"
              onLoadedMetadata={onVideoLoadedMetadata}
              className="w-full max-h-60 rounded"
            />
          </div>

          {/* Configuration Controls */}
          <div className="p-5 rounded-xl bg-dark-surface border border-dark-border space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-dark-secondary font-medium mb-1">
                  Start Time: <span className="font-mono text-brand-600 dark:text-brand-400">{startTime.toFixed(1)}s</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max={Math.max(0, duration - 0.5)}
                  step="0.1"
                  value={startTime}
                  onChange={(e) => {
                    const nextStart = parseFloat(e.target.value);
                    setStartTime(nextStart);
                    if (endTime <= nextStart + 0.2) {
                      setEndTime(Math.min(duration || 10, nextStart + 0.5));
                    }
                  }}
                  className="w-full accent-brand-600 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-dark-secondary font-medium mb-1">
                  End Time: <span className="font-mono text-brand-600 dark:text-brand-400">{endTime.toFixed(1)}s</span> (Length:{' '}
                  {(endTime - startTime).toFixed(1)}s)
                </label>
                <input
                  type="range"
                  min={startTime + 0.2}
                  max={duration || 10}
                  step="0.1"
                  value={endTime}
                  onChange={(e) => setEndTime(parseFloat(e.target.value))}
                  className="w-full accent-brand-600 cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-dark-border">
              <div>
                <label className="block text-dark-secondary font-medium mb-1">Frame Rate (FPS)</label>
                <select
                  value={fps}
                  onChange={(e) => setFps(parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-lg text-dark-text"
                >
                  <option value={5}>5 FPS (Ultra compact)</option>
                  <option value={10}>10 FPS (Balanced, recommended)</option>
                  <option value={15}>15 FPS (Smooth playback)</option>
                </select>
              </div>

              <div>
                <label className="block text-dark-secondary font-medium mb-1">Output Width</label>
                <select
                  value={targetWidth}
                  onChange={(e) => setTargetWidth(parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-lg text-dark-text"
                >
                  <option value={320}>320 px (Small / Discord)</option>
                  <option value={400}>400 px (Standard)</option>
                  <option value={540}>540 px (High-definition)</option>
                </select>
              </div>
            </div>

            <button
              type="button"
              disabled={processing || endTime <= startTime}
              onClick={handleGenerateGif}
              className="w-full py-3 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold transition-all shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 mt-2"
            >
              {processing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Extracting & Encoding Frames ({progress}%)...
                </>
              ) : (
                <>
                  <Film className="w-4 h-4" /> Convert Segment to Animated GIF
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
              {error}
            </div>
          )}

          {/* Results Output */}
          {gifBlob && gifPreviewUrl && (
            <div className="p-6 rounded-xl bg-emerald-950/20 border border-brand-500/30 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-dark-text">Animated GIF Created!</h4>
                  <p className="text-xs text-dark-secondary mt-0.5">
                    GIF Size: {formatBytes(gifBlob.size)} • {fps} FPS • {targetWidth}px wide
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleDownload}
                  className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs transition-colors flex items-center gap-2 shadow"
                >
                  <Download className="w-4 h-4" /> Download GIF
                </button>
              </div>

              <div className="flex justify-center p-3 bg-black/40 rounded-xl border border-dark-border">
                <img src={gifPreviewUrl} alt="Generated GIF" className="max-h-72 rounded object-contain" />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
