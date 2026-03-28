/**
 * Storage abstraction module.
 * Selects between S3 and Cloudinary providers based on the STORAGE_TYPE env var.
 */

export interface StorageProvider {
  upload(buffer: Buffer, filename: string, mimeType: string): Promise<string>;
}

// ---------------------------------------------------------------------------
// S3 stub — returns a URL in the standard S3 path-style format
// ---------------------------------------------------------------------------
class S3Provider implements StorageProvider {
  private bucket: string;
  private region: string;

  constructor() {
    this.bucket = process.env.AWS_BUCKET_NAME ?? 'my-bucket';
    this.region = process.env.AWS_REGION ?? 'us-east-1';
  }

  async upload(_buffer: Buffer, filename: string, _mimeType: string): Promise<string> {
    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${filename}`;
  }
}

// ---------------------------------------------------------------------------
// Cloudinary stub — parses the cloud name from CLOUDINARY_URL and returns
// a URL in the standard Cloudinary delivery format
// ---------------------------------------------------------------------------
class CloudinaryProvider implements StorageProvider {
  private cloudName: string;

  constructor() {
    // CLOUDINARY_URL format: cloudinary://api_key:api_secret@cloud_name
    const url = process.env.CLOUDINARY_URL ?? '';
    const match = url.match(/@([^/]+)$/);
    this.cloudName = match ? match[1] : 'my-cloud';
  }

  async upload(_buffer: Buffer, filename: string, _mimeType: string): Promise<string> {
    return `https://res.cloudinary.com/${this.cloudName}/image/upload/${filename}`;
  }
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------
export function getStorageProvider(): StorageProvider {
  const storageType = (process.env.STORAGE_TYPE ?? 's3').toLowerCase();

  if (storageType === 'cloudinary') {
    return new CloudinaryProvider();
  }

  return new S3Provider();
}
