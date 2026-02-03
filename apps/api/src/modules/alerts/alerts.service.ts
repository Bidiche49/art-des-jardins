import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../database/prisma.service';
import { MailService } from '../mail/mail.service';
import { HealthService } from '../health/health.service';
import { Alert, AlertConfig, ServiceDownTracker } from './alerts.types';

@Injectable()
export class AlertsService implements OnModuleInit {
  private readonly logger = new Logger(AlertsService.name);
  private readonly config: AlertConfig;
  private readonly serviceDownTrackers: Map<string, ServiceDownTracker> = new Map();

  constructor(
    private prisma: PrismaService,
    private mail: MailService,
    private health: HealthService,
    private configService: ConfigService,
  ) {
    this.config = {
      enabled: this.configService.get('ALERTS_ENABLED') === 'true',
      email: this.configService.get('ALERTS_EMAIL') || '',
      serviceDownThresholdMs: parseInt(
        this.configService.get('SERVICE_DOWN_THRESHOLD') || '300000',
        10,
      ), // 5 minutes
    };
  }

  onModuleInit() {
    if (this.config.enabled && this.config.email) {
      this.logger.log(
        `Alerts service enabled - notifications to: ${this.config.email}`,
      );
    } else {
      this.logger.warn(
        'Alerts service disabled - enable with ALERTS_ENABLED=true and ALERTS_EMAIL',
      );
    }
  }

  getConfig(): AlertConfig {
    return { ...this.config };
  }

  isEnabled(): boolean {
    return this.config.enabled && !!this.config.email;
  }

  /**
   * Verifie l'etat des services et envoie des alertes si necessaire
   */
  async checkAndAlert(): Promise<void> {
    if (!this.isEnabled()) {
      return;
    }

    const health = await this.health.getDetailedHealth();

    for (const [serviceName, serviceHealth] of Object.entries(health.services)) {
      if (serviceHealth.status === 'down') {
        await this.handleServiceDown(serviceName, serviceHealth.error);
      } else {
        await this.handleServiceUp(serviceName);
      }
    }

    // Verifier les echecs de backup
    await this.checkBackupFailures();

    // Verifier les echecs d'emails
    await this.checkEmailFailures();
  }

  /**
   * Gere un service qui est down
   */
  private async handleServiceDown(service: string, error?: string): Promise<void> {
    let tracker = this.serviceDownTrackers.get(service);

    if (!tracker) {
      // Premiere detection de panne
      tracker = {
        service,
        downSince: new Date(),
        lastError: error,
        alertSent: false,
      };
      this.serviceDownTrackers.set(service, tracker);
      this.logger.warn(`Service ${service} is DOWN: ${error}`);
    }

    // Verifier si on doit envoyer une alerte
    const downDuration = Date.now() - tracker.downSince.getTime();

    if (!tracker.alertSent && downDuration >= this.config.serviceDownThresholdMs) {
      await this.sendAlert({
        type: 'SERVICE_DOWN',
        service,
        message: `Le service ${service} est indisponible depuis ${Math.round(downDuration / 60000)} minutes`,
        error,
        timestamp: new Date(),
      });
      tracker.alertSent = true;
    }
  }

  /**
   * Gere un service qui est revenu en ligne
   */
  private async handleServiceUp(service: string): Promise<void> {
    const tracker = this.serviceDownTrackers.get(service);

    if (tracker && tracker.alertSent) {
      // Service etait down et avait genere une alerte, envoyer alerte de retablissement
      const downDuration = Date.now() - tracker.downSince.getTime();
      await this.sendAlert({
        type: 'SERVICE_RECOVERED',
        service,
        message: `Le service ${service} est de nouveau disponible apres ${Math.round(downDuration / 60000)} minutes d'indisponibilite`,
        timestamp: new Date(),
      });
    }

    // Supprimer le tracker
    this.serviceDownTrackers.delete(service);
  }

