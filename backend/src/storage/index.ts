import { v2 as cloudinary } from 'cloudinary';

export interface StorageProvider {
  upload(buffer: Buffer, filename: string, mimeType: string): Promise<string>;
}

class CloudinaryProvider implements StorageProvider {
  constructor() {
    // CLOUDINARY_URL format: cloudinary://api_key:api_secret@cloud_name
    const url = process.env.CLOUDINARY_URL ?? '';
    const match = url.match(/cloudinary:\/\/(\d+):([^@]+)@(.+)/);
    if (match) {
      cloudinary.config({
        api_key: match[1],
        api_secret: match[2],
        cloud_name: match[3],
      });
    }
  }

  async upload(buffer: Buffer, filename: string, mimeType: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const folder = 'digital-menu';
      const publicId = `${folder}/${filename.replace(/\.[^.]+$/, '')}`;

      cloudinary.uploader.upload_stream(
        { public_id: publicId, resource_type: 'image', format: mimeType.split('/')[1] },
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
