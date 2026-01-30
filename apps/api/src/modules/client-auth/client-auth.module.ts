import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ClientAuthService } from './client-auth.service';
import { ClientAuthController } from './client-auth.controller';
import { ClientAuthGuard } from './guards/client-auth.guard';
import { ClientJwtStrategy } from './strategies/client-jwt.strategy';
import { DatabaseModule } from '../../database/database.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    DatabaseModule,
    MailModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET') || 'dev-secret-change-in-production',
        signOptions: {
          expiresIn: '24h',
        },
      }),
    }),
  ],
  controllers: [ClientAuthController],
  providers: [ClientAuthService, ClientAuthGuard, ClientJwtStrategy],
  exports: [ClientAuthService, ClientAuthGuard],
})
export class ClientAuthModule {}
