import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { NotificationsCronService } from './notifications.cron';
import { InAppNotificationsController } from './in-app-notifications.controller';
import { InAppNotificationsService } from './in-app-notifications.service';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule, ConfigModule],
  controllers: [NotificationsController, InAppNotificationsController],
  providers: [NotificationsService, NotificationsCronService, InAppNotificationsService],
  exports: [NotificationsService, NotificationsCronService, InAppNotificationsService],
})
export class NotificationsModule {}
