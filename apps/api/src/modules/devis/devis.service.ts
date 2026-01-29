import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateDevisDto } from './dto/create-devis.dto';
import { UpdateDevisDto } from './dto/update-devis.dto';
import { DevisFiltersDto } from './dto/devis-filters.dto';
import { CreateLigneDevisDto } from './dto/create-ligne-devis.dto';
import { DevisStatut } from '@art-et-jardin/database';

@Injectable()
export class DevisService {
  constructor(private prisma: PrismaService) {}

  private calculerTotaux(lignes: CreateLigneDevisDto[]) {
    let totalHT = 0;
    let totalTVA = 0;

    const lignesCalculees = lignes.map((ligne, index) => {
      const tva = ligne.tva ?? 20;
      const montantHT = ligne.quantite * ligne.prixUnitaireHT;
      const montantTVA = montantHT * (tva / 100);
      const montantTTC = montantHT + montantTVA;

      totalHT += montantHT;
      totalTVA += montantTVA;

      return {
        description: ligne.description,
        quantite: ligne.quantite,
        unite: ligne.unite,
        prixUnitaireHT: ligne.prixUnitaireHT,
        tva,
        montantHT,
        montantTTC,
        ordre: ligne.ordre ?? index,
      };
    });

    return {
      lignes: lignesCalculees,
      totalHT,
      totalTVA,
      totalTTC: totalHT + totalTVA,
    };
  }

  private async genererNumero(): Promise<string> {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const prefix = 'DEV';
    const key = `${prefix}-${year}${month}`;

    const sequence = await this.prisma.sequence.upsert({
      where: { id: key },
      create: {
        id: key,
        prefix,
        year,
        lastValue: 1,
      },
      update: {
        lastValue: { increment: 1 },
      },
    });

    return `${prefix}-${year}${month}-${String(sequence.lastValue).padStart(3, '0')}`;
  }

  async findAll(filters: DevisFiltersDto) {
    const { page = 1, limit = 20, chantierId, clientId, statut, dateDebut, dateFin, search } = filters;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (chantierId) {
      where.chantierId = chantierId;
    }

    if (clientId) {
      where.chantier = { clientId };
    }

    if (statut) {
      where.statut = statut;
    }

    if (dateDebut || dateFin) {
      where.dateEmission = {};
      if (dateDebut) {
        (where.dateEmission as Record<string, unknown>).gte = new Date(dateDebut);
      }
      if (dateFin) {
        (where.dateEmission as Record<string, unknown>).lte = new Date(dateFin);
      }
    }

    if (search) {
      where.numero = { contains: search, mode: 'insensitive' };
    }

    const [data, total] = await Promise.all([
      this.prisma.devis.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          chantier: {
            select: {
              id: true,
              adresse: true,
              ville: true,
              client: {
                select: { id: true, nom: true, prenom: true },
              },
            },
          },
          _count: { select: { lignes: true } },
        },
      }),
      this.prisma.devis.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const devis = await this.prisma.devis.findUnique({
      where: { id },
      include: {
        chantier: {
          include: {
            client: true,
          },
        },
        lignes: {
          orderBy: { ordre: 'asc' },
        },
        factures: {
          select: { id: true, numero: true, statut: true },
        },
      },
    });

    if (!devis) {
      throw new NotFoundException(`Devis ${id} non trouve`);
    }

    return devis;
  }

  async create(createDevisDto: CreateDevisDto) {
    const { chantierId, lignes, validiteJours = 30, ...rest } = createDevisDto;

    // Verifier que le chantier existe
    const chantier = await this.prisma.chantier.findUnique({
      where: { id: chantierId },
    });

    if (!chantier) {
      throw new NotFoundException(`Chantier ${chantierId} non trouve`);
    }

    const numero = await this.genererNumero();
    const { lignes: lignesCalculees, totalHT, totalTVA, totalTTC } = this.calculerTotaux(lignes);

    const dateEmission = new Date();
    const dateValidite = new Date(dateEmission);
    dateValidite.setDate(dateValidite.getDate() + validiteJours);

    return this.prisma.devis.create({
      data: {
        chantierId,
        numero,
        dateEmission,
        dateValidite,
        totalHT,
        totalTVA,
        totalTTC,
        ...rest,
        lignes: {
          create: lignesCalculees,
        },
      },
      include: {
        lignes: { orderBy: { ordre: 'asc' } },
        chantier: {
          select: {
            id: true,
            adresse: true,
            client: { select: { id: true, nom: true } },
          },
        },
      },
    });
  }

  async update(id: string, updateDevisDto: UpdateDevisDto) {
    const existingDevis = await this.findOne(id);

    if (existingDevis.statut !== 'brouillon') {
      throw new BadRequestException('Seul un devis en brouillon peut etre modifie');
    }

    const { lignes, ...rest } = updateDevisDto;

    if (lignes) {
      const { lignes: lignesCalculees, totalHT, totalTVA, totalTTC } = this.calculerTotaux(lignes);

      // Supprimer les anciennes lignes et creer les nouvelles
      await this.prisma.ligneDevis.deleteMany({ where: { devisId: id } });

      return this.prisma.devis.update({
        where: { id },
        data: {
          ...rest,
          totalHT,
          totalTVA,
          totalTTC,
          lignes: {
            create: lignesCalculees,
          },
        },
        include: {
          lignes: { orderBy: { ordre: 'asc' } },
        },
      });
    }

    return this.prisma.devis.update({
      where: { id },
      data: rest,
      include: {
        lignes: { orderBy: { ordre: 'asc' } },
      },
    });
  }

  async updateStatut(id: string, statut: DevisStatut) {
    await this.findOne(id); // Verify exists

    const data: Record<string, unknown> = { statut };

    if (statut === 'accepte') {
      data.dateAcceptation = new Date();
    }

    return this.prisma.devis.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    const devis = await this.findOne(id);

    if (devis.factures.length > 0) {
      throw new BadRequestException('Impossible de supprimer un devis avec des factures');
    }

    return this.prisma.devis.delete({
      where: { id },
    });
  }

  async findOneWithDetails(id: string) {
    const devis = await this.findOne(id);

    // Map to PDF-compatible format
    return {
      numero: devis.numero,
      dateCreation: devis.dateEmission,
      dateValidite: devis.dateValidite,
      notes: devis.notes,
      totalHT: devis.totalHT,
      tauxTVA: 20, // Default TVA rate
      montantTVA: devis.totalTVA,
      totalTTC: devis.totalTTC,
      chantier: {
        client: devis.chantier.client,
      },
      lignes: devis.lignes.map((l) => ({
        designation: l.description,
        quantite: l.quantite,
        unite: l.unite,
        prixUnitaire: l.prixUnitaireHT,
        montantHT: l.montantHT,
      })),
    };
  }
}
