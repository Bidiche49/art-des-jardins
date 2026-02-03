import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { StorageService } from '../storage/storage.service';
import { CreatePhotoDto, PhotoResponseDto } from './dto';
import { PhotoType } from '@art-et-jardin/database';
import { v4 as uuidv4 } from 'uuid';

// Try to import sharp for image dimension extraction
let sharp: typeof import('sharp') | undefined;
try {
  sharp = require('sharp');
} catch {
  // sharp not available - dimensions will be 0
}

@Injectable()
export class PhotosService {
  private readonly logger = new Logger(PhotosService.name);

  private readonly allowedImageMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/heic',
    'image/heif',
  ];
  private readonly maxFileSize = 10 * 1024 * 1024; // 10MB

  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
  ) {}

  async uploadPhoto(
    interventionId: string,
    file: Express.Multer.File,
    dto: CreatePhotoDto,
    userId: string,
  ): Promise<PhotoResponseDto> {
    // Validate intervention exists
    const intervention = await this.prisma.intervention.findUnique({
      where: { id: interventionId },
    });

    if (!intervention) {
      throw new NotFoundException(`Intervention ${interventionId} not found`);
    }

    // Validate file
    this.validateFile(file);

    // Get image dimensions using sharp (if available)
    let width = 0;
    let height = 0;
    if (sharp) {
      try {
        const metadata = await sharp(file.buffer).metadata();
        width = metadata.width || 0;
        height = metadata.height || 0;
      } catch (error) {
        this.logger.warn(`Could not read image dimensions: ${(error as Error).message}`);
      }
    }

    // Generate unique filename
    const ext = file.originalname.split('.').pop() || 'jpg';
    const photoId = uuidv4();
    const s3Key = `photos/interventions/${interventionId}/${photoId}.${ext}`;

    // Upload to S3
    await this.storageService.uploadBuffer(file.buffer, s3Key, file.mimetype, {
      acl: 'private',
    });

    // Create database record
    const photo = await this.prisma.photo.create({
      data: {
        id: photoId,
        interventionId,
        type: dto.type,
        filename: file.originalname,
        s3Key,
        mimeType: file.mimetype,
        size: file.size,
        width,
        height,
        latitude: dto.latitude,
        longitude: dto.longitude,
        takenAt: new Date(dto.takenAt),
        uploadedBy: userId,
      },
    });

    this.logger.log(
      `Photo uploaded: ${photo.id} for intervention ${interventionId} by user ${userId}`,
    );

    return this.toResponseDto(photo);
  }

  async getPhotosByIntervention(
    interventionId: string,
  ): Promise<PhotoResponseDto[]> {
    // Validate intervention exists
    const intervention = await this.prisma.intervention.findUnique({
      where: { id: interventionId },
    });

    if (!intervention) {
      throw new NotFoundException(`Intervention ${interventionId} not found`);
    }

    const photos = await this.prisma.photo.findMany({
      where: { interventionId },
      orderBy: [{ type: 'asc' }, { takenAt: 'asc' }],
    });

    return photos.map((photo) => this.toResponseDto(photo));
  }

  async getPhotoById(id: string): Promise<PhotoResponseDto> {
    const photo = await this.prisma.photo.findUnique({
      where: { id },
    });

    if (!photo) {
      throw new NotFoundException(`Photo ${id} not found`);
    }

    return this.toResponseDto(photo);
  }

  async deletePhoto(id: string, userId: string): Promise<void> {
    const photo = await this.prisma.photo.findUnique({
      where: { id },
    });

    if (!photo) {
      throw new NotFoundException(`Photo ${id} not found`);
    }

    // Delete from S3
    try {
      await this.storageService.delete(photo.s3Key);
    } catch (error) {
      this.logger.warn(
        `Failed to delete S3 object ${photo.s3Key}: ${(error as Error).message}`,
      );
    }

    // Delete from database
    await this.prisma.photo.delete({
      where: { id },
    });

    this.logger.log(`Photo deleted: ${id} by user ${userId}`);
  }

  async getPhotosByType(
    interventionId: string,
    type: PhotoType,
  ): Promise<PhotoResponseDto[]> {
    const photos = await this.prisma.photo.findMany({
      where: { interventionId, type },
      orderBy: { takenAt: 'asc' },
    });

    return photos.map((photo) => this.toResponseDto(photo));
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

    if (!this.allowedImageMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type. Allowed types: ${this.allowedImageMimeTypes.join(', ')}`,
      );
    }
  }

  private toResponseDto(
    photo: {
      id: string;
      interventionId: string;
      type: PhotoType;
      filename: string;
      s3Key: string;
      mimeType: string;
      size: number;
      width: number;
      height: number;
      latitude: number | null;
      longitude: number | null;
      takenAt: Date;
      uploadedAt: Date;
      uploadedBy: string;
    },
  ): PhotoResponseDto {
    return {
      id: photo.id,
      interventionId: photo.interventionId,
      type: photo.type,
      filename: photo.filename,
      url: this.storageService.isConfigured()
        ? `${this.getEndpoint()}/${this.storageService.getBucket()}/${photo.s3Key}`
        : '',
      mimeType: photo.mimeType,
      size: photo.size,
      width: photo.width,
      height: photo.height,
      latitude: photo.latitude ?? undefined,
      longitude: photo.longitude ?? undefined,
      takenAt: photo.takenAt,
      uploadedAt: photo.uploadedAt,
      uploadedBy: photo.uploadedBy,
    };
  }

  private getEndpoint(): string {
    // Use storage service endpoint if available
    // This is a simplified approach - in production you might want to use presigned URLs
    return process.env.S3_ENDPOINT || '';
  }
}
