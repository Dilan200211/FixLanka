import React, { useState } from 'react';
import exifr from 'exifr';
import { Fingerprint, ShieldCheck, AlertCircle, Info, RefreshCw, Cpu, CheckCircle2 } from 'lucide-react';
import FileDropzone from '../../components/file-upload/FileDropzone';
import { formatBytes } from '../../lib/formatting/bytes';
import type { C2PAValidationStatus } from '../../types/metadata';

interface AiInspectionReport {
  status: C2PAValidationStatus;
  statusLabel: string;
  hasC2paBox: boolean;
  aiSoftwareDetected?: string[];
  iptcDigitalSource?: string;
  embeddedPrompt?: string;
  modelParameters?: string;
  assertions: Array<{ title: string; value: string }>;
  limitationsNotice: string;
}

export default function AiMetadataInspector() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<AiInspectionReport | null>(null);

  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    setSelectedFile(file);

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setLoading(true);

    try {
      // 1. Check for JUMBF / C2PA binary signatures in file chunks
      const buffer = await file.slice(0, Math.min(file.size, 2 * 1024 * 1024)).arrayBuffer();
      const bytes = new Uint8Array(buffer);
      let foundC2paBox = false;

      // Scan for ASCII "c2pa" or "jumb"
      for (let i = 0; i < bytes.length - 4; i++) {
        if (
          (bytes[i] === 0x63 && bytes[i + 1] === 0x32 && bytes[i + 2] === 0x70 && bytes[i + 3] === 0x61) ||
          (bytes[i] === 0x6a && bytes[i + 1] === 0x75 && bytes[i + 2] === 0x6d && bytes[i + 3] === 0x62)
        ) {
          foundC2paBox = true;
          break;
        }
      }

      // 2. Parse EXIF, XMP, IPTC with exifr
      const data = await exifr.parse(file, {
        xmp: true,
        iptc: true,
        tiff: true,
        reviveValues: true,
      });

      const aiSoftware: string[] = [];
      let embeddedPrompt = '';
      let modelParams = '';
      let digitalSourceType = '';
      const assertions: Array<{ title: string; value: string }> = [];

      if (data) {
        const software = (data.Software || '').toLowerCase();
        const make = (data.Make || '').toLowerCase();
        const model = (data.Model || '').toLowerCase();
        const comment = (data.UserComment || data.ImageDescription || '').toString();

        // Check common generative AI keywords
        if (software.includes('midjourney') || comment.includes('midjourney')) aiSoftware.push('Midjourney');
        if (software.includes('dall-e') || software.includes('dalle') || comment.includes('dall-e')) aiSoftware.push('DALL-E');
        if (software.includes('stable diffusion') || comment.includes('steps: ') || comment.includes('sampler:')) {
          aiSoftware.push('Stable Diffusion / ComfyUI / AUTOMATIC1111');
          modelParams = comment.slice(0, 300);
        }
        if (software.includes('firefly') || software.includes('adobe sensei')) aiSoftware.push('Adobe Firefly');
        if (software.includes('flux') || comment.includes('flux')) aiSoftware.push('FLUX Model');

        // Check IPTC / XMP DigitalSourceType
        if (data.digitalSourceType) {
          digitalSourceType = data.digitalSourceType.toString();
        } else if (data['iptc:digitalSourceType']) {
          digitalSourceType = data['iptc:digitalSourceType'].toString();
        }

        if (comment && comment.length > 5) {
          embeddedPrompt = comment.slice(0, 500);
        }

        if (data.Software) assertions.push({ title: 'Software Tag', value: data.Software.toString() });
        if (data.Artist || data.Creator) assertions.push({ title: 'Creator / Artist', value: (data.Artist || data.Creator).toString() });
        if (data.Copyright) assertions.push({ title: 'Copyright Assertion', value: data.Copyright.toString() });
      }

      // Determine status
      let status: C2PAValidationStatus = 'no-credentials-detected';
      let statusLabel = 'No Supported AI Metadata Detected';

      if (foundC2paBox) {
        status = 'credentials-detected';
        statusLabel = 'C2PA Content Credentials Detected';
        assertions.unshift({ title: 'C2PA Manifest Box', value: 'JUMBF Claim Container Present' });
      } else if (aiSoftware.length > 0 || digitalSourceType.includes('trainedAlgorithmicMedia')) {
        status = 'present-unverified';
        statusLabel = 'Generative AI Metadata Tag Present';
      }

      setReport({
        status,
        statusLabel,
        hasC2paBox: foundC2paBox,
        aiSoftwareDetected: aiSoftware,
        iptcDigitalSource: digitalSourceType,
        embeddedPrompt,
        modelParameters: modelParams,
        assertions,
        limitationsNotice:
          'Detection is based strictly on observable metadata tags and standard JUMBF containers. Note: The absence of AI markers does NOT prove an image was captured by a human, as metadata can easily be stripped by editing tools or messaging platforms.',
      });
    } catch (err) {
      console.error('Inspection failed:', err);
      setReport({
        status: 'inspection-failed',
        statusLabel: 'Inspection Incomplete or File Format Unsupported',
        hasC2paBox: false,
        assertions: [],
        limitationsNotice: 'Could not complete binary parsing for this specific format.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
    setReport(null);
  };

  return (
    <div className="space-y-6">
      {!selectedFile ? (
        <FileDropzone
          accept="image/jpeg,image/png,image/webp,image/tiff"
          maxSize={52428800} // 50MB
          onFilesSelected={handleFilesSelected}
          helpText="Inspect images for C2PA Content Credentials and AI tags (up to 50 MB)"
        />
      ) : (
        <div className="space-y-6">
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-dark-surface border border-dark-border">
            <div className="flex items-center gap-3">
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Inspection Subject"
                  className="w-12 h-12 object-cover rounded-lg border border-slate-700"
                />
              )}
              <div>
                <p className="text-sm font-semibold text-white truncate max-w-xs">{selectedFile.name}</p>
                <p className="text-xs text-slate-400">{formatBytes(selectedFile.size)} • {selectedFile.type || 'image'}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Inspect Another Image
            </button>
          </div>

          {loading && (
            <div className="p-12 text-center text-slate-400">
              <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-sm font-medium">Scanning for C2PA Manifests and AI Indicators...</p>
            </div>
          )}

          {report && (
            <div className="space-y-5">
              {/* Primary Status Banner */}
              <div className={`p-5 rounded-xl border flex items-start gap-3.5 ${
                report.hasC2paBox
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                  : report.aiSoftwareDetected && report.aiSoftwareDetected.length > 0
                  ? 'bg-purple-950/20 border-purple-500/40 text-purple-300'
                  : 'bg-dark-surface border-dark-border text-slate-300'
              }`}>
                {report.hasC2paBox ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <Fingerprint className="w-6 h-6 text-slate-400 flex-shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white">{report.statusLabel}</h3>
                  <p className="text-xs leading-relaxed text-slate-400">
                    {report.hasC2paBox
                      ? 'This file carries standard Coalition for Content Provenance and Authenticity (C2PA) cryptographic assertions.'
                      : report.aiSoftwareDetected && report.aiSoftwareDetected.length > 0
                      ? `Metadata references generative AI signatures: ${report.aiSoftwareDetected.join(', ')}.`
                      : 'No C2PA manifest boxes or generative AI tags were detected in the accessible image headers.'}
                  </p>
                </div>
              </div>

              {/* Detailed Evidence Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* AI Generator Tags */}
                <div className="p-5 rounded-xl bg-dark-surface border border-dark-border space-y-3">
                  <h4 className="font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-purple-400" /> Generative AI Signatures
                  </h4>
                  {report.aiSoftwareDetected && report.aiSoftwareDetected.length > 0 ? (
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1.5">
                        {report.aiSoftwareDetected.map((tool) => (
                          <span key={tool} className="px-2.5 py-1 rounded-md bg-purple-500/20 border border-purple-500/30 text-purple-300 font-semibold">
                            {tool}
                          </span>
                        ))}
                      </div>
                      {report.modelParameters && (
                        <div className="mt-2 p-2.5 rounded bg-dark-card border border-slate-800 text-[11px] font-mono text-slate-400 break-all">
                          {report.modelParameters}
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-slate-500 py-3">No generator keywords found in metadata.</p>
                  )}
                </div>

                {/* Assertions & Provenance */}
                <div className="p-5 rounded-xl bg-dark-surface border border-dark-border space-y-3">
                  <h4 className="font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> Header Assertions
                  </h4>
                  {report.assertions.length > 0 ? (
                    <dl className="divide-y divide-slate-800">
                      {report.assertions.map((assertion, idx) => (
                        <div key={idx} className="py-2 flex justify-between gap-2">
                          <dt className="text-slate-400">{assertion.title}</dt>
                          <dd className="font-medium text-slate-100 text-right truncate max-w-[200px]">{assertion.value}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : (
                    <p className="text-slate-500 py-3">No header assertions recorded.</p>
                  )}
                </div>
              </div>

              {/* Transparent Evidence & Limitation Disclosure */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3 text-xs text-slate-400">
                <Info className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">{report.limitationsNotice}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
