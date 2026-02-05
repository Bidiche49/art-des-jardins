import { Module } from '@nestjs/common';
import { IntegrationsController } from './integrations.controller';
import { GoogleCalendarService } from './google-calendar.service';
import { MicrosoftCalendarService } from './microsoft-calendar.service';
import { CalendarSyncService } from './calendar-sync.service';
import { DatabaseModule } from '../../database/database.module';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [DatabaseModule, AuditModule],
  controllers: [IntegrationsController],
  providers: [
    GoogleCalendarService,
    MicrosoftCalendarService,
    CalendarSyncService,
  ],
  exports: [
    GoogleCalendarService,
    MicrosoftCalendarService,
    CalendarSyncService,
  ],
})
export class IntegrationsModule {}
