import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { RentabiliteDto } from './dto/rentabilite.dto';

// Type pour Decimal Prisma (avec methode toNumber())
type DecimalLike = { toNumber(): number };

// Seuils configurables
const SEUILS = {
  PROFITABLE: 30, // marge > 30%
  LIMITE: 15, // 15% <= marge <= 30%
  // marge < 15% = perte
};

@Injectable()
export class RentabiliteService {
  constructor(private prisma: PrismaService) {}

  /**
   * Calcule la rentabilite d'un chantier specifique
   */
  async calculerRentabilite(chantierId: string): Promise<RentabiliteDto> {
    // 1. Recuperer le chantier avec client et devis accepte/signe
    const chantier = await this.prisma.chantier.findUnique({
      where: { id: chantierId },
      include: {
        client: {
          select: { nom: true, prenom: true, raisonSociale: true },
        },
        devis: {
          where: {
            statut: { in: ['accepte', 'signe'] },
          },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        interventions: {
          include: {
            timeEntries: {
              include: {
                user: {
                  select: { hourlyRate: true },
                },
              },
            },
          },
        },
        materialUsages: true,
      },
    });

    if (!chantier) {
      throw new NotFoundException(`Chantier ${chantierId} non trouve`);
    }

    // 2. Calculer le montant HT du devis (si present)
    const devis = chantier.devis[0] || null;
    const montantHT = devis?.totalHT ?? null;

    // 3. Calculer le cout des heures
    let totalHeures = 0;
    let coutHeures = 0;

    for (const intervention of chantier.interventions) {
      for (const entry of intervention.timeEntries) {
        const hours = this.toNumber(entry.hours);
        totalHeures += hours;

        // Utiliser le taux horaire de l'employe ou un defaut de 25€/h
        const hourlyRate = entry.user.hourlyRate
          ? this.toNumber(entry.user.hourlyRate)
          : 25;
        coutHeures += hours * hourlyRate;
      }
    }

    // 4. Calculer le cout des materiaux
    let coutMateriaux = 0;
    for (const material of chantier.materialUsages) {
      coutMateriaux += this.toNumber(material.totalCost);
    }

    // 5. Calculer cout total
    const coutTotal = coutHeures + coutMateriaux;

    // 6. Calculer marge
    let margeMontant: number | null = null;
    let margePourcentage: number | null = null;
    let status: RentabiliteDto['status'] = 'indetermine';

    if (montantHT !== null && montantHT > 0) {
      margeMontant = montantHT - coutTotal;
      margePourcentage = (margeMontant / montantHT) * 100;
      status = this.determinerStatus(margePourcentage);
    }

    // 7. Construire le nom du client
    const clientNom = chantier.client.raisonSociale
      ? chantier.client.raisonSociale
      : `${chantier.client.prenom || ''} ${chantier.client.nom}`.trim();

    return {
      chantierId: chantier.id,
      chantierNom: `${chantier.adresse}, ${chantier.ville}`,
      chantierAdresse: chantier.adresse,
      clientNom,
      prevu: {
        montantHT,
        heuresEstimees: null, // Pas de champ heures estimees dans le schema actuel
      },
      reel: {
        heures: Math.round(totalHeures * 100) / 100,
        coutHeures: Math.round(coutHeures * 100) / 100,
        coutMateriaux: Math.round(coutMateriaux * 100) / 100,
        coutTotal: Math.round(coutTotal * 100) / 100,
      },
      marge: {
        montant: margeMontant !== null ? Math.round(margeMontant * 100) / 100 : null,
        pourcentage:
          margePourcentage !== null ? Math.round(margePourcentage * 100) / 100 : null,
      },
      status,
    };
  }

  /**
   * Genere un rapport de rentabilite pour une periode donnee
   */
  async genererRapport(dateDebut?: string, dateFin?: string): Promise<RentabiliteDto[]> {
    // Construire le filtre de date
    const dateFilter: { dateDebut?: { gte?: Date; lte?: Date } } = {};

    if (dateDebut || dateFin) {
      dateFilter.dateDebut = {};
      if (dateDebut) {
        dateFilter.dateDebut.gte = new Date(dateDebut);
      }
      if (dateFin) {
        dateFilter.dateDebut.lte = new Date(dateFin);
      }
    }

    // Recuperer les chantiers avec un devis accepte/signe
    const chantiers = await this.prisma.chantier.findMany({
      where: {
        ...dateFilter,
        deletedAt: null,
        devis: {
          some: {
            statut: { in: ['accepte', 'signe'] },
          },
        },
      },
      select: { id: true },
      orderBy: { dateDebut: 'desc' },
    });

    // Calculer la rentabilite pour chaque chantier
    const rentabilites: RentabiliteDto[] = [];
    for (const chantier of chantiers) {
      const rentabilite = await this.calculerRentabilite(chantier.id);
      rentabilites.push(rentabilite);
    }

    return rentabilites;
  }

  /**
   * Determine le status de rentabilite selon les seuils
   */
  private determinerStatus(pourcentageMarge: number): RentabiliteDto['status'] {
    if (pourcentageMarge >= SEUILS.PROFITABLE) {
      return 'profitable';
    }
    if (pourcentageMarge >= SEUILS.LIMITE) {
      return 'limite';
    }
    return 'perte';
  }

  /**
   * Convertit un Decimal Prisma en number
   */
  private toNumber(value: DecimalLike | number | null): number {
    if (value === null) return 0;
    if (typeof value === 'number') return value;
    return value.toNumber();
  }
}
