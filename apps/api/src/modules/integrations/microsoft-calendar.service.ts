import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../database/prisma.service';
import { Client } from '@microsoft/microsoft-graph-client';
import { ConfidentialClientApplication } from '@azure/msal-node';

interface CalendarEvent {
  summary: string;
  location?: string;
  description?: string;
  start: Date;
  end: Date;
}

@Injectable()
export class MicrosoftCalendarService {
  private readonly logger = new Logger(MicrosoftCalendarService.name);
  private msalClient: ConfidentialClientApplication | null = null;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  private getMsalClient(): ConfidentialClientApplication {
    if (!this.msalClient) {
      const clientId = this.configService.get<string>('MICROSOFT_CLIENT_ID');
      const clientSecret = this.configService.get<string>('MICROSOFT_CLIENT_SECRET');

      if (!clientId || !clientSecret) {
        throw new Error('Microsoft OAuth credentials not configured');
      }

      this.msalClient = new ConfidentialClientApplication({
        auth: {
          clientId,
          clientSecret,
          authority: `https://login.microsoftonline.com/common`,
        },
      });
    }
    return this.msalClient;
  }

  /**
   * Génère l'URL d'autorisation OAuth2
   */
  getAuthUrl(state: string): string {
    const redirectUri = this.configService.get<string>('MICROSOFT_REDIRECT_URI') || '';
    const scopes = [
      'offline_access',
      'Calendars.ReadWrite',
      'User.Read',
    ];

    return `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?` +
      `client_id=${this.configService.get<string>('MICROSOFT_CLIENT_ID')}` +
      `&response_type=code` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=${encodeURIComponent(scopes.join(' '))}` +
      `&state=${state}` +
      `&prompt=consent`;
  }

  /**
   * Échange le code d'autorisation contre des tokens
   */
  async exchangeCodeForTokens(code: string): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresAt: Date;
  }> {
    const redirectUri = this.configService.get<string>('MICROSOFT_REDIRECT_URI') || '';

    const result = await this.getMsalClient().acquireTokenByCode({
      code,
      redirectUri,
      scopes: ['offline_access', 'Calendars.ReadWrite', 'User.Read'],
    });

    if (!result.accessToken) {
      throw new UnauthorizedException('Token manquant dans la réponse Microsoft');
    }

    // MSAL ne retourne pas directement le refresh token, on le récupère via l'API
    // Pour simplifier, on utilise le token d'accès et sa durée de vie
    return {
      accessToken: result.accessToken,
      refreshToken: result.accessToken, // Placeholder - MSAL gère le cache en interne
      expiresAt: result.expiresOn || new Date(Date.now() + 3600 * 1000),
    };
  }

  /**
   * Crée un client Microsoft Graph authentifié
   */
  private async getGraphClient(userId: string): Promise<Client> {
    const integration = await this.prisma.calendarIntegration.findUnique({
      where: { userId_provider: { userId, provider: 'microsoft' } },
    });

    if (!integration) {
      throw new UnauthorizedException('Intégration Microsoft Calendar non configurée');
    }

    // Vérifier si le token a expiré
    if (integration.tokenExpiresAt < new Date()) {
      throw new UnauthorizedException('Token Microsoft expiré, reconnexion requise');
    }

    return Client.init({
      authProvider: (done) => {
        done(null, integration.accessToken);
      },
    });
  }

  /**
   * Crée un événement dans Outlook Calendar
   */
  async createEvent(userId: string, event: CalendarEvent): Promise<string> {
    const client = await this.getGraphClient(userId);

    const integration = await this.prisma.calendarIntegration.findUnique({
      where: { userId_provider: { userId, provider: 'microsoft' } },
    });

    const calendarId = integration?.calendarId || 'primary';
    const endpoint = calendarId === 'primary'
      ? '/me/calendar/events'
      : `/me/calendars/${calendarId}/events`;

    const response = await client.api(endpoint).post({
      subject: event.summary,
      location: event.location ? { displayName: event.location } : undefined,
      body: event.description
        ? { contentType: 'text', content: event.description }
        : undefined,
      start: {
        dateTime: event.start.toISOString(),
        timeZone: 'Europe/Paris',
      },
      end: {
        dateTime: event.end.toISOString(),
        timeZone: 'Europe/Paris',
      },
    });

    this.logger.log(`Event créé: ${response.id}`);
    return response.id;
  }

  /**
   * Met à jour un événement dans Outlook Calendar
   */
  async updateEvent(userId: string, eventId: string, event: CalendarEvent): Promise<void> {
    const client = await this.getGraphClient(userId);

    await client.api(`/me/events/${eventId}`).patch({
      subject: event.summary,
      location: event.location ? { displayName: event.location } : undefined,
      body: event.description
        ? { contentType: 'text', content: event.description }
        : undefined,
      start: {
        dateTime: event.start.toISOString(),
        timeZone: 'Europe/Paris',
      },
      end: {
        dateTime: event.end.toISOString(),
        timeZone: 'Europe/Paris',
      },
    });

    this.logger.log(`Event mis à jour: ${eventId}`);
  }

  /**
   * Supprime un événement dans Outlook Calendar
   */
  async deleteEvent(userId: string, eventId: string): Promise<void> {
    const client = await this.getGraphClient(userId);

    await client.api(`/me/events/${eventId}`).delete();

    this.logger.log(`Event supprimé: ${eventId}`);
  }

  /**
   * Liste les calendriers disponibles
   */
  async listCalendars(userId: string): Promise<{ id: string; name: string; primary: boolean }[]> {
    const client = await this.getGraphClient(userId);

    const response = await client.api('/me/calendars').get();

    return (response.value || []).map((cal: { id: string; name: string; isDefaultCalendar: boolean }) => ({
      id: cal.id,
      name: cal.name || 'Sans nom',
      primary: cal.isDefaultCalendar || false,
    }));
  }

  /**
   * Révoque l'accès et supprime l'intégration
   */
  async disconnect(userId: string): Promise<void> {
    const integration = await this.prisma.calendarIntegration.findUnique({
      where: { userId_provider: { userId, provider: 'microsoft' } },
    });

    if (integration) {
      // Microsoft ne fournit pas d'API de révocation simple
      // On supprime simplement l'intégration
      await this.prisma.calendarIntegration.delete({
        where: { id: integration.id },
      });
    }
  }
}
