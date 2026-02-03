import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { StorageModule } from '../storage/storage.module';
import { DocumentArchiveService } from './document-archive.service';
import { DocumentArchiveController } from './document-archive.controller';

@Module({
  imports: [DatabaseModule, StorageModule],
  providers: [DocumentArchiveService],
  controllers: [DocumentArchiveController],
  exports: [DocumentArchiveService],
})
export class DocumentArchiveModule {}
