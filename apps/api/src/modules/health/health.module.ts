import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { DatabaseModule } from '../../database/database.module';
import { StorageModule } from '../storage/storage.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [DatabaseModule, StorageModule, MailModule],
  controllers: [HealthController],
  providers: [HealthService],
  exports: [HealthService],
})
export class HealthModule {}
