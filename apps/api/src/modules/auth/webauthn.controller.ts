import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Request } from 'express';
import { WebAuthnService } from './webauthn.service';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import {
  WebAuthnRegisterVerifyDto,
  WebAuthnLoginOptionsDto,
  WebAuthnLoginVerifyDto,
  WebAuthnCredentialDto,
  WebAuthnRegisterSuccessDto,
} from './dto/webauthn.dto';

interface AuthenticatedRequest extends Request {
  user: { sub: string; email: string; role: string };
}

@ApiTags('WebAuthn')
@Controller('auth/webauthn')
export class WebAuthnController {
  constructor(
    private webAuthnService: WebAuthnService,
    private authService: AuthService,
  ) {}

  // ============================================
  // REGISTRATION ENDPOINTS (require authentication)
  // ============================================

  @Get('register/options')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtenir les options d\'enregistrement WebAuthn' })
  @ApiResponse({ status: 200, description: 'Options d\'enregistrement générées' })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  async getRegisterOptions(@Req() req: AuthenticatedRequest) {
    return this.webAuthnService.startRegistration(req.user.sub);
  }

  @Post('register/verify')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Vérifier et enregistrer un credential WebAuthn' })
  @ApiResponse({ status: 200, description: 'Credential enregistré', type: WebAuthnRegisterSuccessDto })
  @ApiResponse({ status: 400, description: 'Vérification échouée' })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  async verifyRegistration(
    @Req() req: AuthenticatedRequest,
    @Body() dto: WebAuthnRegisterVerifyDto,
  ): Promise<WebAuthnRegisterSuccessDto> {
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(dto.response);
    } catch {
      throw new BadRequestException('Format de réponse invalide');
    }
    return this.webAuthnService.finishRegistration(req.user.sub, parsedResponse, dto.deviceName);
  }

  // ============================================
  // AUTHENTICATION ENDPOINTS (public)
  // ============================================

  @Get('login/options')
  @Throttle({ default: { ttl: 60000, limit: 10 } })
  @ApiOperation({ summary: 'Obtenir les options d\'authentification WebAuthn' })
  @ApiResponse({ status: 200, description: 'Options d\'authentification générées' })
  @ApiResponse({ status: 400, description: 'Aucun appareil enregistré pour cet email' })
  @ApiResponse({ status: 429, description: 'Trop de requêtes' })
  async getLoginOptions(@Query() dto: WebAuthnLoginOptionsDto) {
    return this.webAuthnService.startAuthentication(dto.email);
  }

  @Post('login/verify')
  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Vérifier l\'authentification WebAuthn et obtenir les tokens' })
  @ApiResponse({ status: 200, description: 'Authentification réussie, tokens JWT fournis' })
  @ApiResponse({ status: 400, description: 'Challenge expiré ou invalide' })
  @ApiResponse({ status: 401, description: 'Authentification échouée' })
  @ApiResponse({ status: 429, description: 'Trop de tentatives' })
  async verifyLogin(@Body() dto: WebAuthnLoginVerifyDto, @Req() req: Request) {
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(dto.response);
    } catch {
      throw new BadRequestException('Format de réponse invalide');
    }

    // Verify the WebAuthn response and get the userId
    const { userId } = await this.webAuthnService.finishAuthentication(parsedResponse);

    // Generate JWT tokens like a normal login
    const ipAddress = req.ip || req.headers['x-forwarded-for']?.toString();
    const userAgent = req.headers['user-agent'];
    const acceptLanguage = req.headers['accept-language'];

    return this.authService.generateTokensForUser(userId, ipAddress, userAgent, acceptLanguage);
  }

  // ============================================
  // CREDENTIAL MANAGEMENT ENDPOINTS (require authentication)
  // ============================================

  @Get('credentials')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lister les credentials WebAuthn de l\'utilisateur' })
  @ApiResponse({ status: 200, description: 'Liste des credentials', type: [WebAuthnCredentialDto] })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  async getCredentials(@Req() req: AuthenticatedRequest): Promise<WebAuthnCredentialDto[]> {
    return this.webAuthnService.getUserCredentials(req.user.sub);
  }

  @Delete('credentials/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Supprimer un credential WebAuthn' })
  @ApiParam({ name: 'id', description: 'ID du credential à supprimer' })
  @ApiResponse({ status: 200, description: 'Credential supprimé' })
  @ApiResponse({ status: 400, description: 'Credential non trouvé ou non autorisé' })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  async deleteCredential(
    @Req() req: AuthenticatedRequest,
    @Param('id') credentialId: string,
  ) {
    return this.webAuthnService.deleteCredential(req.user.sub, credentialId);
  }
}
