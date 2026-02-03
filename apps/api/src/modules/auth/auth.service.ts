import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../database/prisma.service';
import { AuditService } from '../audit/audit.service';
import { LoginDto } from './dto/login.dto';
import { TwoFactorService } from './two-factor.service';
import { DeviceTrackingService } from './device-tracking.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private twoFactorService: TwoFactorService,
    private auditService: AuditService,
    private deviceTrackingService: DeviceTrackingService,
  ) {}

  async login(loginDto: LoginDto & { totpCode?: string; ipAddress?: string; userAgent?: string; acceptLanguage?: string }) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user || !user.actif) {
      await this.auditService.log({
        action: 'LOGIN_FAILED',
        entite: 'auth',
        details: { email: loginDto.email, reason: 'invalid_credentials' },
        ipAddress: loginDto.ipAddress,
        userAgent: loginDto.userAgent,
      });
      throw new UnauthorizedException('Identifiants invalides');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.passwordHash);
    if (!isPasswordValid) {
      await this.auditService.log({
        userId: user.id,
        action: 'LOGIN_FAILED',
        entite: 'auth',
        details: { reason: 'invalid_password' },
        ipAddress: loginDto.ipAddress,
        userAgent: loginDto.userAgent,
      });
      throw new UnauthorizedException('Identifiants invalides');
    }

    // Check if 2FA is enabled
    if (user.twoFactorEnabled) {
      if (!loginDto.totpCode) {
        // Return partial response indicating 2FA is required
        return {
          requires2FA: true,
          userId: user.id,
          message: 'Code 2FA requis',
        };
      }

      // Verify 2FA code
      const isValid = await this.twoFactorService.verify2FACode(user.id, loginDto.totpCode);
      if (!isValid) {
        await this.auditService.log({
          userId: user.id,
          action: '2FA_FAILED',
          entite: 'auth',
          details: { reason: 'invalid_totp_code' },
          ipAddress: loginDto.ipAddress,
          userAgent: loginDto.userAgent,
        });
        throw new UnauthorizedException('Code 2FA invalide');
      }
    }

    // Device tracking - detect new devices and send alert
    let deviceResult = null;
    if (loginDto.userAgent && loginDto.ipAddress) {
      deviceResult = await this.deviceTrackingService.registerDevice(
        user.id,
        loginDto.userAgent,
        loginDto.ipAddress,
        loginDto.acceptLanguage,
      );

      // Si nouveau device, envoyer email d'alerte
      if (deviceResult.isNew) {
        await this.deviceTrackingService.sendNewDeviceAlert(
          user.id,
          deviceResult.deviceId,
          deviceResult.device.deviceName || 'Appareil inconnu',
          loginDto.ipAddress,
          deviceResult.geoLocation || null,
        );
      }
    }

    // Update last connection
    await this.prisma.user.update({
      where: { id: user.id },
      data: { derniereConnexion: new Date() },
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    await this.auditService.log({
      userId: user.id,
      action: 'LOGIN_SUCCESS',
      entite: 'auth',
      details: {
        twoFactorUsed: user.twoFactorEnabled,
        deviceId: deviceResult?.deviceId,
        isNewDevice: deviceResult?.isNew,
      },
      ipAddress: loginDto.ipAddress,
      userAgent: loginDto.userAgent,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        nom: user.nom,
        prenom: user.prenom,
        role: user.role,
        twoFactorEnabled: user.twoFactorEnabled,
      },
      ...tokens,
    };
  }

  async refresh(refreshToken: string, ipAddress?: string, userAgent?: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_SECRET') || 'dev-secret-change-in-production',
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user || !user.actif) {
        throw new UnauthorizedException('Token invalide');
      }

      const tokens = await this.generateTokens(user.id, user.email, user.role);

      await this.auditService.log({
        userId: user.id,
        action: 'TOKEN_REFRESH',
        entite: 'auth',
        ipAddress,
        userAgent,
      });

      return tokens;
    } catch {
      throw new UnauthorizedException('Token invalide ou expire');
    }
  }

  async logout(userId: string, ipAddress?: string, userAgent?: string) {
    await this.auditService.log({
      userId,
      action: 'TOKEN_REVOKED',
      entite: 'auth',
      ipAddress,
      userAgent,
    });
    return { success: true };
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d',
    });

    return { accessToken, refreshToken };
  }
}
