import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { Request } from 'express';
import { SignatureService } from './signature.service';
import { SendSignatureRequestDto, SignDevisDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { UserRole } from '@art-et-jardin/database';

@ApiTags('Signature')
@Controller()
export class SignatureController {
  constructor(private readonly signatureService: SignatureService) {}

  // ============================================
  // ENDPOINTS PROTEGES (authentification requise)
  // ============================================

  @Post('devis/:id/send-for-signature')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.patron)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Envoyer une demande de signature par email' })
  @ApiParam({ name: 'id', description: 'ID du devis' })
  @ApiResponse({ status: 200, description: 'Demande envoyee' })
  @ApiResponse({ status: 400, description: 'Devis deja signe ou statut invalide' })
  @ApiResponse({ status: 404, description: 'Devis non trouve' })
  async sendSignatureRequest(
    @Param('id') devisId: string,
    @Body() dto: SendSignatureRequestDto,
  ) {
    return this.signatureService.sendSignatureRequest(devisId, dto);
  }

  // ============================================
  // ENDPOINTS PUBLICS (pas d'authentification)
  // ============================================

  @Get('signature/:token')
  @Public()
  @ApiOperation({ summary: 'Recuperer les details du devis pour signature' })
  @ApiParam({ name: 'token', description: 'Token de signature' })
  @ApiResponse({ status: 200, description: 'Details du devis' })
  @ApiResponse({ status: 403, description: 'Token expire' })
  @ApiResponse({ status: 404, description: 'Token invalide' })
  async getDevisForSignature(@Param('token') token: string) {
    return this.signatureService.getDevisForSignature(token);
  }

  @Post('signature/:token/sign')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Signer le devis' })
  @ApiParam({ name: 'token', description: 'Token de signature' })
  @ApiResponse({ status: 200, description: 'Devis signe' })
  @ApiResponse({ status: 400, description: 'Devis deja signe ou CGV non acceptees' })
  @ApiResponse({ status: 403, description: 'Token expire' })
  @ApiResponse({ status: 404, description: 'Token invalide' })
  async signDevis(
    @Param('token') token: string,
    @Body() dto: SignDevisDto,
    @Req() req: Request,
  ) {
    const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';
    const userAgent = req.get('user-agent') || 'unknown';

    return this.signatureService.signDevis(token, dto, ipAddress, userAgent);
  }
}
