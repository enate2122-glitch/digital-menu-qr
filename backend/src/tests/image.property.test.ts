// Feature: digital-menu-qr-system, Property 15: non-permitted MIME binary always returns 422
// Feature: digital-menu-qr-system, Property 16: files > 5 MB always return 413

/**
 * Validates: Requirements 7.1, 7.2
 *
 * P15: For any non-permitted MIME binary, image upload returns 422 regardless of
 *      file extension or declared content-type.
 * P16: For any file > 5 MB, image upload returns 413.
 */

import * as fc from 'fast-check';
import { detectMimeType, uploadImage, MAX_FILE_SIZE } from '../services/image.service';

// Mock storage so no real network calls are made
jest.mock('../storage', () => ({
  getStorageProvider: () => ({
    upload: async (_buf: Buffer, filename: string, _mime: string) =>
      `https://example.com/${filename}`,
  }),
}));

// ---------------------------------------------------------------------------
// Helpers to build valid magic-byte headers
// ---------------------------------------------------------------------------
const JPEG_HEADER = Buffer.from([0xff, 0xd8, 0xff, 0xe0]);
const PNG_HEADER = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const WEBP_HEADER = Buffer.from([
  0x52, 0x49, 0x46, 0x46, // RIFF
  0x00, 0x00, 0x00, 0x00, // file size (ignored)
  0x57, 0x45, 0x42, 0x50, // WEBP
]);

const VALID_HEADERS = [JPEG_HEADER, PNG_HEADER, WEBP_HEADER];

/**
 * Arbitrary that generates a buffer whose first bytes do NOT match any
 * permitted magic-byte signature.
 */
const nonPermittedBuffer = fc
  .uint8Array({ minLength: 12, maxLength: 64 })
  .map((arr) => Buffer.from(arr))
  .filter((buf) => detectMimeType(buf) === null);

// ---------------------------------------------------------------------------
// P15: non-permitted MIME binary always returns 422
// ---------------------------------------------------------------------------
describe('P15: non-permitted MIME binary always returns 422', () => {
  it('uploadImage should throw status 422 for any non-permitted binary', async () => {
    await fc.assert(
      fc.asyncProperty(nonPermittedBuffer, async (buf) => {
        let threw = false;
        try {
          await uploadImage(buf);
        } catch (err: any) {
          threw = true;
          expect(err.status).toBe(422);
        }
        expect(threw).toBe(true);
      }),
      { numRuns: 100 }
    );
  });
});

// ---------------------------------------------------------------------------
// P16: files > 5 MB always return 413
// ---------------------------------------------------------------------------
describe('P16: files > 5 MB always return 413', () => {
  it('uploadImage should throw status 413 for any file exceeding 5 MB', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Pick a valid header so we don't accidentally hit 422 first
        fc.constantFrom(...VALID_HEADERS),
        // Extra bytes beyond the 5 MB limit: 1 byte to 512 KB over
        fc.integer({ min: 1, max: 512 * 1024 }),
        async (header, extraBytes) => {
          const oversize = MAX_FILE_SIZE + extraBytes;
          const buf = Buffer.alloc(oversize);
          header.copy(buf, 0);

          let threw = false;
          try {
            await uploadImage(buf);
          } catch (err: any) {
            threw = true;
            expect(err.status).toBe(413);
          }
          expect(threw).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });
});
