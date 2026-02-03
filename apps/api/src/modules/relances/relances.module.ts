import { Module } from '@nestjs/common';
import { RelancesService } from './relances.service';
import { RelancesCronService } from './relances.cron';
import { RelancesController } from './relances.controller';
import { DatabaseModule } from '../../database/database.module';
import { MailModule } from '../mail/mail.module';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [DatabaseModule, MailModule, AuditModule],
  controllers: [RelancesController],
  providers: [RelancesService, RelancesCronService],
  exports: [RelancesService],
})
export class RelancesModule {}
