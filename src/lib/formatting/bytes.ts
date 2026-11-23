/**
 * Format bytes into human-readable string (KB, MB, GB)
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';
  if (bytes < 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Calculates percentage savings between original and compressed sizes
 */
export function calculateSavings(originalSize: number, newSize: number): {
  savedBytes: number;
  percent: number;
  isSmaller: boolean;
} {
  const savedBytes = originalSize - newSize;
  if (originalSize <= 0) {
    return { savedBytes: 0, percent: 0, isSmaller: false };
  }
  const percent = Math.round((savedBytes / originalSize) * 100);
  return {
    savedBytes,
    percent: Math.max(0, percent),
    isSmaller: newSize < originalSize,
  };
}
