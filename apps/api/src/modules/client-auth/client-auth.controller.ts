import { Controller, Post, Get, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { ClientAuthService } from './client-auth.service';
import { RequestMagicLinkDto } from './dto/request-magic-link.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ClientAuthGuard } from './guards/client-auth.guard';
import { Request } from 'express';

interface ClientRequest extends Request {
  client: { id: string; email: string };
}

@ApiTags('Client Auth')
@Controller('client-auth')
export class ClientAuthController {
  constructor(private readonly clientAuthService: ClientAuthService) {}

  @Post('request-link')
  @Throttle({ strict: { ttl: 60000, limit: 3 } })
  @ApiOperation({ summary: 'Demander un lien de connexion par email' })
  async requestMagicLink(@Body() dto: RequestMagicLinkDto) {
    return this.clientAuthService.requestMagicLink(dto.email);
  }

  @Get('verify/:token')
  @ApiOperation({ summary: 'Vérifier un token et obtenir les credentials' })
  async verifyToken(@Param('token') token: string) {
    return this.clientAuthService.verifyToken(token);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Rafraîchir le token client' })
  async refreshToken(@Body() dto: RefreshTokenDto) {
    return this.clientAuthService.refreshToken(dto.refreshToken);
  }

  @Get('me')
  @UseGuards(ClientAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtenir les infos du client connecté' })
  async getMe(@Req() req: ClientRequest) {
    return this.clientAuthService.getClientFromToken(req.client.id);
  }
}
