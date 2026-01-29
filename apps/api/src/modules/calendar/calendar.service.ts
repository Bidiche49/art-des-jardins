import { Injectable, NotFoundException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import ical, { ICalCalendar, ICalEventStatus } from 'ical-generator';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class CalendarService {
  constructor(private prisma: PrismaService) {}

  async generateIcalToken(userId: string): Promise<string> {
    const token = randomBytes(32).toString('hex');

    await this.prisma.user.update({
      where: { id: userId },
      data: { icalToken: token },
    });

    return token;
  }

  async getIcalToken(userId: string): Promise<string | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { icalToken: true },
    });

    return user?.icalToken || null;
  }

  async getUserByIcalToken(token: string) {
    const user = await this.prisma.user.findUnique({
      where: { icalToken: token },
      select: { id: true, nom: true, prenom: true },
    });

    if (!user) {
      throw new NotFoundException('Token invalide');
    }

    return user;
  }

  async generateIcalFeed(userId: string): Promise<ICalCalendar> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { nom: true, prenom: true },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouve');
    }

    // Get interventions for the next 6 months
    const now = new Date();
    const sixMonthsLater = new Date();
    sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);

    const interventions = await this.prisma.intervention.findMany({
      where: {
        employeId: userId,
        date: {
          gte: new Date(now.getFullYear(), now.getMonth() - 1, 1), // Include last month
          lte: sixMonthsLater,
        },
      },
      include: {
        chantier: {
          include: {
            client: {
              select: { nom: true, prenom: true },
            },
          },
        },
      },
      orderBy: { date: 'asc' },
    });

    const calendar = ical({
      name: `Art & Jardin - ${user.prenom} ${user.nom}`,
      prodId: { company: 'Art & Jardin', product: 'Calendar', language: 'FR' },
      timezone: 'Europe/Paris',
    });

    for (const intervention of interventions) {
      const clientName = intervention.chantier?.client
        ? `${intervention.chantier.client.nom}${intervention.chantier.client.prenom ? ' ' + intervention.chantier.client.prenom : ''}`
        : 'Client';

      const location = intervention.chantier
        ? `${intervention.chantier.adresse}, ${intervention.chantier.codePostal} ${intervention.chantier.ville}`
        : '';

      const startDate = new Date(intervention.heureDebut);
      const endDate = intervention.heureFin
        ? new Date(intervention.heureFin)
        : new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // Default 2h

      calendar.createEvent({
        id: `intervention-${intervention.id}@artjardin.fr`,
        start: startDate,
        end: endDate,
        summary: `${clientName} - ${intervention.description || 'Intervention'}`,
        location,
        description: intervention.notes || undefined,
        status: intervention.valide ? ICalEventStatus.CONFIRMED : ICalEventStatus.TENTATIVE,
      });
    }

    return calendar;
  }

  async revokeIcalToken(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { icalToken: null },
    });
  }
}
