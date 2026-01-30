import { Module } from '@nestjs/common';
import { MessagingService } from './messaging.service';
import { MessagingController } from './messaging.controller';
import { ClientMessagingController } from './client-messaging.controller';
import { DatabaseModule } from '../../database/database.module';
import { ClientAuthModule } from '../client-auth/client-auth.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [DatabaseModule, ClientAuthModule, AuthModule],
  controllers: [MessagingController, ClientMessagingController],
  providers: [MessagingService],
  exports: [MessagingService],
})
export class MessagingModule {}
