import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { MailService } from './mail.service';
import { EmailHistoryService } from './email-history.service';

@Module({
  imports: [DatabaseModule],
  providers: [MailService, EmailHistoryService],
  exports: [MailService, EmailHistoryService],
})
export class MailModule {}
