export interface FileSignature {
  description: string;
  mimeType: string;
  extension: string;
  magicBytes: number[];
  offset?: number;
}

export interface ValidatedFile {
  file: File;
  name: string;
  size: number;
  type: string;
  extension: string;
  isValidSignature: boolean;
  detectedMimeType?: string;
  error?: string;
  previewUrl?: string;
}

export interface FileValidationResult {
  valid: boolean;
  error?: string;
  detectedType?: string;
}
