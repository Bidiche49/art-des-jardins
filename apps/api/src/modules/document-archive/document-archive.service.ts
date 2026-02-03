import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';
import { PrismaService } from '../../database/prisma.service';
import { StorageService } from '../storage/storage.service';
import { DocumentType } from '@art-et-jardin/database';

export interface ArchiveDocumentOptions {
  documentType: DocumentType;
  documentId: string;
  documentNumero: string;
  pdfBuffer: Buffer;
  metadata?: Record<string, unknown>;
}

export interface ArchiveResult {
  id: string;
  s3Key: string;
  fileName: string;
  fileSize: number;
  checksum: string;
}

@Injectable()
export class DocumentArchiveService {
  private readonly logger = new Logger(DocumentArchiveService.name);
  private readonly archiveBucket: string;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    private storage: StorageService,
  ) {
    this.archiveBucket = this.configService.get('ARCHIVE_BUCKET') || 'art-et-jardin-archives';
  }

  /**
   * Archive un PDF sur S3 et enregistre les metadonnees
   */
  async archiveDocument(options: ArchiveDocumentOptions): Promise<ArchiveResult> {
    const { documentType, documentId, documentNumero, pdfBuffer, metadata } = options;

    // Calculer le checksum MD5 pour verification d'integrite
    const checksum = createHash('md5').update(pdfBuffer).digest('hex');

    // Generer la cle S3 avec structure hierarchique
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const fileName = `${documentType}-${documentNumero}.pdf`;
    const s3Key = `${documentType}/${year}/${month}/${documentId}/${fileName}`;

    // Verifier si deja archive (meme checksum)
    const existing = await this.prisma.documentArchive.findFirst({
      where: {
        documentType,
        documentId,
        checksum,
      },
    });

    if (existing) {
      this.logger.debug(`Document ${documentNumero} already archived with same checksum`);
      return {
        id: existing.id,
        s3Key: existing.s3Key,
        fileName: existing.fileName,
        fileSize: existing.fileSize,
        checksum: existing.checksum || checksum,
      };
    }

    try {
      // Upload vers S3
      const uploadResult = await this.storage.uploadBuffer(
        pdfBuffer,
        s3Key,
        'application/pdf',
        { bucket: this.archiveBucket, acl: 'private' },
      );

      // Enregistrer dans la base
      const archive = await this.prisma.documentArchive.create({
        data: {
          documentType,
          documentId,
          documentNumero,
          s3Key,
          s3Bucket: this.archiveBucket,
          fileName,
          fileSize: uploadResult.size,
          mimeType: 'application/pdf',
          checksum,
          metadata: metadata as object,
        },
      });

      this.logger.log(`Document archived: ${documentNumero} -> ${s3Key}`);

      return {
        id: archive.id,
        s3Key,
        fileName,
        fileSize: uploadResult.size,
        checksum,
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to archive ${documentNumero}: ${err.message}`);
      throw error;
    }
  }

  /**
   * Recuperer un document archive
   */
  async getArchivedDocument(documentType: DocumentType, documentId: string): Promise<unknown> {
    const archive = await this.prisma.documentArchive.findFirst({
      where: { documentType, documentId },
      orderBy: { archivedAt: 'desc' },
    });

    if (!archive) {
      return null;
    }

    // Telecharger depuis S3
    const buffer = await this.storage.downloadBuffer(archive.s3Key, archive.s3Bucket);

    return {
      ...archive,
      buffer,
    };
  }

  /**
   * Lister les archives d'un document
   */
  async getDocumentArchives(documentType: DocumentType, documentId: string): Promise<unknown[]> {
    return this.prisma.documentArchive.findMany({
      where: { documentType, documentId },
      orderBy: { archivedAt: 'desc' },
    });
  }

  /**
   * Rechercher dans les archives
   */
  async searchArchives(options: {
    documentType?: DocumentType;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }): Promise<unknown[]> {
    const { documentType, startDate, endDate, limit = 50 } = options;

    return this.prisma.documentArchive.findMany({
      where: {
        ...(documentType && { documentType }),
        ...(startDate && { archivedAt: { gte: startDate } }),
        ...(endDate && { archivedAt: { lte: endDate } }),
      },
      orderBy: { archivedAt: 'desc' },
      take: limit,
    });
  }

  /**
   * Statistiques des archives
   */
  async getArchiveStats() {
    const [total, byType, totalSize] = await Promise.all([
      this.prisma.documentArchive.count(),
      this.prisma.documentArchive.groupBy({
        by: ['documentType'],
        _count: true,
      }),
      this.prisma.documentArchive.aggregate({
        _sum: { fileSize: true },
      }),
    ]);

    return {
      total,
      byType: byType.reduce(
        (acc, item) => ({ ...acc, [item.documentType]: item._count }),
        {},
      ),
      totalSizeBytes: totalSize._sum.fileSize || 0,
      totalSizeMB: ((totalSize._sum.fileSize || 0) / 1024 / 1024).toFixed(2),
    };
  }

  /**
   * Verifier l'integrite d'une archive
   */
  async verifyArchiveIntegrity(archiveId: string): Promise<boolean> {
    const archive = await this.prisma.documentArchive.findUnique({
      where: { id: archiveId },
    });

    if (!archive || !archive.checksum) {
      return false;
    }

    try {
      const buffer = await this.storage.downloadBuffer(archive.s3Key, archive.s3Bucket);
      const currentChecksum = createHash('md5').update(buffer).digest('hex');
      return currentChecksum === archive.checksum;
    } catch (error) {
      this.logger.error(`Integrity check failed for ${archiveId}`);
      return false;
    }
  }
}
