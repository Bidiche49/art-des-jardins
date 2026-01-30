import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

export interface RevenueByClient {
  clientId: string;
  clientName: string;
  revenue: number;
  invoiceCount: number;
}

export interface RevenueByPrestation {
  prestation: string;
  revenue: number;
  count: number;
}

export interface UnpaidInvoice {
  id: string;
  numero: string;
  clientName: string;
  totalTTC: number;
  dateEcheance: Date;
  daysOverdue: number;
}

export interface ForecastItem {
  id: string;
  devisNumero: string;
  clientName: string;
  totalTTC: number;
  dateAcceptation: Date;
}

@Injectable()
export class FinanceReportsService {
  constructor(private prisma: PrismaService) {}

  async getRevenueByPeriod(year: number) {
    const months: Array<{ period: string; revenue: number; count: number }> = [];
    const monthNames = ['Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre'];

    for (let i = 0; i < 12; i++) {
      const start = new Date(year, i, 1);
      const end = new Date(year, i + 1, 0, 23, 59, 59);

      const result = await this.prisma.facture.aggregate({
        where: {
          statut: 'payee',
          datePaiement: { gte: start, lte: end },
        },
        _sum: { totalTTC: true },
        _count: true,
      });

      months.push({
        period: monthNames[i],
        revenue: result._sum.totalTTC || 0,
        count: result._count,
      });
    }

    return months;
  }

  async getRevenueByClient(year: number): Promise<RevenueByClient[]> {
    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31, 23, 59, 59);

    const factures = await this.prisma.facture.findMany({
      where: {
        statut: 'payee',
        datePaiement: { gte: start, lte: end },
      },
      include: {
        devis: {
          include: {
            chantier: {
              include: { client: true },
            },
          },
        },
      },
    });

    const clientRevenue = new Map<string, { name: string; revenue: number; count: number }>();

    factures.forEach((f) => {
      const client = f.devis.chantier.client;
      const key = client.id;
      const existing = clientRevenue.get(key) || { name: '', revenue: 0, count: 0 };
      const clientName = client.prenom ? `${client.prenom} ${client.nom}` : client.nom;

      clientRevenue.set(key, {
        name: clientName,
        revenue: existing.revenue + f.totalTTC,
        count: existing.count + 1,
      });
    });

    return Array.from(clientRevenue.entries())
      .map(([id, data]) => ({
        clientId: id,
        clientName: data.name,
        revenue: data.revenue,
        invoiceCount: data.count,
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }

  async getRevenueByPrestation(year: number): Promise<RevenueByPrestation[]> {
    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31, 23, 59, 59);

    const factures = await this.prisma.facture.findMany({
      where: {
        statut: 'payee',
        datePaiement: { gte: start, lte: end },
      },
      include: {
        devis: {
          include: {
            chantier: true,
          },
        },
      },
    });

    const prestationRevenue = new Map<string, { revenue: number; count: number }>();

    factures.forEach((f) => {
      const prestations = f.devis.chantier.typePrestation;
      prestations.forEach((p) => {
        const existing = prestationRevenue.get(p) || { revenue: 0, count: 0 };
        prestationRevenue.set(p, {
          revenue: existing.revenue + f.totalTTC / prestations.length,
          count: existing.count + 1,
        });
      });
    });

    return Array.from(prestationRevenue.entries())
      .map(([prestation, data]) => ({
        prestation,
        revenue: data.revenue,
        count: data.count,
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }

  async getUnpaidInvoices(): Promise<UnpaidInvoice[]> {
    const now = new Date();

    const factures = await this.prisma.facture.findMany({
      where: {
        statut: 'envoyee',
        dateEcheance: { lt: now },
      },
      include: {
        devis: {
          include: {
            chantier: {
              include: { client: true },
            },
          },
        },
      },
      orderBy: { dateEcheance: 'asc' },
    });

    return factures.map((f) => {
      const client = f.devis.chantier.client;
      const clientName = client.prenom ? `${client.prenom} ${client.nom}` : client.nom;
      const daysOverdue = Math.floor((now.getTime() - f.dateEcheance.getTime()) / (1000 * 60 * 60 * 24));

      return {
        id: f.id,
        numero: f.numero,
        clientName,
        totalTTC: f.totalTTC,
        dateEcheance: f.dateEcheance,
        daysOverdue,
      };
    });
  }

  async getForecast(): Promise<ForecastItem[]> {
    const devis = await this.prisma.devis.findMany({
      where: {
        statut: { in: ['signe', 'accepte'] },
        factures: { none: {} },
      },
      include: {
        chantier: {
          include: { client: true },
        },
      },
      orderBy: { dateAcceptation: 'desc' },
    });

    return devis.map((d) => {
      const client = d.chantier.client;
      const clientName = client.prenom ? `${client.prenom} ${client.nom}` : client.nom;

      return {
        id: d.id,
        devisNumero: d.numero,
        clientName,
        totalTTC: d.totalTTC,
        dateAcceptation: d.dateAcceptation || d.createdAt,
      };
    });
  }

  async getFinancialSummary(year: number) {
    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31, 23, 59, 59);

    const [paid, pending, unpaidOverdue] = await Promise.all([
      this.prisma.facture.aggregate({
        where: { statut: 'payee', datePaiement: { gte: start, lte: end } },
        _sum: { totalTTC: true },
        _count: true,
      }),
      this.prisma.facture.aggregate({
        where: { statut: 'envoyee', dateEcheance: { gte: new Date() } },
        _sum: { totalTTC: true },
        _count: true,
      }),
      this.prisma.facture.aggregate({
        where: { statut: 'envoyee', dateEcheance: { lt: new Date() } },
        _sum: { totalTTC: true },
        _count: true,
      }),
    ]);

    return {
      paid: { amount: paid._sum.totalTTC || 0, count: paid._count },
      pending: { amount: pending._sum.totalTTC || 0, count: pending._count },
      unpaidOverdue: { amount: unpaidOverdue._sum.totalTTC || 0, count: unpaidOverdue._count },
    };
  }
}
