import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../database/prisma.service';
import { google, calendar_v3 } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

interface CalendarEvent {
  summary: string;
  location?: string;
  description?: string;
  start: Date;
  end: Date;
}

@Injectable()
export class GoogleCalendarService {
  private readonly logger = new Logger(GoogleCalendarService.name);
  private oauth2Client: OAuth2Client;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.oauth2Client = new google.auth.OAuth2(
      this.configService.get<string>('GOOGLE_CLIENT_ID'),
      this.configService.get<string>('GOOGLE_CLIENT_SECRET'),
      this.configService.get<string>('GOOGLE_REDIRECT_URI'),
    );
  }

  /**
   * Génère l'URL d'autorisation OAuth2
   */
  getAuthUrl(state: string): string {
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.events',
      ],
      prompt: 'consent',
      state,
    });
  }

  /**
   * Échange le code d'autorisation contre des tokens
   */
  async exchangeCodeForTokens(code: string): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresAt: Date;
  }> {
    const { tokens } = await this.oauth2Client.getToken(code);

    if (!tokens.access_token || !tokens.refresh_token) {
      throw new UnauthorizedException('Tokens manquants dans la réponse Google');
    }

    return {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: new Date(tokens.expiry_date || Date.now() + 3600 * 1000),
    };
  }

  /**
   * Configure le client OAuth avec les tokens de l'utilisateur
   */
  private async getAuthenticatedClient(userId: string): Promise<OAuth2Client> {
    const integration = await this.prisma.calendarIntegration.findUnique({
      where: { userId_provider: { userId, provider: 'google' } },
    });

    if (!integration) {
      throw new UnauthorizedException('Intégration Google Calendar non configurée');
    }

    this.oauth2Client.setCredentials({
      access_token: integration.accessToken,
      refresh_token: integration.refreshToken,
      expiry_date: integration.tokenExpiresAt.getTime(),
    });

    // Vérifier si le token a expiré et le rafraîchir si nécessaire
    if (integration.tokenExpiresAt < new Date()) {
      try {
        const { credentials } = await this.oauth2Client.refreshAccessToken();

        await this.prisma.calendarIntegration.update({
          where: { id: integration.id },
          data: {
            accessToken: credentials.access_token!,
            tokenExpiresAt: new Date(credentials.expiry_date || Date.now() + 3600 * 1000),
          },
        });

        this.oauth2Client.setCredentials(credentials);
      } catch (error) {
        this.logger.error('Erreur refresh token Google:', error);
        throw new UnauthorizedException('Token Google expiré, reconnexion requise');
      }
    }

    return this.oauth2Client;
  }

  /**
   * Crée un événement dans Google Calendar
   */
  async createEvent(userId: string, event: CalendarEvent): Promise<string> {
    const auth = await this.getAuthenticatedClient(userId);
    const calendar = google.calendar({ version: 'v3', auth });

    const integration = await this.prisma.calendarIntegration.findUnique({
      where: { userId_provider: { userId, provider: 'google' } },
    });

    const response = await calendar.events.insert({
      calendarId: integration?.calendarId || 'primary',
      requestBody: {
        summary: event.summary,
        location: event.location,
        description: event.description,
        start: { dateTime: event.start.toISOString() },
        end: { dateTime: event.end.toISOString() },
      },
    });

    this.logger.log(`Event créé: ${response.data.id}`);
    return response.data.id!;
  }

  /**
   * Met à jour un événement dans Google Calendar
   */
  async updateEvent(userId: string, eventId: string, event: CalendarEvent): Promise<void> {
    const auth = await this.getAuthenticatedClient(userId);
    const calendar = google.calendar({ version: 'v3', auth });

    const integration = await this.prisma.calendarIntegration.findUnique({
      where: { userId_provider: { userId, provider: 'google' } },
    });

    await calendar.events.update({
      calendarId: integration?.calendarId || 'primary',
      eventId,
      requestBody: {
        summary: event.summary,
        location: event.location,
        description: event.description,
        start: { dateTime: event.start.toISOString() },
        end: { dateTime: event.end.toISOString() },
      },
    });

    this.logger.log(`Event mis à jour: ${eventId}`);
  }

  /**
   * Supprime un événement dans Google Calendar
   */
  async deleteEvent(userId: string, eventId: string): Promise<void> {
    const auth = await this.getAuthenticatedClient(userId);
    const calendar = google.calendar({ version: 'v3', auth });

    const integration = await this.prisma.calendarIntegration.findUnique({
      where: { userId_provider: { userId, provider: 'google' } },
    });

    await calendar.events.delete({
      calendarId: integration?.calendarId || 'primary',
      eventId,
    });

    this.logger.log(`Event supprimé: ${eventId}`);
  }

  /**
   * Liste les calendriers disponibles
   */
  async listCalendars(userId: string): Promise<{ id: string; name: string; primary: boolean }[]> {
    const auth = await this.getAuthenticatedClient(userId);
    const calendar = google.calendar({ version: 'v3', auth });

    const response = await calendar.calendarList.list();

    return (response.data.items || []).map((cal) => ({
      id: cal.id!,
      name: cal.summary || 'Sans nom',
      primary: cal.primary || false,
    }));
  }

  /**
   * Révoque l'accès et supprime l'intégration
   */
  async disconnect(userId: string): Promise<void> {
    const integration = await this.prisma.calendarIntegration.findUnique({
      where: { userId_provider: { userId, provider: 'google' } },
    });

    if (integration) {
      try {
        await this.oauth2Client.revokeToken(integration.accessToken);
      } catch (error) {
        this.logger.warn('Erreur révocation token Google:', error);
      }

      await this.prisma.calendarIntegration.delete({
        where: { id: integration.id },
      });
    }
  }
}
