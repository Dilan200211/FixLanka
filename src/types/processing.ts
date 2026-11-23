export type ProcessingStatus =
  | 'idle'
  | 'validating'
  | 'loading'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled';

export interface ProcessingState<T = unknown> {
  status: ProcessingStatus;
  progress: number; // 0 - 100
  message?: string;
  error?: string;
  result?: T;
  startTime?: number;
  endTime?: number;
}

export interface ProcessedOutput {
  id: string;
  name: string;
  blob: Blob;
  url: string;
  size: number;
  originalSize: number;
  mimeType: string;
  dimensions?: { width: number; height: number };
}
