import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { StorageModule } from '../storage/storage.module';
import { BackupService } from './backup.service';
import { BackupController } from './backup.controller';

@Module({
  imports: [DatabaseModule, StorageModule],
  providers: [BackupService],
  controllers: [BackupController],
  exports: [BackupService],
})
export class BackupModule {}
