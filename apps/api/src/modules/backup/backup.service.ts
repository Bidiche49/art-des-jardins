import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { execSync } from 'child_process';
import { createGzip } from 'zlib';
import { promisify } from 'util';
import { pipeline } from 'stream';
import { PrismaService } from '../../database/prisma.service';
import { StorageService } from '../storage/storage.service';
import { BackupCryptoService } from './backup-crypto.service';

const pipelineAsync = promisify(pipeline);

@Injectable()
export class BackupService implements OnModuleInit {
  private readonly logger = new Logger(BackupService.name);
  private readonly databaseUrl: string;
  private readonly backupBucket: string;
  private readonly backupEnabled: boolean;
  private readonly retentionDays: number;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    private storage: StorageService,
    private backupCrypto: BackupCryptoService,
  ) {
    this.databaseUrl = this.configService.get('DATABASE_URL') || '';
    this.backupBucket = this.configService.get('BACKUP_BUCKET') || 'art-et-jardin-backups';
    this.backupEnabled = this.configService.get('BACKUP_ENABLED') === 'true';
    this.retentionDays = parseInt(this.configService.get('BACKUP_RETENTION_DAYS') || '30', 10);
  }

  onModuleInit() {
    if (this.backupEnabled && this.storage.isConfigured()) {
      const encryptionStatus = this.backupCrypto.isConfigured()
        ? 'encrypted (AES-256-GCM)'
        : 'NOT encrypted';
      this.logger.log(
        `Backup service enabled - daily at 02:00, retention: ${this.retentionDays} days, ${encryptionStatus}`,
      );
    } else {
      this.logger.warn('Backup service disabled - enable with BACKUP_ENABLED=true');
    }
  }

  /**
   * Cron job: backup quotidien a 2h du matin
   */
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async handleDailyBackup() {
    if (!this.backupEnabled) {
      return;
    }

    this.logger.log('Starting daily database backup...');
    await this.createBackup();
  }

  /**
   * Creer un backup manuellement
   */
  async createBackup(): Promise<{
    fileName: string;
    s3Key: string;
    size: number;
    encrypted: boolean;
  }> {
    const startTime = Date.now();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const isEncrypted = this.backupCrypto.isConfigured();
    const extension = isEncrypted ? '.sql.gz.enc' : '.sql.gz';
    const fileName = `backup-${timestamp}${extension}`;
    const s3Key = `backups/${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}/${fileName}`;

    try {
      // Execute pg_dump
      this.logger.debug('Executing pg_dump...');
      const dumpOutput = execSync(`pg_dump "${this.databaseUrl}" --no-owner --no-acl`, {
        maxBuffer: 100 * 1024 * 1024, // 100MB buffer
        encoding: 'buffer',
      });

      let outputBuffer: Buffer;

      if (isEncrypted) {
        // Compress and encrypt (BackupCryptoService handles both)
        this.logger.debug('Compressing and encrypting backup...');
        outputBuffer = await this.backupCrypto.encryptBuffer(dumpOutput);
      } else {
        // Compress only
        this.logger.debug('Compressing backup...');
        outputBuffer = await this.compressBuffer(dumpOutput);
      }

      // Upload to S3
      this.logger.debug(`Uploading to S3: ${s3Key}`);
      const contentType = isEncrypted
        ? 'application/octet-stream'
        : 'application/gzip';
      const result = await this.storage.uploadBuffer(
        outputBuffer,
        s3Key,
        contentType,
        { bucket: this.backupBucket, acl: 'private' },
      );

      const durationMs = Date.now() - startTime;

      // Log in backup history
      await this.prisma.backupHistory.create({
        data: {
          fileName,
          s3Key,
          s3Bucket: this.backupBucket,
          fileSize: result.size,
          durationMs,
          status: 'success',
        },
      });

      const encryptionMsg = isEncrypted ? ' (encrypted)' : '';
      this.logger.log(
        `Backup completed: ${fileName} (${(result.size / 1024 / 1024).toFixed(2)} MB)${encryptionMsg} in ${durationMs}ms`,
      );

      // Cleanup old backups
      await this.cleanupOldBackups();

      return { fileName, s3Key, size: result.size, encrypted: isEncrypted };
    } catch (error) {
      const err = error as Error;
      const durationMs = Date.now() - startTime;

      // Log failure
      await this.prisma.backupHistory.create({
        data: {
          fileName,
          s3Key,
          s3Bucket: this.backupBucket,
          fileSize: 0,
          durationMs,
          status: 'failed',
          errorMessage: err.message,
        },
      });

      this.logger.error(`Backup failed: ${err.message}`, err.stack);
      throw error;
    }
  }

  /**
   * Compresser un buffer avec gzip
   */
  private async compressBuffer(input: Buffer): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      const gzip = createGzip({ level: 9 });

      gzip.on('data', (chunk) => chunks.push(chunk));
      gzip.on('end', () => resolve(Buffer.concat(chunks)));
      gzip.on('error', reject);

      gzip.write(input);
      gzip.end();
    });
  }

  /**
   * Supprimer les backups plus vieux que retentionDays
   */
  private async cleanupOldBackups(): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.retentionDays);

    const oldBackups = await this.prisma.backupHistory.findMany({
      where: {
        createdAt: { lt: cutoffDate },
        status: 'success',
      },
    });

    for (const backup of oldBackups) {
      try {
        // Note: S3 deletion should be implemented if needed
        // await this.storage.delete(backup.s3Key, backup.s3Bucket);

        await this.prisma.backupHistory.delete({
          where: { id: backup.id },
        });

        this.logger.debug(`Cleaned up old backup: ${backup.fileName}`);
      } catch (error) {
        this.logger.warn(`Failed to cleanup backup ${backup.fileName}`);
      }
    }

    if (oldBackups.length > 0) {
      this.logger.log(`Cleaned up ${oldBackups.length} old backup(s)`);
    }
  }

  /**
   * Recuperer l'historique des backups
   */
  async getBackupHistory(limit = 30) {
    return this.prisma.backupHistory.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  /**
   * Recuperer le dernier backup reussi
   */
  async getLastSuccessfulBackup() {
    return this.prisma.backupHistory.findFirst({
      where: { status: 'success' },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Statistiques des backups
   */
  async getBackupStats() {
    const [total, successful, failed, lastBackup] = await Promise.all([
      this.prisma.backupHistory.count(),
      this.prisma.backupHistory.count({ where: { status: 'success' } }),
      this.prisma.backupHistory.count({ where: { status: 'failed' } }),
      this.getLastSuccessfulBackup(),
    ]);

    const totalSize = await this.prisma.backupHistory.aggregate({
      where: { status: 'success' },
      _sum: { fileSize: true },
    });

    return {
      total,
      successful,
      failed,
      totalSizeBytes: totalSize._sum.fileSize || 0,
      lastBackupAt: lastBackup?.createdAt || null,
      retentionDays: this.retentionDays,
      encryptionEnabled: this.backupCrypto.isConfigured(),
    };
  }

  /**
   * Dechiffrer un backup chiffre
   * Retourne le contenu SQL brut
   */
  async decryptBackup(encryptedBuffer: Buffer): Promise<Buffer> {
    if (!this.backupCrypto.isConfigured()) {
      throw new Error('Backup decryption not available: encryption key not configured');
    }

    return this.backupCrypto.decryptBuffer(encryptedBuffer);
  }

  /**
   * Verifier si le chiffrement est active
   */
  isEncryptionEnabled(): boolean {
    return this.backupCrypto.isConfigured();
  }
}
