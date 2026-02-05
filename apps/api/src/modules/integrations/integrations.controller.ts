import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  Req,
  Res,
  UseGuards,
  HttpCode,
  HttpStatus,
  BadRequestException,
  Body,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PrismaService } from '../../database/prisma.service';
import { GoogleCalendarService } from './google-calendar.service';
import { MicrosoftCalendarService } from './microsoft-calendar.service';
import { AuditService } from '../audit/audit.service';

interface AuthenticatedRequest extends Request {
  user: { sub: string; email: string; role: string };
}

@ApiTags('Integrations')
@Controller('integrations')
export class IntegrationsController {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private googleCalendarService: GoogleCalendarService,
    private microsoftCalendarService: MicrosoftCalendarService,
    private auditService: AuditService,
  ) {}

  // ============================================
  // LIST INTEGRATIONS
  // ============================================

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Liste les intégrations calendrier de l\'utilisateur' })
  @ApiResponse({ status: 200, description: 'Liste des intégrations' })
  async listIntegrations(@Req() req: AuthenticatedRequest) {
    const integrations = await this.prisma.calendarIntegration.findMany({
      where: { userId: req.user.sub },
      select: {
        id: true,
        provider: true,
        calendarId: true,
        syncEnabled: true,
        lastSyncAt: true,
        lastSyncError: true,
        createdAt: true,
      },
    });

    return { integrations };
  }

  // ============================================
  // GOOGLE CALENDAR OAuth
  // ============================================

  @Get('google/auth')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Démarrer l\'authentification Google Calendar' })
  @ApiResponse({ status: 200, description: 'URL d\'autorisation' })
  async googleAuth(@Req() req: AuthenticatedRequest) {
    const state = Buffer.from(JSON.stringify({ userId: req.user.sub })).toString('base64');
    const authUrl = this.googleCalendarService.getAuthUrl(state);

    return { authUrl };
  }

  @Get('google/callback')
  @ApiOperation({ summary: 'Callback OAuth Google Calendar' })
  @ApiQuery({ name: 'code', description: 'Code d\'autorisation' })
  @ApiQuery({ name: 'state', description: 'State JWT' })
  @ApiResponse({ status: 302, description: 'Redirection vers l\'app' })
  async googleCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() res: Response,
  ) {
    const appUrl = this.configService.get<string>('APP_URL') || 'http://localhost:3000';

    try {
      const { userId } = JSON.parse(Buffer.from(state, 'base64').toString());

      const tokens = await this.googleCalendarService.exchangeCodeForTokens(code);

      // Sauvegarder ou mettre à jour l'intégration
      await this.prisma.calendarIntegration.upsert({
        where: { userId_provider: { userId, provider: 'google' } },
        update: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          tokenExpiresAt: tokens.expiresAt,
        },
        create: {
          userId,
          provider: 'google',
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          tokenExpiresAt: tokens.expiresAt,
        },
      });

      await this.auditService.log({
        userId,
        action: 'CALENDAR_CONNECTED',
        entite: 'integration',
        details: { provider: 'google' },
      });

      return res.redirect(`${appUrl}/settings?integration=google&status=success`);
    } catch (error) {
      console.error('Erreur callback Google:', error);
      return res.redirect(`${appUrl}/settings?integration=google&status=error`);
    }
  }

  @Delete('google')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Déconnecter Google Calendar' })
  @ApiResponse({ status: 200, description: 'Déconnecté' })
  async googleDisconnect(@Req() req: AuthenticatedRequest) {
    await this.googleCalendarService.disconnect(req.user.sub);

    await this.auditService.log({
      userId: req.user.sub,
      action: 'CALENDAR_DISCONNECTED',
      entite: 'integration',
      details: { provider: 'google' },
    });

    return { success: true };
  }

  @Get('google/calendars')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Liste les calendriers Google disponibles' })
  @ApiResponse({ status: 200, description: 'Liste des calendriers' })
  async googleListCalendars(@Req() req: AuthenticatedRequest) {
    const calendars = await this.googleCalendarService.listCalendars(req.user.sub);
    return { calendars };
  }

  // ============================================
  // MICROSOFT CALENDAR OAuth
  // ============================================

  @Get('microsoft/auth')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Démarrer l\'authentification Microsoft Calendar' })
  @ApiResponse({ status: 200, description: 'URL d\'autorisation' })
  async microsoftAuth(@Req() req: AuthenticatedRequest) {
    const state = Buffer.from(JSON.stringify({ userId: req.user.sub })).toString('base64');
    const authUrl = this.microsoftCalendarService.getAuthUrl(state);

    return { authUrl };
  }

  @Get('microsoft/callback')
  @ApiOperation({ summary: 'Callback OAuth Microsoft Calendar' })
  @ApiQuery({ name: 'code', description: 'Code d\'autorisation' })
  @ApiQuery({ name: 'state', description: 'State JWT' })
  @ApiResponse({ status: 302, description: 'Redirection vers l\'app' })
  async microsoftCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() res: Response,
  ) {
    const appUrl = this.configService.get<string>('APP_URL') || 'http://localhost:3000';

    try {
      const { userId } = JSON.parse(Buffer.from(state, 'base64').toString());

      const tokens = await this.microsoftCalendarService.exchangeCodeForTokens(code);

      await this.prisma.calendarIntegration.upsert({
        where: { userId_provider: { userId, provider: 'microsoft' } },
        update: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          tokenExpiresAt: tokens.expiresAt,
        },
        create: {
          userId,
          provider: 'microsoft',
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          tokenExpiresAt: tokens.expiresAt,
        },
      });

      await this.auditService.log({
        userId,
        action: 'CALENDAR_CONNECTED',
        entite: 'integration',
        details: { provider: 'microsoft' },
      });

      return res.redirect(`${appUrl}/settings?integration=microsoft&status=success`);
    } catch (error) {
      console.error('Erreur callback Microsoft:', error);
      return res.redirect(`${appUrl}/settings?integration=microsoft&status=error`);
    }
  }

  @Delete('microsoft')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Déconnecter Microsoft Calendar' })
  @ApiResponse({ status: 200, description: 'Déconnecté' })
  async microsoftDisconnect(@Req() req: AuthenticatedRequest) {
    await this.microsoftCalendarService.disconnect(req.user.sub);

    await this.auditService.log({
      userId: req.user.sub,
      action: 'CALENDAR_DISCONNECTED',
      entite: 'integration',
      details: { provider: 'microsoft' },
    });

    return { success: true };
  }

  @Get('microsoft/calendars')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Liste les calendriers Microsoft disponibles' })
  @ApiResponse({ status: 200, description: 'Liste des calendriers' })
  async microsoftListCalendars(@Req() req: AuthenticatedRequest) {
    const calendars = await this.microsoftCalendarService.listCalendars(req.user.sub);
    return { calendars };
  }

  // ============================================
  // SETTINGS
  // ============================================

  @Post(':provider/settings')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mettre à jour les paramètres d\'intégration' })
  @ApiParam({ name: 'provider', enum: ['google', 'microsoft'] })
  @ApiResponse({ status: 200, description: 'Paramètres mis à jour' })
  async updateSettings(
    @Req() req: AuthenticatedRequest,
    @Param('provider') provider: 'google' | 'microsoft',
    @Body() body: { calendarId?: string; syncEnabled?: boolean },
  ) {
    const integration = await this.prisma.calendarIntegration.findUnique({
      where: { userId_provider: { userId: req.user.sub, provider } },
    });

    if (!integration) {
      throw new BadRequestException('Intégration non trouvée');
    }

    const updated = await this.prisma.calendarIntegration.update({
      where: { id: integration.id },
      data: {
        calendarId: body.calendarId ?? integration.calendarId,
        syncEnabled: body.syncEnabled ?? integration.syncEnabled,
      },
    });

    return {
      id: updated.id,
      provider: updated.provider,
      calendarId: updated.calendarId,
      syncEnabled: updated.syncEnabled,
    };
  }
}
