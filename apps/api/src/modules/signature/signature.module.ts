import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SignatureController } from './signature.controller';
import { SignatureService } from './signature.service';
import { MailModule } from '../mail/mail.module';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [
    DatabaseModule,
    MailModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'dev-secret-change-in-production',
        signOptions: {
          expiresIn: '7d', // Token signature valide 7 jours
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [SignatureController],
  providers: [SignatureService],
  exports: [SignatureService],
})
export class SignatureModule {}
