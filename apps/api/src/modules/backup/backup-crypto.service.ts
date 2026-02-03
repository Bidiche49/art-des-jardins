import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  createHash,
} from 'crypto';
import { createGzip, createGunzip } from 'zlib';

/**
 * Format du fichier chiffre:
 * [4 bytes: version] [12 bytes: IV] [N bytes: encrypted(gzipped data)] [16 bytes: auth tag]
 *
 * - Version 1: AES-256-GCM avec IV 12 bytes et auth tag 16 bytes
 * - Les donnees sont compressees avec gzip AVANT chiffrement
 * - L'auth tag assure l'integrite des donnees
 */
export const BACKUP_CRYPTO_VERSION = 1;
export const IV_LENGTH = 12;
export const AUTH_TAG_LENGTH = 16;
export const HEADER_LENGTH = 4 + IV_LENGTH; // version + IV

@Injectable()
export class BackupCryptoService implements OnModuleInit {
  private readonly logger = new Logger(BackupCryptoService.name);
  private encryptionKey: Buffer | null = null;
  private readonly isEnabled: boolean;

  constructor(private configService: ConfigService) {
    const keyString = this.configService.get<string>('BACKUP_ENCRYPTION_KEY');
    this.isEnabled = !!keyString && keyString.length > 0;

    if (keyString) {
      // Derive a 32-byte key from the provided key using SHA-256
      this.encryptionKey = createHash('sha256').update(keyString).digest();
    }
  }

  onModuleInit() {
    if (this.isEnabled) {
      this.logger.log('Backup encryption enabled (AES-256-GCM)');
    } else {
      this.logger.warn(
        'Backup encryption disabled - set BACKUP_ENCRYPTION_KEY to enable',
      );
    }
  }

  /**
   * Verifie si le chiffrement est configure et active
   */
  isConfigured(): boolean {
    return this.isEnabled && this.encryptionKey !== null;
  }

  /**
   * Compresse et chiffre un buffer
   * Format: [4 bytes version][12 bytes IV][encrypted data][16 bytes auth tag]
   */
  async encryptBuffer(input: Buffer): Promise<Buffer> {
    if (!this.encryptionKey) {
      throw new Error('Backup encryption key not configured');
    }

    // Compress first
    const compressed = await this.compressBuffer(input);

    // Generate random IV
    const iv = randomBytes(IV_LENGTH);

    // Create cipher
    const cipher = createCipheriv('aes-256-gcm', this.encryptionKey, iv);

    // Encrypt
    const encrypted = Buffer.concat([
      cipher.update(compressed),
      cipher.final(),
    ]);

    // Get auth tag
    const authTag = cipher.getAuthTag();

    // Build header
    const header = Buffer.alloc(HEADER_LENGTH);
    header.writeUInt32BE(BACKUP_CRYPTO_VERSION, 0);
    iv.copy(header, 4);

    // Combine: header + encrypted + authTag
    return Buffer.concat([header, encrypted, authTag]);
  }

  /**
   * Dechiffre et decompresse un buffer
   */
  async decryptBuffer(input: Buffer): Promise<Buffer> {
    if (!this.encryptionKey) {
      throw new Error('Backup encryption key not configured');
    }

    // Validate minimum size
    if (input.length < HEADER_LENGTH + AUTH_TAG_LENGTH) {
      throw new Error('Invalid encrypted backup: too small');
    }

    // Read version
    const version = input.readUInt32BE(0);
    if (version !== BACKUP_CRYPTO_VERSION) {
      throw new Error(`Unsupported backup version: ${version}`);
    }

    // Extract IV
    const iv = input.subarray(4, HEADER_LENGTH);

    // Extract auth tag (last 16 bytes)
    const authTag = input.subarray(input.length - AUTH_TAG_LENGTH);

    // Extract encrypted data
    const encryptedData = input.subarray(
      HEADER_LENGTH,
      input.length - AUTH_TAG_LENGTH,
    );

    // Create decipher
    const decipher = createDecipheriv('aes-256-gcm', this.encryptionKey, iv);
    decipher.setAuthTag(authTag);

    // Decrypt
    let decrypted: Buffer;
    try {
      decrypted = Buffer.concat([
        decipher.update(encryptedData),
        decipher.final(),
      ]);
    } catch (error) {
      throw new Error(
        'Decryption failed: invalid key or corrupted data (auth tag mismatch)',
      );
    }

    // Decompress
    return this.decompressBuffer(decrypted);
  }

  /**
   * Compresse un buffer avec gzip (niveau 9)
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
   * Decompresse un buffer gzip
   */
  private async decompressBuffer(input: Buffer): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      const gunzip = createGunzip();

      gunzip.on('data', (chunk) => chunks.push(chunk));
      gunzip.on('end', () => resolve(Buffer.concat(chunks)));
      gunzip.on('error', reject);

      gunzip.write(input);
      gunzip.end();
    });
  }

  /**
   * Verifie l'integrite d'un backup chiffre sans le dechiffrer completement
   * Retourne les metadonnees du fichier
   */
  getEncryptedBackupInfo(input: Buffer): {
    version: number;
    isValid: boolean;
    encryptedSize: number;
    ivHex: string;
  } {
    if (input.length < HEADER_LENGTH + AUTH_TAG_LENGTH) {
      return {
        version: 0,
        isValid: false,
        encryptedSize: input.length,
        ivHex: '',
      };
    }

    const version = input.readUInt32BE(0);
    const iv = input.subarray(4, HEADER_LENGTH);

    return {
      version,
      isValid: version === BACKUP_CRYPTO_VERSION,
      encryptedSize: input.length,
      ivHex: iv.toString('hex'),
    };
  }
}
