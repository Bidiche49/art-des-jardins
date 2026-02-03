import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { CustomThrottlerGuard } from './common/guards/custom-throttler.guard';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerModule } from 'nestjs-pino';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { ClientsModule } from './modules/clients/clients.module';
import { ChantiersModule } from './modules/chantiers/chantiers.module';
import { DevisModule } from './modules/devis/devis.module';
import { FacturesModule } from './modules/factures/factures.module';
import { InterventionsModule } from './modules/interventions/interventions.module';
import { AuditModule } from './modules/audit/audit.module';
import { ExportModule } from './modules/export/export.module';
import { StorageModule } from './modules/storage/storage.module';
import { PdfModule } from './modules/pdf/pdf.module';
import { SignatureModule } from './modules/signature/signature.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AbsencesModule } from './modules/absences/absences.module';
import { CalendarModule } from './modules/calendar/calendar.module';
import { ClientAuthModule } from './modules/client-auth/client-auth.module';
import { ClientPortalModule } from './modules/client-portal/client-portal.module';
import { MessagingModule } from './modules/messaging/messaging.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { BackupModule } from './modules/backup/backup.module';
import { DocumentArchiveModule } from './modules/document-archive/document-archive.module';
import { AutoSendModule } from './modules/auto-send/auto-send.module';
import { RelancesModule } from './modules/relances/relances.module';
import { AlertsModule } from './modules/alerts/alerts.module';
import { TrashModule } from './modules/trash/trash.module';
import { WebsocketModule } from './modules/websocket/websocket.module';
import { TimeEntriesModule } from './modules/time-entries/time-entries.module';
import { MaterialUsagesModule } from './modules/material-usages/material-usages.module';
import { RentabiliteModule } from './modules/rentabilite/rentabilite.module';
import { PhotosModule } from './modules/photos/photos.module';
import { DatabaseModule } from './database/database.module';
import { envValidationSchema } from './config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        `.env.${process.env.NODE_ENV || 'development'}`,
        '.env.local',
        '.env',
        // Monorepo root paths
        `../../.env.${process.env.NODE_ENV || 'development'}`,
        '../../.env.local',
        '../../.env',
      ],
      validationSchema: envValidationSchema,
      validationOptions: {
        abortEarly: true, // Stop on first error
        allowUnknown: true, // Allow env vars not in schema
      },
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          {
            name: 'default',
            ttl: (config.get('THROTTLE_TTL') || 60) * 1000, // Convert to ms
            limit: config.get('THROTTLE_LIMIT') || 100,
          },
          {
            name: 'strict',
            ttl: 60000, // 1 minute
            limit: 5, // 5 requests per minute for login
          },
        ],
      }),
    }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const isProduction = config.get('NODE_ENV') === 'production';
        return {
          pinoHttp: {
            level: config.get('LOG_LEVEL') || 'info',
            transport: isProduction
              ? undefined // JSON in production
              : { target: 'pino-pretty', options: { colorize: true, singleLine: true } },
            autoLogging: true,
            customProps: () => ({ context: 'HTTP' }),
            customLogLevel: (req, res, err) => {
              if (res.statusCode >= 500 || err) return 'error';
              if (res.statusCode >= 400) return 'warn';
              return 'info';
            },
            customSuccessMessage: (req, res) => {
              return `${req.method} ${req.url} - ${res.statusCode}`;
            },
            customErrorMessage: (req, res, err) => {
              return `${req.method} ${req.url} - ${res.statusCode} - ${err.message}`;
            },
          },
        };
      },
    }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    HealthModule,
    AuthModule,
    ClientsModule,
    ChantiersModule,
    DevisModule,
    FacturesModule,
    InterventionsModule,
    AuditModule,
    ExportModule,
    StorageModule,
    PdfModule,
    SignatureModule,
    NotificationsModule,
    AbsencesModule,
    CalendarModule,
    ClientAuthModule,
    ClientPortalModule,
    MessagingModule,
    AnalyticsModule,
    BackupModule,
    DocumentArchiveModule,
    AutoSendModule,
    RelancesModule,
    AlertsModule,
    TrashModule,
    WebsocketModule,
    TimeEntriesModule,
    MaterialUsagesModule,
    RentabiliteModule,
    PhotosModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
  ],
})
export class AppModule {}
