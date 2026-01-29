import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotificationsService } from './notifications.service';
import { PrismaService } from '../../database/prisma.service';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

@Injectable()
export class NotificationsCronService {
  private readonly logger = new Logger(NotificationsCronService.name);

  constructor(
    private notificationsService: NotificationsService,
    private prisma: PrismaService,
  ) {}

  /**
   * Morning reminder at 8:00 AM for today's interventions
   */
  @Cron('0 8 * * *', {
    name: 'morning-interventions-reminder',
    timeZone: 'Europe/Paris',
  })
  async sendMorningReminder() {
    this.logger.log('Running morning interventions reminder cron job');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const interventions = await this.prisma.intervention.findMany({
      where: {
        date: {
          gte: today,
          lt: tomorrow,
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
        employe: {
          select: { id: true, nom: true, prenom: true },
        },
      },
      orderBy: { heureDebut: 'asc' },
    });

    if (interventions.length === 0) {
      this.logger.log('No interventions today');
      return;
    }

    // Group by employee
    const byEmployee = new Map<string | null, typeof interventions>();

    for (const intervention of interventions) {
      const employeId = intervention.employeId;
      if (!byEmployee.has(employeId)) {
        byEmployee.set(employeId, []);
      }
      byEmployee.get(employeId)!.push(intervention);
    }

    // Send notifications
    for (const [employeId, empInterventions] of byEmployee) {
      const count = empInterventions.length;
      const firstIntervention = empInterventions[0];
      const heure = format(firstIntervention.heureDebut, 'HH:mm', { locale: fr });
      const clientNom = firstIntervention.chantier.client.nom;

      let body: string;
      if (count === 1) {
        body = `${heure} - ${clientNom} (${firstIntervention.chantier.ville})`;
      } else {
        body = `${count} interventions aujourd'hui. Premiere a ${heure} chez ${clientNom}`;
      }

      if (employeId) {
        await this.notificationsService.sendToUser(employeId, {
          title: `Interventions du jour`,
          body,
          url: '/interventions',
          tag: 'daily-reminder',
        });
      } else {
        // Non-assigned interventions - notify all
        await this.notificationsService.sendToAll({
          title: `${count} intervention(s) non assignee(s)`,
          body,
          url: '/interventions',
          tag: 'daily-reminder',
        });
      }
    }

    this.logger.log(`Morning reminder sent for ${interventions.length} interventions`);
  }

  /**
   * Evening reminder at 6:00 PM for tomorrow's interventions
   */
  @Cron('0 18 * * *', {
    name: 'evening-interventions-reminder',
    timeZone: 'Europe/Paris',
  })
  async sendEveningReminder() {
    this.logger.log('Running evening interventions reminder cron job');

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const dayAfter = new Date(tomorrow);
    dayAfter.setDate(dayAfter.getDate() + 1);

    const interventions = await this.prisma.intervention.findMany({
      where: {
        date: {
          gte: tomorrow,
          lt: dayAfter,
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
        employe: {
          select: { id: true, nom: true, prenom: true },
        },
      },
      orderBy: { heureDebut: 'asc' },
    });

    if (interventions.length === 0) {
      this.logger.log('No interventions tomorrow');
      return;
    }

    // Group by employee
    const byEmployee = new Map<string | null, typeof interventions>();

    for (const intervention of interventions) {
      const employeId = intervention.employeId;
      if (!byEmployee.has(employeId)) {
        byEmployee.set(employeId, []);
      }
      byEmployee.get(employeId)!.push(intervention);
    }

    // Send notifications
    for (const [employeId, empInterventions] of byEmployee) {
      const count = empInterventions.length;
      const firstIntervention = empInterventions[0];
      const heure = format(firstIntervention.heureDebut, 'HH:mm', { locale: fr });
      const clientNom = firstIntervention.chantier.client.nom;

      let body: string;
      if (count === 1) {
        body = `Demain ${heure} - ${clientNom} (${firstIntervention.chantier.ville})`;
      } else {
        body = `${count} interventions demain. Premiere a ${heure} chez ${clientNom}`;
      }

      if (employeId) {
        await this.notificationsService.sendToUser(employeId, {
          title: `Rappel: interventions demain`,
          body,
          url: '/interventions',
          tag: 'tomorrow-reminder',
        });
      } else {
        // Non-assigned interventions - notify patron
        await this.notificationsService.sendToRole('patron', {
          title: `${count} intervention(s) non assignee(s) demain`,
          body,
          url: '/interventions',
          tag: 'tomorrow-reminder',
        });
      }
    }

    this.logger.log(`Evening reminder sent for ${interventions.length} interventions tomorrow`);
  }

  /**
   * Manual trigger for testing (can be called via API)
   */
  async triggerMorningReminder() {
    return this.sendMorningReminder();
  }

  async triggerEveningReminder() {
    return this.sendEveningReminder();
  }
}
