import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { FinanceReportsService } from './finance-reports.service';
import { FinanceReportsController } from './finance-reports.controller';
import { DatabaseModule } from '../../database/database.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [AnalyticsController, FinanceReportsController],
  providers: [AnalyticsService, FinanceReportsService],
  exports: [AnalyticsService, FinanceReportsService],
})
export class AnalyticsModule {}
