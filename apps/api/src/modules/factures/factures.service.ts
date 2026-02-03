import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { EventsGateway } from '../websocket/events.gateway';
import { WS_EVENTS } from '../websocket/websocket.events';
import { CreateFactureDto } from './dto/create-facture.dto';
import { UpdateFactureDto } from './dto/update-facture.dto';
import { FactureFiltersDto } from './dto/facture-filters.dto';
import { FactureStatut } from '@art-et-jardin/database';

@Injectable()
export class FacturesService {
  constructor(
    private prisma: PrismaService,
    private eventsGateway: EventsGateway,
  ) {}

  private async genererNumero(): Promise<string> {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const prefix = 'FAC';
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

  async findAll(filters: FactureFiltersDto) {
    const { page = 1, limit = 20, devisId, clientId, statut, dateDebut, dateFin, enRetard, search } = filters;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (devisId) {
      where.devisId = devisId;
    }

    if (clientId) {
      where.devis = { chantier: { clientId } };
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

    if (enRetard) {
      where.dateEcheance = { lt: new Date() };
      where.statut = { notIn: ['payee', 'annulee'] };
    }

    if (search) {
      where.numero = { contains: search, mode: 'insensitive' };
    }

    const [data, total] = await Promise.all([
      this.prisma.facture.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          devis: {
            select: {
              id: true,
              numero: true,
              chantier: {
                select: {
                  id: true,
                  adresse: true,
                  client: {
                    select: { id: true, nom: true, prenom: true },
                  },
                },
              },
            },
          },
          _count: { select: { lignes: true } },
        },
      }),
      this.prisma.facture.count({ where }),
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
    const facture = await this.prisma.facture.findUnique({
      where: { id },
      include: {
        devis: {
          include: {
            chantier: {
              include: {
                client: true,
              },
            },
          },
        },
        lignes: {
          orderBy: { ordre: 'asc' },
        },
      },
    });

    if (!facture) {
      throw new NotFoundException(`Facture ${id} non trouvee`);
    }

    return facture;
  }

  async createFromDevis(devisId: string, options?: { delaiPaiement?: number; mentionsLegales?: string; notes?: string }) {
    const devis = await this.prisma.devis.findUnique({
      where: { id: devisId },
      include: {
        lignes: { orderBy: { ordre: 'asc' } },
        factures: true,
      },
    });

    if (!devis) {
      throw new NotFoundException(`Devis ${devisId} non trouve`);
    }

    if (devis.statut !== 'accepte') {
      throw new BadRequestException('Seul un devis accepte peut etre facture');
    }

    // Verifier qu'il n'y a pas deja une facture pour ce devis
    if (devis.factures.length > 0) {
      throw new BadRequestException('Ce devis a deja une facture');
    }

    const numero = await this.genererNumero();
    const delaiPaiement = options?.delaiPaiement ?? 30;

    const dateEmission = new Date();
    const dateEcheance = new Date(dateEmission);
    dateEcheance.setDate(dateEcheance.getDate() + delaiPaiement);

    // Copier les lignes du devis
    const lignesFacture = devis.lignes.map((ligne) => ({
      description: ligne.description,
      quantite: ligne.quantite,
      unite: ligne.unite,
      prixUnitaireHT: ligne.prixUnitaireHT,
      tva: ligne.tva,
      montantHT: ligne.montantHT,
      montantTTC: ligne.montantTTC,
      ordre: ligne.ordre,
    }));

    const facture = await this.prisma.facture.create({
      data: {
        devisId,
        numero,
        dateEmission,
        dateEcheance,
        totalHT: devis.totalHT,
        totalTVA: devis.totalTVA,
        totalTTC: devis.totalTTC,
        mentionsLegales: options?.mentionsLegales,
        notes: options?.notes,
        lignes: {
          create: lignesFacture,
        },
      },
      include: {
        lignes: { orderBy: { ordre: 'asc' } },
        devis: {
          select: {
            numero: true,
            chantier: {
              select: {
                adresse: true,
                client: { select: { nom: true } },
              },
            },
          },
        },
      },
    });

    // Emit WebSocket event
    this.eventsGateway.broadcast(WS_EVENTS.FACTURE_CREATED, {
      id: facture.id,
      numero: facture.numero,
      clientName: facture.devis.chantier.client.nom,
      amount: facture.totalTTC,
    });

    return facture;
  }

  async create(createFactureDto: CreateFactureDto) {
    return this.createFromDevis(createFactureDto.devisId, {
      delaiPaiement: createFactureDto.delaiPaiement,
      mentionsLegales: createFactureDto.mentionsLegales,
      notes: createFactureDto.notes,
    });
  }

  async update(id: string, updateFactureDto: UpdateFactureDto) {
    await this.findOne(id);

    const data: Record<string, unknown> = { ...updateFactureDto };

    if (updateFactureDto.datePaiement) {
      data.datePaiement = new Date(updateFactureDto.datePaiement);
    }

    return this.prisma.facture.update({
      where: { id },
      data,
      include: {
        lignes: { orderBy: { ordre: 'asc' } },
      },
    });
  }

  async updateStatut(id: string, statut: FactureStatut) {
    await this.findOne(id);

    const data: Record<string, unknown> = { statut };

    if (statut === 'payee') {
      data.datePaiement = new Date();
    }

    return this.prisma.facture.update({
      where: { id },
      data,
    });
  }

  async marquerPayee(id: string, modePaiement: string, referencePaiement?: string) {
    const facture = await this.prisma.facture.update({
      where: { id },
      data: {
        statut: 'payee',
        datePaiement: new Date(),
        modePaiement: modePaiement as any,
        referencePaiement,
      },
      include: {
        devis: {
          select: {
            chantier: {
              select: {
                client: { select: { nom: true } },
              },
            },
          },
        },
      },
    });

    // Emit WebSocket event
    this.eventsGateway.broadcast(WS_EVENTS.FACTURE_PAID, {
      id: facture.id,
      numero: facture.numero,
      clientName: facture.devis.chantier.client.nom,
      amount: facture.totalTTC,
    });

    return facture;
  }

  async remove(id: string) {
    const facture = await this.findOne(id);

    if (facture.statut === 'payee') {
      throw new BadRequestException('Impossible de supprimer une facture payee');
    }

    return this.prisma.facture.delete({
      where: { id },
    });
  }

  async findOneWithDetails(id: string) {
    return this.findOne(id);
  }
}
