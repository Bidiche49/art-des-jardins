import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  SecurityEventType,
  SecuritySeverity,
  CreateSecurityEventInput,
  DEFAULT_SEVERITY_MAP,
} from './security-event.types';

/**
 * Service dédié aux logs d'audit de sécurité
 *
 * Ce service permet d'enregistrer des événements de sécurité avec un typage fort
 * et des métadonnées structurées. Tous les événements sont stockés dans la table
 * AuditLog avec entite='security'.
 */
@Injectable()
export class SecurityAuditService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Enregistre un événement de sécurité
   *
   * @param event - Données de l'événement (le timestamp est auto-renseigné si absent)
   * @returns L'enregistrement AuditLog créé
   *
   * @example
   * ```ts
   * await securityAuditService.logSecurityEvent({
   *   type: SecurityEventType.LOGIN_SUCCESS,
   *   userId: user.id,
   *   ip: req.ip,
   *   userAgent: req.headers['user-agent'],
   *   severity: 'info',
   *   metadata: { deviceId: device.id }
   * });
   * ```
   */
  async logSecurityEvent(event: CreateSecurityEventInput): Promise<void> {
    const timestamp = event.timestamp || new Date();
    const severity = event.severity || DEFAULT_SEVERITY_MAP[event.type];

    await this.prisma.auditLog.create({
      data: {
        userId: event.userId || null,
        action: event.type,
        entite: 'security',
        entiteId: event.userId || null,
        ipAddress: event.ip,
        userAgent: event.userAgent,
        details: {
          severity,
          timestamp: timestamp.toISOString(),
          ...event.metadata,
        },
      },
    });
  }

  /**
   * Enregistre un événement de connexion réussie
   */
  async logLoginSuccess(
    userId: string,
    ip: string,
    userAgent: string,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    await this.logSecurityEvent({
      type: SecurityEventType.LOGIN_SUCCESS,
      userId,
      ip,
      userAgent,
      severity: 'info',
      metadata,
    });
  }

  /**
   * Enregistre un échec de connexion
   */
  async logLoginFailed(
    ip: string,
    userAgent: string,
    metadata?: Record<string, unknown> & { email?: string; reason?: string },
  ): Promise<void> {
    await this.logSecurityEvent({
      type: SecurityEventType.LOGIN_FAILED,
      ip,
      userAgent,
      severity: 'warning',
      metadata,
    });
  }

  /**
   * Enregistre une déconnexion
   */
  async logLogout(userId: string, ip: string, userAgent: string): Promise<void> {
    await this.logSecurityEvent({
      type: SecurityEventType.LOGOUT,
      userId,
      ip,
      userAgent,
      severity: 'info',
    });
  }

  /**
   * Enregistre l'activation du 2FA
   */
  async log2FAEnabled(userId: string, ip: string, userAgent: string): Promise<void> {
    await this.logSecurityEvent({
      type: SecurityEventType.TWO_FACTOR_ENABLED,
      userId,
      ip,
      userAgent,
      severity: 'info',
    });
  }

  /**
   * Enregistre la désactivation du 2FA
   */
  async log2FADisabled(userId: string, ip: string, userAgent: string): Promise<void> {
    await this.logSecurityEvent({
      type: SecurityEventType.TWO_FACTOR_DISABLED,
      userId,
      ip,
      userAgent,
      severity: 'warning',
    });
  }

  /**
   * Enregistre un échec de vérification 2FA
   */
  async log2FAFailed(
    userId: string,
    ip: string,
    userAgent: string,
    metadata?: Record<string, unknown> & { attemptCount?: number },
  ): Promise<void> {
    await this.logSecurityEvent({
      type: SecurityEventType.TWO_FACTOR_FAILED,
      userId,
      ip,
      userAgent,
      severity: 'warning',
      metadata,
    });
  }

  /**
   * Enregistre un changement de mot de passe
   */
  async logPasswordChanged(userId: string, ip: string, userAgent: string): Promise<void> {
    await this.logSecurityEvent({
      type: SecurityEventType.PASSWORD_CHANGED,
      userId,
      ip,
      userAgent,
      severity: 'info',
    });
  }

  /**
   * Enregistre une demande de réinitialisation de mot de passe
   */
  async logPasswordResetRequested(
    ip: string,
    userAgent: string,
    metadata?: Record<string, unknown> & { email?: string },
  ): Promise<void> {
    await this.logSecurityEvent({
      type: SecurityEventType.PASSWORD_RESET_REQUESTED,
      ip,
      userAgent,
      severity: 'info',
      metadata,
    });
  }

  /**
   * Enregistre un rafraîchissement de token
   */
  async logTokenRefresh(
    userId: string,
    ip: string,
    userAgent: string,
    metadata?: Record<string, unknown> & { deviceId?: string },
  ): Promise<void> {
    await this.logSecurityEvent({
      type: SecurityEventType.TOKEN_REFRESH,
      userId,
      ip,
      userAgent,
      severity: 'info',
      metadata,
    });
  }

  /**
   * Enregistre une révocation de token
   */
  async logTokenRevoked(
    userId: string,
    ip: string,
    userAgent: string,
    metadata?: Record<string, unknown> & { deviceId?: string; reason?: string },
  ): Promise<void> {
    await this.logSecurityEvent({
      type: SecurityEventType.TOKEN_REVOKED,
      userId,
      ip,
      userAgent,
      severity: 'info',
      metadata,
    });
  }

  /**
   * Enregistre un refus d'accès (permission denied)
   */
  async logPermissionDenied(
    userId: string,
    ip: string,
    userAgent: string,
    metadata?: Record<string, unknown> & { resource?: string; action?: string },
  ): Promise<void> {
    await this.logSecurityEvent({
      type: SecurityEventType.PERMISSION_DENIED,
      userId,
      ip,
      userAgent,
      severity: 'warning',
      metadata,
    });
  }

  /**
   * Enregistre un dépassement de rate limit
   */
  async logRateLimitExceeded(
    ip: string,
    userAgent: string,
    metadata?: Record<string, unknown> & { endpoint?: string; limit?: number },
  ): Promise<void> {
    await this.logSecurityEvent({
      type: SecurityEventType.RATE_LIMIT_EXCEEDED,
      ip,
      userAgent,
      severity: 'warning',
      metadata,
    });
  }

  /**
   * Enregistre une activité suspecte
   */
  async logSuspiciousActivity(
    ip: string,
    userAgent: string,
    metadata: Record<string, unknown> & { reason: string; userId?: string },
  ): Promise<void> {
    await this.logSecurityEvent({
      type: SecurityEventType.SUSPICIOUS_ACTIVITY,
      userId: metadata.userId,
      ip,
      userAgent,
      severity: 'critical',
      metadata,
    });
  }
}