  /**
   * Verifie si le dernier backup a echoue
   */
  private async checkBackupFailures(): Promise<void> {
    const lastBackup = await this.prisma.backupHistory.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (lastBackup && lastBackup.status === 'failed') {
      // Verifier si on n'a pas deja envoye une alerte pour ce backup
      const backupTrackerId = `backup_${lastBackup.id}`;
      if (!this.serviceDownTrackers.has(backupTrackerId)) {
        await this.sendAlert({
          type: 'BACKUP_FAILED',
          message: `Le backup ${lastBackup.fileName} a echoue: ${lastBackup.errorMessage}`,
          error: lastBackup.errorMessage || undefined,
          timestamp: new Date(),
        });
        this.serviceDownTrackers.set(backupTrackerId, {
          service: 'backup',
          downSince: lastBackup.createdAt,
          alertSent: true,
        });
      }
    }
  }

  /**
   * Verifie si trop d'emails ont echoue recemment
   */
  private async checkEmailFailures(): Promise<void> {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    const failedCount = await this.prisma.emailHistory.count({
      where: {
        status: 'failed',
        createdAt: { gte: oneHourAgo },
      },
    });

    if (failedCount >= 10) {
      const trackerId = `email_failures_${oneHourAgo.getTime()}`;
      if (!this.serviceDownTrackers.has(trackerId)) {
        await this.sendAlert({
          type: 'EMAIL_FAILURES',
          message: `${failedCount} emails ont echoue dans la derniere heure`,
          timestamp: new Date(),
        });
        this.serviceDownTrackers.set(trackerId, {
          service: 'email',
          downSince: new Date(),
          alertSent: true,
        });
      }
    }
  }

  /**
   * Envoie une alerte par email
   */
  async sendAlert(alert: Alert): Promise<boolean> {
    if (!this.isEnabled()) {
      this.logger.debug(`Alert (disabled): ${alert.type} - ${alert.message}`);
      return false;
    }

    const subject = this.getAlertSubject(alert);
    const html = this.getAlertHtml(alert);

    this.logger.warn(`Sending alert: ${alert.type} - ${alert.message}`);

    return this.mail.sendMail({
      to: this.config.email,
      subject,
      html,
      skipBcc: true, // Pas de BCC pour les alertes systeme
    });
  }

  private getAlertSubject(alert: Alert): string {
    switch (alert.type) {
      case 'SERVICE_DOWN':
        return `[ALERTE] Service ${alert.service} indisponible - Art & Jardin`;
      case 'SERVICE_RECOVERED':
        return `[OK] Service ${alert.service} retabli - Art & Jardin`;
      case 'BACKUP_FAILED':
        return `[ALERTE] Echec backup - Art & Jardin`;
      case 'EMAIL_FAILURES':
        return `[ALERTE] Echecs emails - Art & Jardin`;
      default:
        return `[ALERTE] Art & Jardin`;
    }
  }

  private getAlertHtml(alert: Alert): string {
    const isRecovery = alert.type === 'SERVICE_RECOVERED';
    const headerColor = isRecovery ? '#28a745' : '#dc3545';
    const headerText = isRecovery ? 'SERVICE RETABLI' : 'ALERTE SYSTEME';

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: ${headerColor}; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { padding: 25px; background: #f9f9f9; }
    .alert-box { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid ${headerColor}; margin: 15px 0; }
    .footer { padding: 15px; text-align: center; font-size: 12px; color: #666; background: #eee; border-radius: 0 0 8px 8px; }
    .timestamp { color: #888; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">${headerText}</h1>
    </div>
    <div class="content">
      <div class="alert-box">
        <strong>Type:</strong> ${alert.type}<br>
        ${alert.service ? `<strong>Service:</strong> ${alert.service}<br>` : ''}
        <strong>Message:</strong> ${alert.message}
        ${alert.error ? `<br><br><strong>Erreur:</strong> <code>${alert.error}</code>` : ''}
      </div>
      <p class="timestamp">Date: ${alert.timestamp.toLocaleString('fr-FR')}</p>
    </div>
    <div class="footer">
      <p>Alerte automatique - Art & Jardin</p>
    </div>
  </div>
</body>
</html>
    `;
  }

  /**
   * Recuperer les statistiques des alertes
   */
  async getStats() {
    const downServices = Array.from(this.serviceDownTrackers.values()).filter(
      (t) => t.alertSent,
    );

    return {
      enabled: this.isEnabled(),
      config: this.config,
      currentlyDown: downServices.map((t) => ({
        service: t.service,
        downSince: t.downSince,
        error: t.lastError,
      })),
    };
  }
}
