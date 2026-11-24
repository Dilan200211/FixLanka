import React, { useState } from 'react';
import { Music, Download, RefreshCw, CheckCircle2, Volume2 } from 'lucide-react';
import FileDropzone from '../../components/file-upload/FileDropzone';
import { formatBytes } from '../../lib/formatting/bytes';
import { downloadBlob } from '../../lib/download/download';
import { audioBufferToWav } from '../../lib/media/wav-encoder';

export default function AudioExtractor() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [extracting, setExtracting] = useState<boolean>(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioDetails, setAudioDetails] = useState<{
    duration: number;
    sampleRate: number;
    channels: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    setSelectedFile(file);
    setError(null);
    setAudioBlob(null);
    setAudioUrl(null);
    setExtracting(true);

    try {
      const buffer = await file.arrayBuffer();
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      if (audioCtx.state === 'suspended') {
        await audioCtx.resume().catch(() => {});
      }

      // Native Web Audio API decodes audio track from container directly
      const decodedBuffer = await audioCtx.decodeAudioData(buffer);
      if (!decodedBuffer || decodedBuffer.length === 0) {
        throw new Error('Empty audio stream');
      }

      const wavBlob = audioBufferToWav(decodedBuffer);
      const url = URL.createObjectURL(wavBlob);

      setAudioBlob(wavBlob);
      setAudioUrl(url);
      setAudioDetails({
        duration: decodedBuffer.duration,
        sampleRate: decodedBuffer.sampleRate,
        channels: decodedBuffer.numberOfChannels,
      });

      await audioCtx.close().catch(() => {});
    } catch (err: any) {
      console.error('Audio extraction error:', err);
      setError('Could not decode an audio track from this file. Make sure it contains a browser-supported audio stream (AAC, MP3, Opus, Vorbis, or PCM) and is not a silent video.');
    } finally {
      setExtracting(false);
    }
  };

  const handleDownload = () => {
    if (!audioBlob || !selectedFile) return;
    const name = `${selectedFile.name.replace(/\.[^/.]+$/, '')}_audio.wav`;
    downloadBlob(audioBlob, name);
  };

  const handleReset = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setSelectedFile(null);
    setAudioBlob(null);
    setAudioUrl(null);
    setAudioDetails(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      {!selectedFile ? (
        <FileDropzone
          accept="video/mp4,video/webm,video/quicktime,video/x-matroska,audio/*"
          maxSize={104857600} // 100 MB
          onFilesSelected={handleFilesSelected}
          helpText="Select MP4, WebM, MOV video or audio file to extract/convert to WAV (up to 100 MB)"
        />
      ) : (
        <div className="space-y-6">
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-dark-surface border border-dark-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
                <Music className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-dark-text truncate max-w-xs">{selectedFile.name}</p>
                <p className="text-xs text-dark-secondary">{formatBytes(selectedFile.size)} • Video Container</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-dark-raised hover:bg-dark-raised text-dark-secondary transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Choose Different Video
            </button>
          </div>

          {extracting && (
            <div className="p-10 text-center text-dark-secondary">
              <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-sm font-medium">Decoding audio stream with Web Audio API...</p>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
              {error}
            </div>
          )}

          {/* Extracted Audio Results */}
          {audioBlob && audioUrl && audioDetails && (
            <div className="p-6 rounded-xl bg-emerald-950/20 border border-brand-500/30 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-dark-text flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 dark:text-brand-400" /> Audio Track Extracted
                  </h4>
                  <p className="text-xs text-dark-secondary mt-0.5">
                    Duration: {audioDetails.duration.toFixed(1)}s • Sample Rate: {audioDetails.sampleRate} Hz •{' '}
                    {audioDetails.channels === 2 ? 'Stereo' : 'Mono'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleDownload}
                  className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs transition-colors flex items-center gap-2 shadow"
                >
                  <Download className="w-4 h-4" /> Download WAV Audio ({formatBytes(audioBlob.size)})
                </button>
              </div>

              {/* Built-in Audio Player */}
              <div className="p-4 rounded-xl bg-black/40 border border-dark-border flex items-center gap-3">
                <Volume2 className="w-5 h-5 text-brand-600 dark:text-brand-400 flex-shrink-0" />
                <audio src={audioUrl} controls className="w-full h-9" />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
