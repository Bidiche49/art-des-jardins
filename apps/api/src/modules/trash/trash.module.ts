import { Module } from '@nestjs/common';
import { TrashService } from './trash.service';
import { TrashController } from './trash.controller';
import { DatabaseModule } from '../../database/database.module';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [DatabaseModule, AuditModule],
  controllers: [TrashController],
  providers: [TrashService],
  exports: [TrashService],
})
export class TrashModule {}
