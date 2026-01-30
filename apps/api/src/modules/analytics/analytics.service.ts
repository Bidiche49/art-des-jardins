import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

export interface DashboardKPIs {
  revenue: {
    currentMonth: number;
    yearToDate: number;
    previousYear: number;
  };
  devis: {
    total: number;
    accepted: number;
    conversionRate: number;
    totalAmount: number;
    acceptedAmount: number;
  };
  interventions: {
    completed: number;
    planned: number;
    total: number;
  };
  clients: {
    new: number;
    active: number;
    total: number;
  };
  monthlyRevenue: Array<{ month: string; revenue: number }>;
}

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getDashboard(year?: number, month?: number): Promise<DashboardKPIs> {
    const now = new Date();
    const currentYear = year || now.getFullYear();
    const currentMonth = month || now.getMonth() + 1;

    const startOfMonth = new Date(currentYear, currentMonth - 1, 1);
    const endOfMonth = new Date(currentYear, currentMonth, 0, 23, 59, 59);
    const startOfYear = new Date(currentYear, 0, 1);
    const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59);
    const startOfPreviousYear = new Date(currentYear - 1, 0, 1);
    const endOfPreviousYear = new Date(currentYear - 1, 11, 31, 23, 59, 59);

    const [
      revenueCurrentMonth,
      revenueYTD,
      revenuePreviousYear,
      devisStats,
      interventionsStats,
      clientsStats,
      monthlyRevenue,
    ] = await Promise.all([
      this.calculateRevenue(startOfMonth, endOfMonth),
      this.calculateRevenue(startOfYear, endOfYear),
      this.calculateRevenue(startOfPreviousYear, endOfPreviousYear),
      this.getDevisStats(startOfYear, endOfYear),
      this.getInterventionsStats(startOfYear, endOfYear),
      this.getClientsStats(startOfYear),
      this.getMonthlyRevenue(currentYear),
    ]);

    return {
      revenue: {
        currentMonth: revenueCurrentMonth,
        yearToDate: revenueYTD,
        previousYear: revenuePreviousYear,
      },
      devis: devisStats,
      interventions: interventionsStats,
      clients: clientsStats,
      monthlyRevenue,
    };
  }

  private async calculateRevenue(start: Date, end: Date): Promise<number> {
    const result = await this.prisma.facture.aggregate({
      where: {
        statut: 'payee',
        datePaiement: { gte: start, lte: end },
      },
      _sum: { totalTTC: true },
    });
    return result._sum.totalTTC || 0;
  }

  private async getDevisStats(start: Date, end: Date) {
    const [total, accepted] = await Promise.all([
      this.prisma.devis.findMany({
        where: { dateEmission: { gte: start, lte: end } },
        select: { statut: true, totalTTC: true },
      }),
      this.prisma.devis.findMany({
        where: {
          dateEmission: { gte: start, lte: end },
          statut: { in: ['signe', 'accepte'] },
        },
        select: { totalTTC: true },
      }),
    ]);

    const totalCount = total.length;
    const acceptedCount = accepted.length;
    const totalAmount = total.reduce((sum, d) => sum + d.totalTTC, 0);
    const acceptedAmount = accepted.reduce((sum, d) => sum + d.totalTTC, 0);

    return {
      total: totalCount,
      accepted: acceptedCount,
      conversionRate: totalCount > 0 ? (acceptedCount / totalCount) * 100 : 0,
      totalAmount,
      acceptedAmount,
    };
  }

  private async getInterventionsStats(start: Date, end: Date) {
    const now = new Date();

    const [completed, planned, total] = await Promise.all([
      this.prisma.intervention.count({
        where: {
          date: { gte: start, lte: end },
          valide: true,
        },
      }),
      this.prisma.intervention.count({
        where: {
          date: { gte: now },
        },
      }),
      this.prisma.intervention.count({
        where: { date: { gte: start, lte: end } },
      }),
    ]);

    return { completed, planned, total };
  }

  private async getClientsStats(startOfYear: Date) {
    const [newClients, total] = await Promise.all([
      this.prisma.client.count({
        where: { createdAt: { gte: startOfYear } },
      }),
      this.prisma.client.count(),
    ]);

    const activeClients = await this.prisma.client.count({
      where: {
        chantiers: {
          some: {
            statut: { in: ['accepte', 'planifie', 'en_cours'] },
          },
        },
      },
    });

    return {
      new: newClients,
      active: activeClients,
      total,
    };
  }

  private async getMonthlyRevenue(year: number) {
    const months = [];
    const monthNames = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec'];

    for (let i = 0; i < 12; i++) {
      const start = new Date(year, i, 1);
      const end = new Date(year, i + 1, 0, 23, 59, 59);

      const result = await this.prisma.facture.aggregate({
        where: {
          statut: 'payee',
          datePaiement: { gte: start, lte: end },
        },
        _sum: { totalTTC: true },
      });

      months.push({
        month: monthNames[i],
        revenue: result._sum.totalTTC || 0,
      });
    }

    return months;
  }
}
