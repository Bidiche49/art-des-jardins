import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateInterventionDto } from './dto/create-intervention.dto';
import { UpdateInterventionDto } from './dto/update-intervention.dto';
import { InterventionFiltersDto } from './dto/intervention-filters.dto';

@Injectable()
export class InterventionsService {
  constructor(private prisma: PrismaService) {}

  private calculerDuree(heureDebut: Date, heureFin: Date): number {
    const diffMs = heureFin.getTime() - heureDebut.getTime();
    return Math.round(diffMs / (1000 * 60)); // en minutes
  }

  async findAll(filters: InterventionFiltersDto) {
    const { page = 1, limit = 20, chantierId, employeId, dateDebut, dateFin, valide, enCours } = filters;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (chantierId) {
      where.chantierId = chantierId;
    }

    if (employeId) {
      where.employeId = employeId;
    }

    if (dateDebut || dateFin) {
      where.date = {};
      if (dateDebut) {
        (where.date as Record<string, unknown>).gte = new Date(dateDebut);
      }
      if (dateFin) {
        (where.date as Record<string, unknown>).lte = new Date(dateFin);
      }
    }

    if (valide !== undefined) {
      where.valide = valide;
    }

    if (enCours) {
      where.heureFin = null;
    }

    const [data, total] = await Promise.all([
      this.prisma.intervention.findMany({
        where,
        skip,
        take: limit,
        orderBy: { date: 'desc' },
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
          employe: {
            select: { id: true, nom: true, prenom: true },
          },
        },
      }),
      this.prisma.intervention.count({ where }),
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
    const intervention = await this.prisma.intervention.findUnique({
      where: { id },
      include: {
        chantier: {
          include: {
            client: true,
          },
        },
        employe: {
          select: { id: true, nom: true, prenom: true, email: true },
        },
      },
    });

    if (!intervention) {
      throw new NotFoundException(`Intervention ${id} non trouvee`);
    }

    return intervention;
  }

  async create(createInterventionDto: CreateInterventionDto, employeId: string) {
    const { chantierId, date, heureDebut, heureFin, ...rest } = createInterventionDto;

    // Verifier que le chantier existe
    const chantier = await this.prisma.chantier.findUnique({
      where: { id: chantierId },
    });

    if (!chantier) {
      throw new NotFoundException(`Chantier ${chantierId} non trouve`);
    }

    const dateDebut = new Date(heureDebut);
    let dureeMinutes: number | null = null;

    if (heureFin) {
      const dateFin = new Date(heureFin);
      dureeMinutes = this.calculerDuree(dateDebut, dateFin);
    }

    return this.prisma.intervention.create({
      data: {
        chantierId,
        employeId,
        date: new Date(date),
        heureDebut: dateDebut,
        heureFin: heureFin ? new Date(heureFin) : null,
        dureeMinutes,
        ...rest,
      },
      include: {
        chantier: {
          select: { id: true, adresse: true },
        },
        employe: {
          select: { id: true, nom: true, prenom: true },
        },
      },
    });
  }

  async update(id: string, updateInterventionDto: UpdateInterventionDto) {
    const intervention = await this.findOne(id);

    const { heureDebut, heureFin, date, ...rest } = updateInterventionDto;

    const data: Record<string, unknown> = { ...rest };

    if (date) {
      data.date = new Date(date);
    }

    if (heureDebut) {
      data.heureDebut = new Date(heureDebut);
    }

    if (heureFin) {
      data.heureFin = new Date(heureFin);
    }

    // Recalculer la duree si les heures changent
    const newHeureDebut = heureDebut ? new Date(heureDebut) : intervention.heureDebut;
    const newHeureFin = heureFin ? new Date(heureFin) : intervention.heureFin;

    if (newHeureFin) {
      data.dureeMinutes = this.calculerDuree(newHeureDebut, newHeureFin);
    }

    return this.prisma.intervention.update({
      where: { id },
      data,
      include: {
        chantier: {
          select: { id: true, adresse: true },
        },
        employe: {
          select: { id: true, nom: true, prenom: true },
        },
      },
    });
  }

  async startIntervention(chantierId: string, employeId: string, description?: string) {
    // Verifier qu'il n'y a pas deja une intervention en cours pour cet employe
    const enCours = await this.prisma.intervention.findFirst({
      where: {
        employeId,
        heureFin: null,
      },
    });

    if (enCours) {
      throw new BadRequestException('Vous avez deja une intervention en cours. Terminez-la d\'abord.');
    }

    const now = new Date();

    return this.prisma.intervention.create({
      data: {
        chantierId,
        employeId,
        date: now,
        heureDebut: now,
        description,
      },
      include: {
        chantier: {
          select: { id: true, adresse: true, ville: true },
        },
      },
    });
  }

  async stopIntervention(id: string, employeId: string) {
    const intervention = await this.findOne(id);

    if (intervention.employeId !== employeId) {
      throw new BadRequestException('Vous ne pouvez arreter que vos propres interventions');
    }

    if (intervention.heureFin) {
      throw new BadRequestException('Cette intervention est deja terminee');
    }

    const heureFin = new Date();
    const dureeMinutes = this.calculerDuree(intervention.heureDebut, heureFin);

    return this.prisma.intervention.update({
      where: { id },
      data: {
        heureFin,
        dureeMinutes,
      },
      include: {
        chantier: {
          select: { id: true, adresse: true },
        },
      },
    });
  }

  async getInterventionEnCours(employeId: string) {
    return this.prisma.intervention.findFirst({
      where: {
        employeId,
        heureFin: null,
      },
      include: {
        chantier: {
          select: { id: true, adresse: true, ville: true },
        },
      },
    });
  }

  async valider(id: string) {
    await this.findOne(id);

    return this.prisma.intervention.update({
      where: { id },
      data: { valide: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.intervention.delete({
      where: { id },
    });
  }
}
