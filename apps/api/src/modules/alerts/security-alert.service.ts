import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../database/prisma.service';
import { MailService } from '../mail/mail.service';

export interface SecurityEvent {
  action: string;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  details?: Record<string, unknown>;
}

interface SecurityAlertConfig {
  threshold: number;
  windowMinutes: number;
  email: string | null;
}

@Injectable()
export class SecurityAlertService implements OnModuleInit {
  private readonly logger = new Logger(SecurityAlertService.name);
  private readonly config: SecurityAlertConfig;

  constructor(
    private prisma: PrismaService,
    private mail: MailService,
    private configService: ConfigService,
  ) {
    this.config = {
      threshold: parseInt(
        this.configService.get('SECURITY_ALERT_THRESHOLD') || '5',
        10,
      ),
      windowMinutes: parseInt(
        this.configService.get('SECURITY_ALERT_WINDOW_MINUTES') || '10',
        10,
      ),
      email: this.configService.get('SECURITY_ALERT_EMAIL') || null,
    };
  }

  onModuleInit() {
    if (this.config.email) {
      this.logger.log(
        `Security alerts enabled - threshold: ${this.config.threshold} failures in ${this.config.windowMinutes} min - notifications to: ${this.config.email}`,
      );
    } else {
      this.logger.warn(
        'Security alert email not configured - SECURITY_ALERT_EMAIL not set',
      );
    }
  }

  getConfig(): SecurityAlertConfig {
    return { ...this.config };
  }

  isEnabled(): boolean {
    return !!this.config.email;
  }

  /**
   * Verifie un evenement de securite et envoie une alerte si pattern suspect detecte
   */
  async checkAndAlert(event: SecurityEvent): Promise<void> {
    // Detecter les patterns suspects selon le type d'evenement
    if (event.action === 'LOGIN_FAILED' && event.userId) {
      await this.checkBruteForce(event);
    }

    if (event.action === 'LOGIN_FAILED' && event.ipAddress) {
      await this.checkBruteForceByIp(event);
    }
  }

  /**
   * Detection de bruteforce par userId: > threshold LOGIN_FAILED en windowMinutes
   */
  private async checkBruteForce(event: SecurityEvent): Promise<void> {
    const windowStart = new Date(
      Date.now() - this.config.windowMinutes * 60 * 1000,
    );

    const failedCount = await this.prisma.auditLog.count({
      where: {
        action: 'LOGIN_FAILED',
        userId: event.userId,
        createdAt: { gte: windowStart },
      },
    });

    if (failedCount >= this.config.threshold) {
      await this.triggerAlert(
        'BRUTEFORCE_DETECTED',
        `${failedCount} tentatives de connexion echouees pour l'utilisateur ${event.userId} en ${this.config.windowMinutes} minutes`,
        event,
      );
    }
  }

  /**
   * Detection de bruteforce par IP: > threshold LOGIN_FAILED en windowMinutes
   */
  private async checkBruteForceByIp(event: SecurityEvent): Promise<void> {
    const windowStart = new Date(
      Date.now() - this.config.windowMinutes * 60 * 1000,
    );

    const failedCount = await this.prisma.auditLog.count({
      where: {
        action: 'LOGIN_FAILED',
        ipAddress: event.ipAddress,
        createdAt: { gte: windowStart },
      },
    });

    // Seuil plus haut pour l'IP (plusieurs users peuvent etre derriere un NAT)
    const ipThreshold = this.config.threshold * 2;

    if (failedCount >= ipThreshold) {
      await this.triggerAlert(
        'BRUTEFORCE_IP_DETECTED',
        `${failedCount} tentatives de connexion echouees depuis l'IP ${event.ipAddress} en ${this.config.windowMinutes} minutes`,
        event,
      );
    }
  }

  /**
   * Declenche une alerte: log + email
   */
  private async triggerAlert(
    alertType: string,
    message: string,
    event: SecurityEvent,
  ): Promise<void> {
    this.logger.warn(`Security alert: ${alertType} - ${message}`);

    // Logger SUSPICIOUS_ACTIVITY dans les audit logs
    await this.prisma.auditLog.create({
      data: {
        action: 'SUSPICIOUS_ACTIVITY',
        entite: 'security',
        userId: event.userId,
        ipAddress: event.ipAddress,
        userAgent: event.userAgent,
        details: {
          alertType,
          message,
          originalEvent: event.action,
          threshold: this.config.threshold,
          windowMinutes: this.config.windowMinutes,
        },
      },
    });

    // Envoyer l'email d'alerte si configure
    if (this.isEnabled()) {
      await this.sendSecurityAlert(alertType, message, event);
    }
  }

  /**
   * Envoie un email d'alerte securite
   */
  private async sendSecurityAlert(
    alertType: string,
    message: string,
    event: SecurityEvent,
  ): Promise<boolean> {
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #dc3545; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { padding: 25px; background: #f9f9f9; }
    .alert-box { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #dc3545; margin: 15px 0; }
    .details { background: #fff3cd; padding: 15px; border-radius: 4px; margin: 15px 0; font-family: monospace; font-size: 13px; }
    .footer { padding: 15px; text-align: center; font-size: 12px; color: #666; background: #eee; border-radius: 0 0 8px 8px; }
    .timestamp { color: #888; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">ALERTE SECURITE</h1>
    </div>
    <div class="content">
      <div class="alert-box">
        <strong>Type:</strong> ${alertType}<br>
        <strong>Message:</strong> ${message}
      </div>
      <div class="details">
        <strong>Details de l'evenement:</strong><br>
        Action: ${event.action}<br>
        User ID: ${event.userId || 'N/A'}<br>
        IP: ${event.ipAddress || 'N/A'}<br>
        User-Agent: ${event.userAgent || 'N/A'}
      </div>
      <p class="timestamp">Date: ${new Date().toLocaleString('fr-FR')}</p>
      <p>Une activite suspecte a ete detectee. Verifiez les logs d'audit pour plus de details.</p>
    </div>
    <div class="footer">
      <p>Alerte securite automatique - Art & Jardin</p>
    </div>
  </div>
</body>
</html>
    `;

    return this.mail.sendMail({
      to: this.config.email!,
      subject: `[SECURITE] ${alertType} - Art & Jardin`,
      html,
      skipBcc: true,
    });
  }
}
