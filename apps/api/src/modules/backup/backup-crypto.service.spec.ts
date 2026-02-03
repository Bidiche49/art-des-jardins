import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import {
  BackupCryptoService,
  BACKUP_CRYPTO_VERSION,
  IV_LENGTH,
  AUTH_TAG_LENGTH,
  HEADER_LENGTH,
} from './backup-crypto.service';

describe('BackupCryptoService', () => {
  const TEST_ENCRYPTION_KEY = 'test-encryption-key-at-least-16-chars';

  describe('with encryption key configured', () => {
    let service: BackupCryptoService;

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          BackupCryptoService,
          {
            provide: ConfigService,
            useValue: {
              get: jest.fn((key: string) => {
                if (key === 'BACKUP_ENCRYPTION_KEY') {
                  return TEST_ENCRYPTION_KEY;
                }
                return undefined;
              }),
            },
          },
        ],
      }).compile();

      service = module.get<BackupCryptoService>(BackupCryptoService);
    });

    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should report as configured', () => {
      expect(service.isConfigured()).toBe(true);
    });

    describe('encryptBuffer', () => {
      it('should encrypt a buffer', async () => {
        const input = Buffer.from('Hello, this is a test backup content!');
        const encrypted = await service.encryptBuffer(input);

        expect(encrypted).toBeDefined();
        expect(encrypted.length).toBeGreaterThan(HEADER_LENGTH + AUTH_TAG_LENGTH);

        // Check version header
        const version = encrypted.readUInt32BE(0);
        expect(version).toBe(BACKUP_CRYPTO_VERSION);
      });

      it('should produce different output for same input (due to random IV)', async () => {
        const input = Buffer.from('Same content');

        const encrypted1 = await service.encryptBuffer(input);
        const encrypted2 = await service.encryptBuffer(input);

        // IVs should be different
        const iv1 = encrypted1.subarray(4, HEADER_LENGTH);
        const iv2 = encrypted2.subarray(4, HEADER_LENGTH);
        expect(iv1.equals(iv2)).toBe(false);
      });

      it('should compress before encrypting (output smaller than repeated input)', async () => {
        // Create highly compressible content
        const input = Buffer.from('A'.repeat(10000));
        const encrypted = await service.encryptBuffer(input);

        // Compressed + encrypted should be smaller than original
        expect(encrypted.length).toBeLessThan(input.length);
      });
    });

    describe('decryptBuffer', () => {
      it('should decrypt an encrypted buffer', async () => {
        const original = Buffer.from('Test backup data for encryption roundtrip');
        const encrypted = await service.encryptBuffer(original);
        const decrypted = await service.decryptBuffer(encrypted);

        expect(decrypted.toString()).toBe(original.toString());
      });

      it('should handle large data', async () => {
        // Create 1MB of data
        const original = Buffer.alloc(1024 * 1024, 'X');
        const encrypted = await service.encryptBuffer(original);
        const decrypted = await service.decryptBuffer(encrypted);

        expect(decrypted.equals(original)).toBe(true);
      });

      it('should handle binary data', async () => {
        // Create buffer with all byte values
        const original = Buffer.alloc(256);
        for (let i = 0; i < 256; i++) {
          original[i] = i;
        }

        const encrypted = await service.encryptBuffer(original);
        const decrypted = await service.decryptBuffer(encrypted);

        expect(decrypted.equals(original)).toBe(true);
      });

      it('should fail with invalid data (too small)', async () => {
        const invalid = Buffer.alloc(10);

        await expect(service.decryptBuffer(invalid)).rejects.toThrow(
          'Invalid encrypted backup: too small',
        );
      });

      it('should fail with wrong version', async () => {
        const original = Buffer.from('test');
        const encrypted = await service.encryptBuffer(original);

        // Modify version to invalid value
        encrypted.writeUInt32BE(99, 0);

        await expect(service.decryptBuffer(encrypted)).rejects.toThrow(
          'Unsupported backup version: 99',
        );
      });

      it('should fail with corrupted data (auth tag mismatch)', async () => {
        const original = Buffer.from('test data');
        const encrypted = await service.encryptBuffer(original);

        // Corrupt the encrypted data (not the header or auth tag)
        encrypted[HEADER_LENGTH + 1] ^= 0xff;

        await expect(service.decryptBuffer(encrypted)).rejects.toThrow(
          'Decryption failed: invalid key or corrupted data',
        );
      });

      it('should fail with corrupted auth tag', async () => {
        const original = Buffer.from('test data');
        const encrypted = await service.encryptBuffer(original);

        // Corrupt the auth tag (last 16 bytes)
        encrypted[encrypted.length - 1] ^= 0xff;

        await expect(service.decryptBuffer(encrypted)).rejects.toThrow(
          'Decryption failed: invalid key or corrupted data',
        );
      });
    });

    describe('getEncryptedBackupInfo', () => {
      it('should return info for valid encrypted backup', async () => {
        const original = Buffer.from('test');
        const encrypted = await service.encryptBuffer(original);

        const info = service.getEncryptedBackupInfo(encrypted);

        expect(info.version).toBe(BACKUP_CRYPTO_VERSION);
        expect(info.isValid).toBe(true);
        expect(info.encryptedSize).toBe(encrypted.length);
        expect(info.ivHex).toHaveLength(IV_LENGTH * 2); // hex encoding
      });

      it('should return invalid for too-small buffer', () => {
        const invalid = Buffer.alloc(10);

        const info = service.getEncryptedBackupInfo(invalid);

        expect(info.isValid).toBe(false);
        expect(info.version).toBe(0);
      });

      it('should return invalid for wrong version', async () => {
        const original = Buffer.from('test');
        const encrypted = await service.encryptBuffer(original);
        encrypted.writeUInt32BE(99, 0);

        const info = service.getEncryptedBackupInfo(encrypted);

        expect(info.isValid).toBe(false);
        expect(info.version).toBe(99);
      });
    });
  });

  describe('without encryption key', () => {
    let service: BackupCryptoService;

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          BackupCryptoService,
          {
            provide: ConfigService,
            useValue: {
              get: jest.fn(() => undefined),
            },
          },
        ],
      }).compile();

      service = module.get<BackupCryptoService>(BackupCryptoService);
    });

    it('should report as not configured', () => {
      expect(service.isConfigured()).toBe(false);
    });

    it('should throw error when trying to encrypt', async () => {
      const input = Buffer.from('test');

      await expect(service.encryptBuffer(input)).rejects.toThrow(
        'Backup encryption key not configured',
      );
    });

    it('should throw error when trying to decrypt', async () => {
      const input = Buffer.alloc(100);

      await expect(service.decryptBuffer(input)).rejects.toThrow(
        'Backup encryption key not configured',
      );
    });
  });

  describe('with empty encryption key', () => {
    let service: BackupCryptoService;

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          BackupCryptoService,
          {
            provide: ConfigService,
            useValue: {
              get: jest.fn((key: string) => {
                if (key === 'BACKUP_ENCRYPTION_KEY') {
                  return '';
                }
                return undefined;
              }),
            },
          },
        ],
      }).compile();

      service = module.get<BackupCryptoService>(BackupCryptoService);
    });

    it('should report as not configured', () => {
      expect(service.isConfigured()).toBe(false);
    });
  });

  describe('key derivation', () => {
    it('should produce same ciphertext with same key', async () => {
      // Create two services with the same key
      const createService = async (key: string) => {
        const module: TestingModule = await Test.createTestingModule({
          providers: [
            BackupCryptoService,
            {
              provide: ConfigService,
              useValue: {
                get: jest.fn((k: string) =>
                  k === 'BACKUP_ENCRYPTION_KEY' ? key : undefined,
                ),
              },
            },
          ],
        }).compile();
        return module.get<BackupCryptoService>(BackupCryptoService);
      };

      const service1 = await createService(TEST_ENCRYPTION_KEY);
      const service2 = await createService(TEST_ENCRYPTION_KEY);

      const original = Buffer.from('test data');
      const encrypted = await service1.encryptBuffer(original);
      const decrypted = await service2.decryptBuffer(encrypted);

      expect(decrypted.toString()).toBe(original.toString());
    });

    it('should fail to decrypt with different key', async () => {
      const createService = async (key: string) => {
        const module: TestingModule = await Test.createTestingModule({
          providers: [
            BackupCryptoService,
            {
              provide: ConfigService,
              useValue: {
                get: jest.fn((k: string) =>
                  k === 'BACKUP_ENCRYPTION_KEY' ? key : undefined,
                ),
              },
            },
          ],
        }).compile();
        return module.get<BackupCryptoService>(BackupCryptoService);
      };

      const service1 = await createService('key-one-at-least-16-chars');
      const service2 = await createService('key-two-at-least-16-chars');

      const original = Buffer.from('test data');
      const encrypted = await service1.encryptBuffer(original);

      await expect(service2.decryptBuffer(encrypted)).rejects.toThrow(
        'Decryption failed: invalid key or corrupted data',
      );
    });
  });
});
