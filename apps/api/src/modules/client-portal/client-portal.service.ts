import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

export interface DashboardStats {
  devis: {
    enAttente: number;
    acceptes: number;
    total: number;
  };
  factures: {
    aPayer: number;
    payees: number;
    montantDu: number;
  };
  chantiers: Array<{
    id: string;
    description: string;
    statut: string;
    adresse: string;
  }>;
}

@Injectable()
export class ClientPortalService {
  constructor(private prisma: PrismaService) {}

  async getDashboard(clientId: string): Promise<DashboardStats> {
    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
      include: {
        chantiers: {
          include: {
            devis: {
              include: {
                factures: true,
              },
            },
          },
        },
      },
    });

    if (!client) {
      return {
        devis: { enAttente: 0, acceptes: 0, total: 0 },
        factures: { aPayer: 0, payees: 0, montantDu: 0 },
        chantiers: [],
      };
    }

    const allDevis = client.chantiers.flatMap((c) => c.devis);
    const allFactures = allDevis.flatMap((d) => d.factures);

    const devisEnAttente = allDevis.filter((d) => d.statut === 'envoye').length;
    const devisAcceptes = allDevis.filter((d) =>
      ['signe', 'accepte'].includes(d.statut)
    ).length;

    const facturesAPayer = allFactures.filter((f) => f.statut === 'envoyee');
    const facturesPayees = allFactures.filter((f) => f.statut === 'payee').length;
    const montantDu = facturesAPayer.reduce((sum, f) => sum + f.totalTTC, 0);

    const chantiersEnCours = client.chantiers
      .filter((c) =>
        ['accepte', 'planifie', 'en_cours'].includes(c.statut)
      )
      .map((c) => ({
        id: c.id,
        description: c.description,
        statut: c.statut,
        adresse: `${c.adresse}, ${c.codePostal} ${c.ville}`,
      }));

    return {
      devis: {
        enAttente: devisEnAttente,
        acceptes: devisAcceptes,
        total: allDevis.length,
      },
      factures: {
        aPayer: facturesAPayer.length,
        payees: facturesPayees,
        montantDu,
      },
      chantiers: chantiersEnCours,
    };
  }

  async getDevis(clientId: string) {
    const chantiers = await this.prisma.chantier.findMany({
      where: { clientId },
      include: {
        devis: {
          include: {
            lignes: true,
            signature: true,
          },
          orderBy: { dateEmission: 'desc' },
        },
      },
    });

    return chantiers.flatMap((c) =>
      c.devis.map((d) => ({
        ...d,
        chantierDescription: c.description,
        chantierAdresse: `${c.adresse}, ${c.codePostal} ${c.ville}`,
      }))
    );
  }

  async getDevisById(clientId: string, devisId: string) {
    const devis = await this.prisma.devis.findFirst({
      where: {
        id: devisId,
        chantier: { clientId },
      },
      include: {
        lignes: { orderBy: { ordre: 'asc' } },
        signature: true,
        chantier: true,
      },
    });

    return devis;
  }

  async getFactures(clientId: string) {
    const chantiers = await this.prisma.chantier.findMany({
      where: { clientId },
      include: {
        devis: {
          include: {
            factures: {
              include: {
                lignes: true,
              },
              orderBy: { dateEmission: 'desc' },
            },
          },
        },
      },
    });

    return chantiers.flatMap((c) =>
      c.devis.flatMap((d) =>
        d.factures.map((f) => ({
          ...f,
          devisNumero: d.numero,
          chantierDescription: c.description,
        }))
      )
    );
  }

  async getFactureById(clientId: string, factureId: string) {
    const facture = await this.prisma.facture.findFirst({
      where: {
        id: factureId,
        devis: {
          chantier: { clientId },
        },
      },
      include: {
        lignes: { orderBy: { ordre: 'asc' } },
        devis: {
          include: {
            chantier: true,
          },
        },
      },
    });

    return facture;
  }

  async getChantiers(clientId: string) {
    return this.prisma.chantier.findMany({
      where: { clientId },
      include: {
        interventions: {
          orderBy: { date: 'desc' },
          take: 5,
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getChantierById(clientId: string, chantierId: string) {
    return this.prisma.chantier.findFirst({
      where: {
        id: chantierId,
        clientId,
      },
      include: {
        interventions: {
          orderBy: { date: 'desc' },
        },
        devis: {
          include: {
            factures: true,
          },
        },
      },
    });
  }
}
