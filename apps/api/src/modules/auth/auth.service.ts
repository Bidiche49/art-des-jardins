import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../database/prisma.service';
import { AuditService } from '../audit/audit.service';
import { LoginDto } from './dto/login.dto';
import { TwoFactorService } from './two-factor.service';
import { DeviceTrackingService } from './device-tracking.service';
import { RefreshTokenService } from './refresh-token.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private twoFactorService: TwoFactorService,
    private auditService: AuditService,
    private deviceTrackingService: DeviceTrackingService,
    private refreshTokenService: RefreshTokenService,
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

    // Generer access token
    const accessToken = this.jwtService.sign({ sub: user.id, email: user.email, role: user.role });

    // Generer refresh token avec rotation (stocke en base)
    const refreshToken = await this.refreshTokenService.createRefreshToken(
      user.id,
      user.email,
      user.role,
      deviceResult?.deviceId,
    );

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
        onboardingCompleted: user.onboardingCompleted,
        onboardingStep: user.onboardingStep,
      },
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshToken: string, ipAddress?: string, userAgent?: string) {
    // Utilise le service de rotation qui:
    // 1. Verifie le token en base
    // 2. Detecte les replays (token deja utilise)
    // 3. Marque l'ancien token comme utilise
    // 4. Genere un nouveau couple access/refresh token
    return this.refreshTokenService.rotateRefreshToken(refreshToken, ipAddress, userAgent);
  }

  async logout(userId: string, refreshToken?: string, ipAddress?: string, userAgent?: string) {
    // Revoquer tous les tokens de l'utilisateur
    const revokedCount = await this.refreshTokenService.revokeAllUserTokens(userId, 'logout');

    await this.auditService.log({
      userId,
      action: 'TOKEN_REVOKED',
      entite: 'auth',
      details: { revokedCount },
      ipAddress,
      userAgent,
    });

    return { success: true, revokedCount };
  }

  /**
   * Nettoie les tokens expires (a appeler via cron)
   */
  async cleanupExpiredTokens(): Promise<number> {
    return this.refreshTokenService.cleanupExpiredTokens();
  }

  // ============================================
  // ONBOARDING METHODS
  // ============================================

  async updateOnboardingStep(userId: string, step: number): Promise<{ success: boolean; step: number }> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { onboardingStep: step },
    });

    await this.auditService.log({
      userId,
      action: 'ONBOARDING_STEP_UPDATE',
      entite: 'user',
      details: { step },
    });

    return { success: true, step };
  }

  async completeOnboarding(userId: string): Promise<{ success: boolean }> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { onboardingCompleted: true },
    });

    await this.auditService.log({
      userId,
      action: 'ONBOARDING_COMPLETED',
      entite: 'user',
      details: {},
    });

    return { success: true };
  }

  async resetOnboarding(userId: string): Promise<{ success: boolean }> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { onboardingCompleted: false, onboardingStep: 0 },
    });

    await this.auditService.log({
      userId,
      action: 'ONBOARDING_RESET',
      entite: 'user',
      details: {},
    });

    return { success: true };
  }

  /**
   * Génère les tokens JWT pour un utilisateur (utilisé par WebAuthn login)
   */
  async generateTokensForUser(
    userId: string,
    ipAddress?: string,
    userAgent?: string,
    acceptLanguage?: string,
  ): Promise<{
    user: { id: string; email: string; nom: string; prenom: string; role: string; twoFactorEnabled: boolean; onboardingCompleted: boolean; onboardingStep: number };
    accessToken: string;
    refreshToken: string;
  }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.actif) {
      throw new UnauthorizedException('Utilisateur non trouvé ou inactif');
    }

    // Device tracking - detect new devices and send alert
    let deviceResult = null;
    if (userAgent && ipAddress) {
      deviceResult = await this.deviceTrackingService.registerDevice(
        user.id,
        userAgent,
        ipAddress,
        acceptLanguage,
      );

      // Si nouveau device, envoyer email d'alerte
      if (deviceResult.isNew) {
        await this.deviceTrackingService.sendNewDeviceAlert(
          user.id,
          deviceResult.deviceId,
          deviceResult.device.deviceName || 'Appareil inconnu',
          ipAddress,
          deviceResult.geoLocation || null,
        );
      }
    }

    // Update last connection
    await this.prisma.user.update({
      where: { id: user.id },
      data: { derniereConnexion: new Date() },
    });

    // Generer access token
    const accessToken = this.jwtService.sign({ sub: user.id, email: user.email, role: user.role });

    // Generer refresh token avec rotation (stocke en base)
    const refreshToken = await this.refreshTokenService.createRefreshToken(
      user.id,
      user.email,
      user.role,
      deviceResult?.deviceId,
    );

    await this.auditService.log({
      userId: user.id,
      action: 'LOGIN_SUCCESS',
      entite: 'auth',
      details: {
        method: 'webauthn',
        deviceId: deviceResult?.deviceId,
        isNewDevice: deviceResult?.isNew,
      },
      ipAddress,
      userAgent,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        nom: user.nom,
        prenom: user.prenom,
        role: user.role,
        twoFactorEnabled: user.twoFactorEnabled,
        onboardingCompleted: user.onboardingCompleted,
        onboardingStep: user.onboardingStep,
      },
      accessToken,
      refreshToken,
    };
  }
}
