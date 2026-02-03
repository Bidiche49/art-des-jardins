import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { generateSecret, generate, verify, generateURI } from 'otplib';
import * as QRCode from 'qrcode';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { PrismaService } from '../../database/prisma.service';
import { AuditService } from '../audit/audit.service';

const ENCRYPTION_ALGORITHM = 'aes-256-gcm';
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const RECOVERY_CODE_COUNT = 10;

@Injectable()
export class TwoFactorService {
  private encryptionKey: Buffer;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private auditService: AuditService,
  ) {
    const key = this.configService.get<string>('TWO_FACTOR_ENCRYPTION_KEY');
    if (key) {
      this.encryptionKey = crypto.scryptSync(key, 'salt', 32);
    } else {
      this.encryptionKey = crypto.scryptSync('dev-2fa-key-change-in-production', 'salt', 32);
    }
  }

  async setup2FA(userId: string): Promise<{ qrCode: string; secret: string; otpauthUrl: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, twoFactorEnabled: true },
    });

    if (!user) {
      throw new BadRequestException('Utilisateur non trouvé');
    }

    if (user.twoFactorEnabled) {
      throw new BadRequestException('2FA déjà activé. Désactivez-le d\'abord pour le reconfigurer.');
    }

    const secret = generateSecret();
    const otpauthUrl = generateURI({
      issuer: 'Art & Jardin',
      label: user.email,
      secret,
    });
    const qrCode = await QRCode.toDataURL(otpauthUrl);

    // Store encrypted secret (not yet enabled)
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorSecret: this.encrypt(secret),
        twoFactorEnabled: false,
        recoveryCodes: [],
      },
    });

    return { qrCode, secret, otpauthUrl };
  }

  async verify2FASetup(userId: string, token: string, ipAddress?: string, userAgent?: string): Promise<{ success: boolean; recoveryCodes?: string[] }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { twoFactorSecret: true, twoFactorEnabled: true },
    });

    if (!user || !user.twoFactorSecret) {
      throw new BadRequestException('2FA non configuré. Appelez /auth/2fa/setup d\'abord.');
    }

    if (user.twoFactorEnabled) {
      throw new BadRequestException('2FA déjà activé.');
    }

    const secret = this.decrypt(user.twoFactorSecret);
    const isValid = await verify({ token, secret });

    if (!isValid) {
      return { success: false };
    }

    // Generate recovery codes
    const recoveryCodes = this.generateRecoveryCodes();
    const hashedCodes = await Promise.all(
      recoveryCodes.map(code => bcrypt.hash(code, 10))
    );

    // Enable 2FA
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorEnabled: true,
        recoveryCodes: hashedCodes,
        twoFactorAttempts: 0,
        twoFactorLockedUntil: null,
      },
    });

    await this.auditService.log({
      userId,
      action: '2FA_ENABLED',
      entite: 'auth',
      ipAddress,
      userAgent,
    });

    return { success: true, recoveryCodes };
  }

  async verify2FACode(userId: string, token: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        twoFactorSecret: true,
        twoFactorEnabled: true,
        twoFactorAttempts: true,
        twoFactorLockedUntil: true,
        recoveryCodes: true,
      },
    });

    if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) {
      throw new UnauthorizedException('2FA non activé');
    }

    // Check lockout
    if (user.twoFactorLockedUntil && user.twoFactorLockedUntil > new Date()) {
      const remainingMs = user.twoFactorLockedUntil.getTime() - Date.now();
      const remainingMin = Math.ceil(remainingMs / 60000);
      throw new UnauthorizedException(`Trop de tentatives. Réessayez dans ${remainingMin} minute(s).`);
    }

    const secret = this.decrypt(user.twoFactorSecret);
    const isValid = await verify({ token, secret });

    if (isValid) {
      // Reset attempts on success
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          twoFactorAttempts: 0,
          twoFactorLockedUntil: null,
        },
      });
      return true;
    }

    // Check recovery codes
    const isRecoveryCode = await this.checkRecoveryCode(userId, token, user.recoveryCodes);
    if (isRecoveryCode) {
      return true;
    }

    // Increment failed attempts
    const newAttempts = user.twoFactorAttempts + 1;
    const updateData: { twoFactorAttempts: number; twoFactorLockedUntil?: Date } = {
      twoFactorAttempts: newAttempts,
    };

    if (newAttempts >= MAX_ATTEMPTS) {
      updateData.twoFactorLockedUntil = new Date(Date.now() + LOCKOUT_DURATION_MS);
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    if (newAttempts >= MAX_ATTEMPTS) {
      throw new UnauthorizedException('Trop de tentatives. Compte verrouillé pour 15 minutes.');
    }

    return false;
  }

  async disable2FA(userId: string, token: string, ipAddress?: string, userAgent?: string): Promise<{ success: boolean }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { twoFactorSecret: true, twoFactorEnabled: true, role: true },
    });

    if (!user || !user.twoFactorEnabled) {
      throw new BadRequestException('2FA non activé');
    }

    // Verify current 2FA code before disabling
    const secret = this.decrypt(user.twoFactorSecret!);
    const isValid = await verify({ token, secret });

    if (!isValid) {
      throw new UnauthorizedException('Code 2FA invalide');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorSecret: null,
        twoFactorEnabled: false,
        recoveryCodes: [],
        twoFactorAttempts: 0,
        twoFactorLockedUntil: null,
      },
    });

    await this.auditService.log({
      userId,
      action: '2FA_DISABLED',
      entite: 'auth',
      ipAddress,
      userAgent,
    });

    return { success: true };
  }

  async regenerateRecoveryCodes(userId: string, token: string): Promise<{ recoveryCodes: string[] }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { twoFactorSecret: true, twoFactorEnabled: true },
    });

    if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) {
      throw new BadRequestException('2FA non activé');
    }

    // Verify current 2FA code
    const secret = this.decrypt(user.twoFactorSecret);
    const isValid = await verify({ token, secret });

    if (!isValid) {
      throw new UnauthorizedException('Code 2FA invalide');
    }

    const recoveryCodes = this.generateRecoveryCodes();
    const hashedCodes = await Promise.all(
      recoveryCodes.map(code => bcrypt.hash(code, 10))
    );

    await this.prisma.user.update({
      where: { id: userId },
      data: { recoveryCodes: hashedCodes },
    });

    return { recoveryCodes };
  }

  async is2FARequired(userId: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, twoFactorEnabled: true },
    });

    if (!user) return false;

    // Check if 2FA is required for this role
    const requiredRoles = this.configService.get<string>('TWO_FACTOR_REQUIRED_ROLES') || 'patron';
    const requiredRoleList = requiredRoles.split(',').map(r => r.trim());

    return requiredRoleList.includes(user.role);
  }

  async is2FAEnabled(userId: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { twoFactorEnabled: true },
    });

    return user?.twoFactorEnabled ?? false;
  }

  private async checkRecoveryCode(userId: string, code: string, hashedCodes: string[]): Promise<boolean> {
    // Normalize: remove dashes and spaces
    const normalizedCode = code.replace(/[-\s]/g, '').toUpperCase();

    for (let i = 0; i < hashedCodes.length; i++) {
      const isMatch = await bcrypt.compare(normalizedCode, hashedCodes[i]);
      if (isMatch) {
        // Remove used recovery code
        const newCodes = [...hashedCodes];
        newCodes.splice(i, 1);

        await this.prisma.user.update({
          where: { id: userId },
          data: {
            recoveryCodes: newCodes,
            twoFactorAttempts: 0,
            twoFactorLockedUntil: null,
          },
        });

        return true;
      }
    }

    return false;
  }

  private generateRecoveryCodes(): string[] {
    const codes: string[] = [];
    for (let i = 0; i < RECOVERY_CODE_COUNT; i++) {
      // Generate 8 character alphanumeric code
      const code = crypto.randomBytes(4).toString('hex').toUpperCase();
      codes.push(code);
    }
    return codes;
  }

  private encrypt(text: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, this.encryptionKey, iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  }

  private decrypt(encryptedText: string): string {
    const [ivHex, authTagHex, encrypted] = encryptedText.split(':');

    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');

    const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, this.encryptionKey, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }
}
