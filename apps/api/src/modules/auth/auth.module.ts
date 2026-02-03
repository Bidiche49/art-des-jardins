import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TwoFactorService } from './two-factor.service';
import { DeviceTrackingService } from './device-tracking.service';
import { RefreshTokenService } from './refresh-token.service';
import { GeoIpService } from './geo-ip.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'dev-secret-change-in-production',
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '15m',
        },
      }),
      inject: [ConfigService],
    }),
    forwardRef(() => MailModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, TwoFactorService, DeviceTrackingService, RefreshTokenService, GeoIpService, JwtStrategy],
  exports: [AuthService, TwoFactorService, DeviceTrackingService, RefreshTokenService, GeoIpService],
})
export class AuthModule {}
