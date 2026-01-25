import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { ClientsModule } from './modules/clients/clients.module';
import { ChantiersModule } from './modules/chantiers/chantiers.module';
import { DevisModule } from './modules/devis/devis.module';
import { FacturesModule } from './modules/factures/factures.module';
import { InterventionsModule } from './modules/interventions/interventions.module';
import { AuditModule } from './modules/audit/audit.module';
import { ExportModule } from './modules/export/export.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
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
  ],
})
export class AppModule {}
