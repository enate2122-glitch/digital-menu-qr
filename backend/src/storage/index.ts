import { v2 as cloudinary } from 'cloudinary';

export interface StorageProvider {
  upload(buffer: Buffer, filename: string, mimeType: string): Promise<string>;
}

class CloudinaryProvider implements StorageProvider {
  constructor() {
    // Cloudinary SDK auto-reads CLOUDINARY_URL from environment
    cloudinary.config({ secure: true });
  }

  async upload(buffer: Buffer, _filename: string, _mimeType: string): Promise<string> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'digital-menu', resource_type: 'image' },
        (error, result) => {
          if (error || !result) return reject(error ?? new Error('Upload failed'));
          resolve(result.secure_url);
        }
      ).end(buffer);
    });
  }
}

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

export function getStorageProvider(): StorageProvider {
  const storageType = (process.env.STORAGE_TYPE ?? 's3').toLowerCase();
  if (storageType === 'cloudinary') return new CloudinaryProvider();
  return new S3Provider();
}
