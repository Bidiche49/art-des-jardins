import { Module } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { AlertsCronService } from './alerts.cron';
import { AlertsController } from './alerts.controller';
import { SecurityAlertService } from './security-alert.service';
import { DatabaseModule } from '../../database/database.module';
import { MailModule } from '../mail/mail.module';
import { HealthModule } from '../health/health.module';

@Module({
  imports: [DatabaseModule, MailModule, HealthModule],
  controllers: [AlertsController],
  providers: [AlertsService, AlertsCronService, SecurityAlertService],
  exports: [AlertsService, SecurityAlertService],
})
export class AlertsModule {}
