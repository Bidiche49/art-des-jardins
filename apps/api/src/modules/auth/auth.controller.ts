import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Req, Get, Param, Delete, Res, Query, BadRequestException, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { TwoFactorService } from './two-factor.service';
import { DeviceTrackingService } from './device-tracking.service';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { Verify2FADto, Disable2FADto, RegenerateRecoveryCodesDto } from './dto/verify-2fa.dto';
import { DeviceListQueryDto, DeviceDto, DeviceListResponseDto } from './dto/device.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from './decorators/public.decorator';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

interface AuthenticatedRequest extends Request {
  user: { sub: string; email: string; role: string };
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private twoFactorService: TwoFactorService,
    private deviceTrackingService: DeviceTrackingService,
    private configService: ConfigService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ strict: { ttl: 60000, limit: 10 } }) // 10 requests per minute for auth endpoints
  @ApiOperation({ summary: 'Login utilisateur (avec support 2FA)' })
  @ApiResponse({ status: 200, description: 'Login reussi ou requires2FA: true' })
  @ApiResponse({ status: 401, description: 'Identifiants invalides' })
  @ApiResponse({ status: 429, description: 'Trop de tentatives' })
  async login(@Body() loginDto: LoginDto & { totpCode?: string }, @Req() req: Request) {
    const ipAddress = req.ip || req.headers['x-forwarded-for']?.toString();
    const userAgent = req.headers['user-agent'];
    const acceptLanguage = req.headers['accept-language'];
    return this.authService.login({ ...loginDto, ipAddress, userAgent, acceptLanguage });
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Rafraichir le token' })
  @ApiResponse({ status: 200, description: 'Tokens rafraichis' })
  @ApiResponse({ status: 401, description: 'Token invalide' })
  async refresh(@Body() refreshDto: RefreshDto, @Req() req: Request) {
    const ipAddress = req.ip || req.headers['x-forwarded-for']?.toString();
    const userAgent = req.headers['user-agent'];
    return this.authService.refresh(refreshDto.refreshToken, ipAddress, userAgent);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Deconnecter utilisateur' })
  @ApiResponse({ status: 200, description: 'Deconnecte' })
  async logout(@Req() req: AuthenticatedRequest) {
    const ipAddress = req.ip || req.headers['x-forwarded-for']?.toString();
    const userAgent = req.headers['user-agent'];
    return this.authService.logout(req.user.sub, ipAddress, userAgent);
  }

  // ============================================
  // 2FA ENDPOINTS
  // ============================================

  @Post('2fa/setup')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Initialiser la configuration 2FA' })
  @ApiResponse({ status: 200, description: 'QR code et secret générés' })
  @ApiResponse({ status: 400, description: '2FA déjà activé' })
  async setup2FA(@Req() req: AuthenticatedRequest) {
    return this.twoFactorService.setup2FA(req.user.sub);
  }

  @Post('2fa/verify')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Throttle({ strict: { ttl: 60000, limit: 10 } }) // 10 requests per minute for auth endpoints
  @ApiOperation({ summary: 'Vérifier le code 2FA et activer' })
  @ApiResponse({ status: 200, description: '2FA activé, codes de récupération fournis' })
  @ApiResponse({ status: 400, description: 'Code invalide ou 2FA non configuré' })
  async verify2FA(@Req() req: AuthenticatedRequest, @Body() dto: Verify2FADto) {
    const ipAddress = req.ip || req.headers['x-forwarded-for']?.toString();
    const userAgent = req.headers['user-agent'];
    return this.twoFactorService.verify2FASetup(req.user.sub, dto.token, ipAddress, userAgent);
  }

  @Post('2fa/disable')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Désactiver le 2FA' })
  @ApiResponse({ status: 200, description: '2FA désactivé' })
  @ApiResponse({ status: 400, description: '2FA non activé' })
  @ApiResponse({ status: 401, description: 'Code 2FA invalide' })
  async disable2FA(@Req() req: AuthenticatedRequest, @Body() dto: Disable2FADto) {
    const ipAddress = req.ip || req.headers['x-forwarded-for']?.toString();
    const userAgent = req.headers['user-agent'];
    return this.twoFactorService.disable2FA(req.user.sub, dto.token, ipAddress, userAgent);
  }

  @Post('2fa/recovery-codes')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Régénérer les codes de récupération' })
  @ApiResponse({ status: 200, description: 'Nouveaux codes de récupération générés' })
  @ApiResponse({ status: 400, description: '2FA non activé' })
  @ApiResponse({ status: 401, description: 'Code 2FA invalide' })
  async regenerateRecoveryCodes(@Req() req: AuthenticatedRequest, @Body() dto: RegenerateRecoveryCodesDto) {
    return this.twoFactorService.regenerateRecoveryCodes(req.user.sub, dto.token);
  }

  @Post('2fa/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Vérifier le statut 2FA' })
  @ApiResponse({ status: 200, description: 'Statut 2FA' })
  async get2FAStatus(@Req() req: AuthenticatedRequest) {
    const [enabled, required] = await Promise.all([
      this.twoFactorService.is2FAEnabled(req.user.sub),
      this.twoFactorService.is2FARequired(req.user.sub),
    ]);
    return { enabled, required };
  }

  // ============================================
  // DEVICE MANAGEMENT ENDPOINTS
  // ============================================

  @Get('devices')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lister les appareils connus de l\'utilisateur avec pagination' })
  @ApiResponse({ status: 200, description: 'Liste paginee des appareils', type: DeviceListResponseDto })
  async getDevices(
    @Req() req: AuthenticatedRequest & { headers: { 'user-agent'?: string; 'accept-language'?: string } },
    @Query() query: DeviceListQueryDto,
  ): Promise<DeviceListResponseDto> {
    const userId = req.user.sub;
    const userAgent = req.headers['user-agent'] || '';
    const acceptLanguage = req.headers['accept-language'];

    // Genere le fingerprint de la requete actuelle
    const currentFingerprint = this.deviceTrackingService.generateFingerprint(userAgent, acceptLanguage);

    const { devices, total } = await this.deviceTrackingService.getDevicesPaginated(
      userId,
      query.limit || 20,
      query.offset || 0,
    );

    // Transforme les devices en DeviceDto avec isCurrent
    const mappedDevices: DeviceDto[] = devices.map((device) => ({
      id: device.id,
      name: device.deviceName,
      lastIp: device.lastIp,
      lastCountry: device.lastCountry,
      lastCity: device.lastCity,
      lastUsedAt: device.lastSeenAt,
      trustedAt: device.trustedAt,
      isCurrent: device.fingerprint === currentFingerprint,
      createdAt: device.createdAt,
    }));

    return { devices: mappedDevices, total };
  }

  @Get('devices/:deviceId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtenir les details d\'un appareil specifique' })
  @ApiParam({ name: 'deviceId', description: 'ID de l\'appareil' })
  @ApiResponse({ status: 200, description: 'Details de l\'appareil', type: DeviceDto })
  @ApiResponse({ status: 404, description: 'Appareil non trouve' })
  async getDevice(
    @Req() req: AuthenticatedRequest & { headers: { 'user-agent'?: string; 'accept-language'?: string } },
    @Param('deviceId') deviceId: string,
  ): Promise<DeviceDto> {
    const userId = req.user.sub;
    const userAgent = req.headers['user-agent'] || '';
    const acceptLanguage = req.headers['accept-language'];

    const device = await this.deviceTrackingService.getDeviceById(userId, deviceId);

    if (!device) {
      throw new NotFoundException('Appareil non trouve');
    }

    const currentFingerprint = this.deviceTrackingService.generateFingerprint(userAgent, acceptLanguage);

    return {
      id: device.id,
      name: device.deviceName,
      lastIp: device.lastIp,
      lastCountry: device.lastCountry,
      lastCity: device.lastCity,
      lastUsedAt: device.lastSeenAt,
      trustedAt: device.trustedAt,
      isCurrent: device.fingerprint === currentFingerprint,
      createdAt: device.createdAt,
    };
  }

  @Delete('devices/:deviceId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Revoquer un appareil (supprime aussi les sessions associees)' })
  @ApiParam({ name: 'deviceId', description: 'ID de l\'appareil a revoquer' })
  @ApiResponse({ status: 200, description: 'Appareil revoque' })
  @ApiResponse({ status: 400, description: 'Impossible de revoquer l\'appareil actuel' })
  @ApiResponse({ status: 404, description: 'Appareil non trouve' })
  async deleteDevice(
    @Req() req: AuthenticatedRequest & { headers: { 'user-agent'?: string; 'accept-language'?: string } },
    @Param('deviceId') deviceId: string,
  ) {
    const userId = req.user.sub;
    const userAgent = req.headers['user-agent'] || '';
    const acceptLanguage = req.headers['accept-language'];

    // Genere le fingerprint de la requete actuelle
    const currentFingerprint = this.deviceTrackingService.generateFingerprint(userAgent, acceptLanguage);

    const result = await this.deviceTrackingService.revokeDevice(userId, deviceId, currentFingerprint);

    if (!result.success) {
      if (result.error === 'cannot_revoke_current_device') {
        throw new BadRequestException('Impossible de revoquer l\'appareil actuel');
      }
      throw new NotFoundException('Appareil non trouve');
    }

    return { success: true, message: 'Appareil revoque' };
  }

  // ============================================
  // DEVICE ACTION ENDPOINTS (from email links)
  // ============================================

  @Get('device/trust/:token')
  @Public()
  @ApiOperation({ summary: 'Valider un appareil (lien email)' })
  @ApiParam({ name: 'token', description: 'Token JWT d\'action' })
  @ApiResponse({ status: 302, description: 'Redirection vers page de confirmation' })
  @ApiResponse({ status: 400, description: 'Token invalide ou expire' })
  async trustDevice(@Param('token') token: string, @Res() res: Response) {
    const payload = this.deviceTrackingService.validateActionToken(token);

    if (!payload || payload.action !== 'trust') {
      const appUrl = this.configService.get<string>('APP_URL') || 'http://localhost:3000';
      return res.redirect(`${appUrl}/auth/device-action?status=error&message=token_invalid`);
    }

    const success = await this.deviceTrackingService.trustDevice(payload.deviceId, payload.userId);

    const appUrl = this.configService.get<string>('APP_URL') || 'http://localhost:3000';
    if (success) {
      return res.redirect(`${appUrl}/auth/device-action?status=trusted&message=device_trusted`);
    } else {
      return res.redirect(`${appUrl}/auth/device-action?status=error&message=device_not_found`);
    }
  }

  @Get('device/revoke/:token')
  @Public()
  @ApiOperation({ summary: 'Revoquer un appareil et deconnecter toutes les sessions (lien email)' })
  @ApiParam({ name: 'token', description: 'Token JWT d\'action' })
  @ApiResponse({ status: 302, description: 'Redirection vers page de login' })
  @ApiResponse({ status: 400, description: 'Token invalide ou expire' })
  async revokeDevice(@Param('token') token: string, @Res() res: Response) {
    const payload = this.deviceTrackingService.validateActionToken(token);

    if (!payload || payload.action !== 'revoke') {
      const appUrl = this.configService.get<string>('APP_URL') || 'http://localhost:3000';
      return res.redirect(`${appUrl}/auth/device-action?status=error&message=token_invalid`);
    }

    const success = await this.deviceTrackingService.revokeDeviceAndSessions(payload.deviceId, payload.userId);

    const appUrl = this.configService.get<string>('APP_URL') || 'http://localhost:3000';
    if (success) {
      return res.redirect(`${appUrl}/login?status=revoked&message=sessions_revoked`);
    } else {
      return res.redirect(`${appUrl}/auth/device-action?status=error&message=device_not_found`);
    }
  }
}
