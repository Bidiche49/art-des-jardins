import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { StorageModule } from '../storage/storage.module';
import { BackupService } from './backup.service';
import { BackupCryptoService } from './backup-crypto.service';
import { BackupController } from './backup.controller';

@Module({
  imports: [DatabaseModule, StorageModule],
  providers: [BackupService, BackupCryptoService],
  controllers: [BackupController],
  exports: [BackupService, BackupCryptoService],
})
export class BackupModule {}
