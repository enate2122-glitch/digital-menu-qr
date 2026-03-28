import { v4 as uuidv4 } from 'uuid';
import { getStorageProvider } from '../storage';

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export type AllowedMimeType = 'image/jpeg' | 'image/png' | 'image/webp';

/**
 * Detect MIME type from binary magic bytes.
 * Returns the MIME type string or null if not a permitted type.
 */
export function detectMimeType(buffer: Buffer): AllowedMimeType | null {
  if (buffer.length < 4) return null;

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return 'image/jpeg';
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A (8 bytes)
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return 'image/png';
  }

  // WebP: RIFF????WEBP (bytes 0-3 = 52 49 46 46, bytes 8-11 = 57 45 42 50)
  if (
    buffer.length >= 12 &&
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return 'image/webp';
  }

  return null;
}

/**
 * Upload an image buffer to object storage.
 * Validates MIME via magic bytes and enforces 5 MB size limit.
 * Returns the permanent URL.
 */
export async function uploadImage(buffer: Buffer): Promise<string> {
  if (buffer.length > MAX_FILE_SIZE) {
    const err: any = new Error('File exceeds the 5 MB size limit.');
    err.status = 413;
    throw err;
  }

  const mimeType = detectMimeType(buffer);
  if (!mimeType) {
    const err: any = new Error('Unsupported image format. Only JPEG, PNG, and WebP are allowed.');
    err.status = 422;
    throw err;
  }

  const ext = mimeType === 'image/jpeg' ? 'jpg' : mimeType === 'image/png' ? 'png' : 'webp';
  const filename = `${uuidv4()}.${ext}`;

  const storage = getStorageProvider();
  const url = await storage.upload(buffer, filename, mimeType);
  return url;
}
