import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { TwoFactorService } from './two-factor.service';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { Verify2FADto, Disable2FADto, RegenerateRecoveryCodesDto } from './dto/verify-2fa.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: { sub: string; email: string; role: string };
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private twoFactorService: TwoFactorService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ strict: { ttl: 60000, limit: 5 } }) // 5 requests per minute for login
  @ApiOperation({ summary: 'Login utilisateur (avec support 2FA)' })
  @ApiResponse({ status: 200, description: 'Login reussi ou requires2FA: true' })
  @ApiResponse({ status: 401, description: 'Identifiants invalides' })
  @ApiResponse({ status: 429, description: 'Trop de tentatives' })
  async login(@Body() loginDto: LoginDto & { totpCode?: string }, @Req() req: Request) {
    const ipAddress = req.ip || req.headers['x-forwarded-for']?.toString();
    const userAgent = req.headers['user-agent'];
    return this.authService.login({ ...loginDto, ipAddress, userAgent });
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
  @Throttle({ strict: { ttl: 60000, limit: 5 } })
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
}
