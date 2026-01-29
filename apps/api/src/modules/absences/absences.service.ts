import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateAbsenceDto } from './dto/create-absence.dto';
import { UpdateAbsenceDto } from './dto/update-absence.dto';
import { AbsenceFiltersDto } from './dto/absence-filters.dto';
import { UserRole } from '@art-et-jardin/database';

@Injectable()
export class AbsencesService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters: AbsenceFiltersDto) {
    const { page = 1, limit = 50, userId, dateDebut, dateFin, type, validee } = filters;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (userId) {
      where.userId = userId;
    }

    if (type) {
      where.type = type;
    }

    if (validee !== undefined) {
      where.validee = validee;
    }

    // Filtre par plage de dates (absences qui chevauchent la periode)
    if (dateDebut || dateFin) {
      const dateFilters: Record<string, unknown>[] = [];

      if (dateDebut) {
        // dateDebut de l'absence <= dateFin du filtre OU dateFin >= dateDebut filtre
        dateFilters.push({ dateFin: { gte: new Date(dateDebut) } });
      }

      if (dateFin) {
        dateFilters.push({ dateDebut: { lte: new Date(dateFin) } });
      }

      if (dateFilters.length > 0) {
        where.AND = dateFilters;
      }
    }

    const [data, total] = await Promise.all([
      this.prisma.absence.findMany({
        where,
        skip,
        take: limit,
        orderBy: { dateDebut: 'desc' },
        include: {
          user: {
            select: { id: true, nom: true, prenom: true, email: true },
          },
        },
      }),
      this.prisma.absence.count({ where }),
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
    const absence = await this.prisma.absence.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, nom: true, prenom: true, email: true },
        },
      },
    });

    if (!absence) {
      throw new NotFoundException(`Absence ${id} non trouvee`);
    }

    return absence;
  }

  async create(createAbsenceDto: CreateAbsenceDto, currentUserId: string, currentUserRole: UserRole) {
    const { userId, dateDebut, dateFin, type, motif } = createAbsenceDto;

    // Si pas patron, ne peut creer que pour soi-meme
    const targetUserId = userId || currentUserId;
    if (currentUserRole !== UserRole.patron && targetUserId !== currentUserId) {
      throw new ForbiddenException('Vous ne pouvez declarer des absences que pour vous-meme');
    }

    // Valider les dates
    const debut = new Date(dateDebut);
    const fin = new Date(dateFin);

    if (fin < debut) {
      throw new BadRequestException('La date de fin doit etre apres la date de debut');
    }

    // Verifier qu'il n'y a pas de chevauchement avec une absence existante
    const chevauchement = await this.prisma.absence.findFirst({
      where: {
        userId: targetUserId,
        OR: [
          // Nouvelle absence commence pendant une existante
          {
            dateDebut: { lte: debut },
            dateFin: { gte: debut },
          },
          // Nouvelle absence finit pendant une existante
          {
            dateDebut: { lte: fin },
            dateFin: { gte: fin },
          },
          // Nouvelle absence englobe une existante
          {
            dateDebut: { gte: debut },
            dateFin: { lte: fin },
          },
        ],
      },
    });

    if (chevauchement) {
      throw new BadRequestException('Une absence existe deja sur cette periode');
    }

    // Auto-validation si patron cree pour lui-meme ou pour un autre
    const validee = currentUserRole === UserRole.patron;

    return this.prisma.absence.create({
      data: {
        userId: targetUserId,
        dateDebut: debut,
        dateFin: fin,
        type,
        motif,
        validee,
      },
      include: {
        user: {
          select: { id: true, nom: true, prenom: true },
        },
      },
    });
  }

  async update(id: string, updateAbsenceDto: UpdateAbsenceDto, currentUserId: string, currentUserRole: UserRole) {
    const absence = await this.findOne(id);

    // Seul le patron ou le proprietaire peut modifier
    if (currentUserRole !== UserRole.patron && absence.userId !== currentUserId) {
      throw new ForbiddenException('Vous ne pouvez modifier que vos propres absences');
    }

    // Si deja validee et pas patron, ne peut plus modifier
    if (absence.validee && currentUserRole !== UserRole.patron) {
      throw new ForbiddenException('Cette absence a deja ete validee');
    }

    const data: Record<string, unknown> = {};

    if (updateAbsenceDto.dateDebut) {
      data.dateDebut = new Date(updateAbsenceDto.dateDebut);
    }

    if (updateAbsenceDto.dateFin) {
      data.dateFin = new Date(updateAbsenceDto.dateFin);
    }

    if (updateAbsenceDto.type) {
      data.type = updateAbsenceDto.type;
    }

    if (updateAbsenceDto.motif !== undefined) {
      data.motif = updateAbsenceDto.motif;
    }

    // Si modification, repasser en non-validee (sauf si patron)
    if (currentUserRole !== UserRole.patron) {
      data.validee = false;
    }

    return this.prisma.absence.update({
      where: { id },
      data,
      include: {
        user: {
          select: { id: true, nom: true, prenom: true },
        },
      },
    });
  }

  async valider(id: string) {
    await this.findOne(id);

    return this.prisma.absence.update({
      where: { id },
      data: { validee: true },
      include: {
        user: {
          select: { id: true, nom: true, prenom: true },
        },
      },
    });
  }

  async refuser(id: string) {
    const absence = await this.findOne(id);

    // Supprimer l'absence si refusee
    await this.prisma.absence.delete({
      where: { id },
    });

    return { message: 'Absence refusee et supprimee', absence };
  }

  async remove(id: string, currentUserId: string, currentUserRole: UserRole) {
    const absence = await this.findOne(id);

    // Seul le patron ou le proprietaire (si pas validee) peut supprimer
    if (currentUserRole !== UserRole.patron) {
      if (absence.userId !== currentUserId) {
        throw new ForbiddenException('Vous ne pouvez supprimer que vos propres absences');
      }
      if (absence.validee) {
        throw new ForbiddenException('Cette absence a ete validee et ne peut plus etre supprimee');
      }
    }

    return this.prisma.absence.delete({
      where: { id },
    });
  }

  // Verifie si un employe a une absence sur une date donnee
  async checkAbsence(userId: string, date: Date) {
    return this.prisma.absence.findFirst({
      where: {
        userId,
        validee: true,
        dateDebut: { lte: date },
        dateFin: { gte: date },
      },
    });
  }

  // Recupere les absences pour une plage de dates (pour le calendrier)
  async getAbsencesForPeriod(dateDebut: Date, dateFin: Date) {
    return this.prisma.absence.findMany({
      where: {
        validee: true,
        OR: [
          // Absence chevauche le debut de la periode
          {
            dateDebut: { lte: dateDebut },
            dateFin: { gte: dateDebut },
          },
          // Absence chevauche la fin de la periode
          {
            dateDebut: { lte: dateFin },
            dateFin: { gte: dateFin },
          },
          // Absence entierement dans la periode
          {
            dateDebut: { gte: dateDebut },
            dateFin: { lte: dateFin },
          },
        ],
      },
      include: {
        user: {
          select: { id: true, nom: true, prenom: true },
        },
      },
      orderBy: { dateDebut: 'asc' },
    });
  }
}
