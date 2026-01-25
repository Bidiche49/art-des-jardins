import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateChantierDto } from './dto/create-chantier.dto';
import { UpdateChantierDto } from './dto/update-chantier.dto';
import { ChantierFiltersDto } from './dto/chantier-filters.dto';

@Injectable()
export class ChantiersService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters: ChantierFiltersDto) {
    const { page = 1, limit = 20, clientId, statut, responsableId, ville, search } = filters;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (clientId) {
      where.clientId = clientId;
    }

    if (statut) {
      where.statut = statut;
    }

    if (responsableId) {
      where.responsableId = responsableId;
    }

    if (ville) {
      where.ville = { contains: ville, mode: 'insensitive' };
    }

    if (search) {
      where.OR = [
        { adresse: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { ville: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.chantier.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          client: {
            select: { id: true, nom: true, prenom: true, email: true },
          },
          responsable: {
            select: { id: true, nom: true, prenom: true },
          },
        },
      }),
      this.prisma.chantier.count({ where }),
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
    const chantier = await this.prisma.chantier.findUnique({
      where: { id },
      include: {
        client: true,
        responsable: {
          select: { id: true, nom: true, prenom: true, email: true },
        },
        devis: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        interventions: {
          orderBy: { date: 'desc' },
          take: 10,
          include: {
            employe: {
              select: { id: true, nom: true, prenom: true },
            },
          },
        },
      },
    });

    if (!chantier) {
      throw new NotFoundException(`Chantier ${id} non trouve`);
    }

    return chantier;
  }

  async create(createChantierDto: CreateChantierDto) {
    return this.prisma.chantier.create({
      data: createChantierDto,
      include: {
        client: {
          select: { id: true, nom: true, prenom: true },
        },
      },
    });
  }

  async update(id: string, updateChantierDto: UpdateChantierDto) {
    await this.findOne(id);

    return this.prisma.chantier.update({
      where: { id },
      data: updateChantierDto,
      include: {
        client: {
          select: { id: true, nom: true, prenom: true },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.chantier.delete({
      where: { id },
    });
  }

  async updateStatut(id: string, statut: string) {
    await this.findOne(id);

    return this.prisma.chantier.update({
      where: { id },
      data: { statut: statut as any },
    });
  }
}
