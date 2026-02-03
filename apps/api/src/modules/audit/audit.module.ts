import { Module, Global, forwardRef } from '@nestjs/common';
import { AuditController } from './audit.controller';
import { SecurityLogsController } from './security-logs.controller';
import { AuditService } from './audit.service';
import { AlertsModule } from '../alerts/alerts.module';

@Global()
@Module({
  imports: [forwardRef(() => AlertsModule)],
  controllers: [AuditController, SecurityLogsController],
  providers: [AuditService],
  exports: [AuditService],
})
export class AuditModule {}
