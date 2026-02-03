import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { PrismaService } from '../../database/prisma.service';
import { AuditService } from '../audit/audit.service';

export interface RefreshTokenPayload {
  sub: string;
  email: string;
  role: string;
  familyId: string;
  jti: string; // JWT ID unique pour ce token
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class RefreshTokenService {
  private readonly logger = new Logger(RefreshTokenService.name);
  private readonly refreshExpiresIn: string;
  private readonly jwtSecret: string;

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private auditService: AuditService,
  ) {
    this.refreshExpiresIn = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d';
    this.jwtSecret = this.configService.get<string>('JWT_SECRET') || 'dev-secret-change-in-production';
  }

  /**
   * Genere un nouveau refresh token et le stocke en base
   */
  async createRefreshToken(
    userId: string,
    email: string,
    role: string,
    deviceId?: string,
    existingFamilyId?: string,
  ): Promise<string> {
    const familyId = existingFamilyId || crypto.randomUUID();
    const jti = crypto.randomUUID();

    // Calcul de l'expiration
    const expiresAt = this.calculateExpiration(this.refreshExpiresIn);

    // Creation du JWT
    const payload: RefreshTokenPayload = {
      sub: userId,
      email,
      role,
      familyId,
      jti,
    };

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.jwtSecret,
      expiresIn: this.refreshExpiresIn,
    });

    // Stockage en base
    await this.prisma.refreshToken.create({
      data: {
        id: jti,
        userId,
        token: refreshToken,
        deviceId,
        familyId,
        expiresAt,
      },
    });

    this.logger.debug(`Refresh token cree pour user ${userId}, famille ${familyId}`);

    return refreshToken;
  }

  /**
   * Rotation du refresh token:
   * 1. Verifie le token existant
   * 2. Si deja utilise -> replay detecte -> revoque toute la famille
   * 3. Marque comme utilise
   * 4. Genere nouveau token dans la meme famille
   */
  async rotateRefreshToken(
    oldRefreshToken: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<TokenPair> {
    // Decode le token sans verifier l'expiration (on verifie en base)
    let payload: RefreshTokenPayload;
    try {
      payload = this.jwtService.verify<RefreshTokenPayload>(oldRefreshToken, {
        secret: this.jwtSecret,
      });
    } catch {
      throw new UnauthorizedException('Token invalide ou expire');
    }

    // Recherche du token en base
    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { id: payload.jti },
      include: { user: true },
    });

    if (!storedToken) {
      this.logger.warn(`Token non trouve en base: ${payload.jti}`);
      throw new UnauthorizedException('Token invalide');
    }

    // Verification que l'utilisateur est actif
    if (!storedToken.user.actif) {
      throw new UnauthorizedException('Compte desactive');
    }

    // Verification expiration
    if (storedToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Token expire');
    }

    // Verification revocation
    if (storedToken.revokedAt) {
      throw new UnauthorizedException('Token revoque');
    }

    // DETECTION REPLAY: Si le token a deja ete utilise
    if (storedToken.usedAt) {
      this.logger.error(`REPLAY DETECTE pour famille ${storedToken.familyId}!`);

      // Revoquer TOUTE la famille de tokens
      await this.revokeTokenFamily(storedToken.familyId, 'replay_detected');

      await this.auditService.log({
        userId: storedToken.userId,
        action: 'TOKEN_REPLAY_DETECTED',
        entite: 'auth',
        details: {
          familyId: storedToken.familyId,
          tokenId: payload.jti,
        },
        ipAddress,
        userAgent,
      });

      throw new UnauthorizedException('Utilisation suspecte detectee - toutes les sessions ont ete revoquees');
    }

    // Marquer le token comme utilise
    await this.prisma.refreshToken.update({
      where: { id: payload.jti },
      data: { usedAt: new Date() },
    });

    // Generer le nouveau access token
    const accessToken = this.jwtService.sign(
      { sub: storedToken.userId, email: storedToken.user.email, role: storedToken.user.role },
      { secret: this.jwtSecret },
    );

    // Generer le nouveau refresh token (meme famille)
    const newRefreshToken = await this.createRefreshToken(
      storedToken.userId,
      storedToken.user.email,
      storedToken.user.role,
      storedToken.deviceId || undefined,
      storedToken.familyId,
    );

    await this.auditService.log({
      userId: storedToken.userId,
      action: 'TOKEN_ROTATED',
      entite: 'auth',
      details: {
        familyId: storedToken.familyId,
        oldTokenId: payload.jti,
      },
      ipAddress,
      userAgent,
    });

    this.logger.debug(`Token rotated pour user ${storedToken.userId}`);

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  /**
   * Revoque tous les tokens d'une famille
   */
  async revokeTokenFamily(familyId: string, reason: string): Promise<number> {
    const result = await this.prisma.refreshToken.updateMany({
      where: {
        familyId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });

    this.logger.warn(`Famille ${familyId} revoquee (${result.count} tokens), raison: ${reason}`);

    return result.count;
  }

  /**
   * Revoque tous les tokens d'un utilisateur
   */
  async revokeAllUserTokens(userId: string, reason: string): Promise<number> {
    const result = await this.prisma.refreshToken.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });

    this.logger.warn(`Tous les tokens de l'user ${userId} revoques (${result.count}), raison: ${reason}`);

    return result.count;
  }

  /**
   * Revoque un token specifique
   */
  async revokeToken(tokenId: string): Promise<boolean> {
    try {
      await this.prisma.refreshToken.update({
        where: { id: tokenId },
        data: { revokedAt: new Date() },
      });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Nettoie les tokens expires
   */
  async cleanupExpiredTokens(): Promise<number> {
    const result = await this.prisma.refreshToken.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: new Date() } },
          { revokedAt: { not: null } },
        ],
      },
    });

    this.logger.log(`${result.count} tokens expires/revoques supprimes`);

    return result.count;
  }

  /**
   * Calcule la date d'expiration a partir d'une duree
   */
  private calculateExpiration(expiresIn: string): Date {
    const now = new Date();
    const match = expiresIn.match(/^(\d+)([smhd])$/);

    if (!match) {
      // Par defaut 7 jours
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case 's':
        return new Date(now.getTime() + value * 1000);
      case 'm':
        return new Date(now.getTime() + value * 60 * 1000);
      case 'h':
        return new Date(now.getTime() + value * 60 * 60 * 1000);
      case 'd':
        return new Date(now.getTime() + value * 24 * 60 * 60 * 1000);
      default:
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    }
  }
}
