import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { GoogleCalendarService } from './google-calendar.service';
import { MicrosoftCalendarService } from './microsoft-calendar.service';
import { Intervention, Chantier, Client, CalendarIntegration } from '@prisma/client';

type InterventionWithRelations = Intervention & {
  chantier: Chantier & {
    client: Client;
  };
};

@Injectable()
export class CalendarSyncService {
  private readonly logger = new Logger(CalendarSyncService.name);

  constructor(
    private prisma: PrismaService,
    private googleCalendarService: GoogleCalendarService,
    private microsoftCalendarService: MicrosoftCalendarService,
  ) {}

  /**
   * Synchronise une intervention vers les calendriers externes
   */
  async syncIntervention(intervention: InterventionWithRelations): Promise<void> {
    const integrations = await this.prisma.calendarIntegration.findMany({
      where: {
        userId: intervention.employeId,
        syncEnabled: true,
      },
    });

    for (const integration of integrations) {
      try {
        await this.syncToProvider(integration, intervention);
      } catch (error) {
        this.logger.error(
          `Erreur sync ${integration.provider} pour intervention ${intervention.id}:`,
          error,
        );

        await this.prisma.calendarIntegration.update({
          where: { id: integration.id },
          data: {
            lastSyncError: error instanceof Error ? error.message : 'Erreur inconnue',
          },
        });
      }
    }
  }

  /**
   * Synchronise vers un provider spécifique
   */
  private async syncToProvider(
    integration: CalendarIntegration,
    intervention: InterventionWithRelations,
  ): Promise<void> {
    const event = this.buildCalendarEvent(intervention);
    const service = integration.provider === 'google'
      ? this.googleCalendarService
      : this.microsoftCalendarService;

    if (intervention.externalCalendarEventId) {
      // Mise à jour
      await service.updateEvent(
        integration.userId,
        intervention.externalCalendarEventId,
        event,
      );
    } else {
      // Création
      const eventId = await service.createEvent(integration.userId, event);

      await this.prisma.intervention.update({
        where: { id: intervention.id },
        data: { externalCalendarEventId: eventId },
      });
    }

    // Marquer comme synchronisé
    await this.prisma.calendarIntegration.update({
      where: { id: integration.id },
      data: {
        lastSyncAt: new Date(),
        lastSyncError: null,
      },
    });
  }

  /**
   * Supprime un événement des calendriers externes
   */
  async deleteInterventionEvent(
    interventionId: string,
    employeId: string,
    externalEventId: string,
  ): Promise<void> {
    const integrations = await this.prisma.calendarIntegration.findMany({
      where: {
        userId: employeId,
        syncEnabled: true,
      },
    });

    for (const integration of integrations) {
      try {
        const service = integration.provider === 'google'
          ? this.googleCalendarService
          : this.microsoftCalendarService;

        await service.deleteEvent(integration.userId, externalEventId);
      } catch (error) {
        this.logger.error(
          `Erreur suppression event ${integration.provider} pour intervention ${interventionId}:`,
          error,
        );
      }
    }
  }

  /**
   * Construit l'objet événement à partir d'une intervention
   */
  private buildCalendarEvent(intervention: InterventionWithRelations) {
    const clientName = intervention.chantier.client.nom +
      (intervention.chantier.client.prenom ? ` ${intervention.chantier.client.prenom}` : '');

    const address = [
      intervention.chantier.adresse,
      intervention.chantier.codePostal,
      intervention.chantier.ville,
    ].filter(Boolean).join(', ');

    const endTime = intervention.heureFin ||
      new Date(intervention.heureDebut.getTime() + (intervention.dureeMinutes || 60) * 60 * 1000);

    return {
      summary: `🌿 ${clientName} - ${intervention.description || 'Intervention'}`,
      location: address,
      description: [
        `Client: ${clientName}`,
        `Adresse: ${address}`,
        intervention.description ? `\nDescription: ${intervention.description}` : '',
        intervention.notes ? `\nNotes: ${intervention.notes}` : '',
        '\n---',
        'Art & Jardin',
      ].join('\n'),
      start: intervention.heureDebut,
      end: endTime,
    };
  }

  /**
   * Force la resynchronisation de toutes les interventions d'un utilisateur
   */
  async resyncAllInterventions(userId: string): Promise<{ synced: number; errors: number }> {
    const interventions = await this.prisma.intervention.findMany({
      where: {
        employeId: userId,
        deletedAt: null,
        date: { gte: new Date() }, // Seulement les futures
      },
      include: {
        chantier: {
          include: {
            client: true,
          },
        },
      },
    });

    let synced = 0;
    let errors = 0;

    for (const intervention of interventions) {
      try {
        await this.syncIntervention(intervention);
        synced++;
      } catch {
        errors++;
      }
    }

    return { synced, errors };
  }
}
