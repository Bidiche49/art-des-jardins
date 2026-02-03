import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadBucketCommand,
} from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

export interface UploadResult {
  key: string;
  url: string;
  bucket: string;
  size: number;
  mimeType: string;
}

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly s3Client: S3Client | null;
  private readonly bucket: string;
  private readonly endpoint: string;
  private readonly region: string;

  private readonly allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
  ];
  private readonly maxFileSize = 10 * 1024 * 1024; // 10MB

  constructor(private configService: ConfigService) {
    this.endpoint = this.configService.get('S3_ENDPOINT') || '';
    this.bucket = this.configService.get('S3_BUCKET') || 'art-et-jardin';
    this.region = this.configService.get('S3_REGION') || 'fr-par';

    const accessKey = this.configService.get('S3_ACCESS_KEY');
    const secretKey = this.configService.get('S3_SECRET_KEY');

    if (this.endpoint && accessKey && secretKey) {
      this.s3Client = new S3Client({
        endpoint: this.endpoint,
        region: this.region,
        credentials: {
          accessKeyId: accessKey,
          secretAccessKey: secretKey,
        },
        forcePathStyle: true, // Required for MinIO and some S3-compatible services
      });
      this.logger.log(`S3 client initialized with endpoint: ${this.endpoint}`);
    } else {
      this.s3Client = null;
      this.logger.warn('S3 client not configured - uploads will be disabled');
    }
  }

  async upload(
    file: Express.Multer.File,
    folder: string = 'uploads',
  ): Promise<UploadResult> {
    if (!this.s3Client) {
      throw new BadRequestException('Storage service not configured');
    }

    // Validate file
    this.validateFile(file);

    // Generate unique key
    const ext = file.originalname.split('.').pop() || 'bin';
    const key = `${folder}/${uuidv4()}.${ext}`;

    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
          ACL: 'public-read',
        }),
      );

      const url = `${this.endpoint}/${this.bucket}/${key}`;

      this.logger.log(`File uploaded: ${key} (${file.size} bytes)`);

      return {
        key,
        url,
        bucket: this.bucket,
        size: file.size,
        mimeType: file.mimetype,
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Upload failed: ${err.message}`, err.stack);
      throw new BadRequestException('Failed to upload file');
    }
  }

  async delete(key: string): Promise<void> {
    if (!this.s3Client) {
      throw new BadRequestException('Storage service not configured');
    }

    try {
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: key,
        }),
      );

      this.logger.log(`File deleted: ${key}`);
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Delete failed: ${err.message}`, err.stack);
      throw new BadRequestException('Failed to delete file');
    }
  }

  async getSignedUrl(key: string): Promise<string> {
    // For public buckets, just return the direct URL
    return `${this.endpoint}/${this.bucket}/${key}`;
  }

  /**
   * Upload a buffer directly (for backups, PDFs, etc.)
   */
  async uploadBuffer(
    buffer: Buffer,
    key: string,
    contentType: string,
    options?: { bucket?: string; acl?: string },
  ): Promise<UploadResult> {
    if (!this.s3Client) {
      throw new BadRequestException('Storage service not configured');
    }

    const bucket = options?.bucket || this.bucket;
    const acl = options?.acl || 'private';

    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: buffer,
          ContentType: contentType,
          ACL: acl as any,
        }),
      );

      const url = `${this.endpoint}/${bucket}/${key}`;

      this.logger.log(`Buffer uploaded: ${key} (${buffer.length} bytes) to ${bucket}`);

      return {
        key,
        url,
        bucket,
        size: buffer.length,
        mimeType: contentType,
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Buffer upload failed: ${err.message}`, err.stack);
      throw new BadRequestException('Failed to upload buffer');
    }
  }

  /**
   * Download a file as buffer
   */
  async downloadBuffer(key: string, bucket?: string): Promise<Buffer> {
    if (!this.s3Client) {
      throw new BadRequestException('Storage service not configured');
    }

    try {
      const response = await this.s3Client.send(
        new GetObjectCommand({
          Bucket: bucket || this.bucket,
          Key: key,
        }),
      );

      const chunks: Buffer[] = [];
      const stream = response.Body as NodeJS.ReadableStream;

      for await (const chunk of stream) {
        chunks.push(Buffer.from(chunk));
      }

      return Buffer.concat(chunks);
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Download failed: ${err.message}`, err.stack);
      throw new BadRequestException('Failed to download file');
    }
  }

  getBucket(): string {
    return this.bucket;
  }

  isConfigured(): boolean {
    return this.s3Client !== null;
  }

  /**
   * Check S3 connection by checking if bucket exists
   */
  async checkConnection(): Promise<void> {
    if (!this.s3Client) {
      throw new Error('Storage service not configured');
    }

    await this.s3Client.send(
      new HeadBucketCommand({
        Bucket: this.bucket,
      }),
    );
  }

  private validateFile(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (file.size > this.maxFileSize) {
      throw new BadRequestException(
        `File too large. Maximum size is ${this.maxFileSize / 1024 / 1024}MB`,
      );
    }

    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type. Allowed types: ${this.allowedMimeTypes.join(', ')}`,
      );
    }
  }
}
