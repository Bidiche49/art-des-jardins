import { Module } from '@nestjs/common';
import { ClientPortalController } from './client-portal.controller';
import { ClientPortalService } from './client-portal.service';
import { DatabaseModule } from '../../database/database.module';
import { ClientAuthModule } from '../client-auth/client-auth.module';

@Module({
  imports: [DatabaseModule, ClientAuthModule],
  controllers: [ClientPortalController],
  providers: [ClientPortalService],
  exports: [ClientPortalService],
})
export class ClientPortalModule {}
