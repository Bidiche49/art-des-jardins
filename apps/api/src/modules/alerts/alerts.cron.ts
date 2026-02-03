import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AlertsService } from './alerts.service';

@Injectable()
export class AlertsCronService implements OnModuleInit {
  private readonly logger = new Logger(AlertsCronService.name);

  constructor(private alertsService: AlertsService) {}

  onModuleInit() {
    if (this.alertsService.isEnabled()) {
      this.logger.log('Alerts cron enabled - checking services every minute');
    }
  }

  /**
   * Verifie l'etat des services toutes les minutes
   */
  @Cron('* * * * *', {
    name: 'service-health-check',
    timeZone: 'Europe/Paris',
  })
  async checkServicesHealth() {
    if (!this.alertsService.isEnabled()) {
      return;
    }

    try {
      await this.alertsService.checkAndAlert();
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Health check cron failed: ${err.message}`, err.stack);
    }
  }

  /**
   * Trigger manuel pour tests
   */
  async triggerManual() {
    return this.alertsService.checkAndAlert();
  }
}
