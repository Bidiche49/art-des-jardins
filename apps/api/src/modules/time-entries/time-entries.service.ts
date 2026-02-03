import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateTimeEntryDto } from './dto/create-time-entry.dto';
import { UpdateTimeEntryDto } from './dto/update-time-entry.dto';

@Injectable()
export class TimeEntriesService {
  constructor(private prisma: PrismaService) {}

  async create(interventionId: string, createTimeEntryDto: CreateTimeEntryDto): Promise<unknown> {
    // Verifier que l'intervention existe
    const intervention = await this.prisma.intervention.findUnique({
      where: { id: interventionId },
    });

    if (!intervention) {
      throw new NotFoundException(`Intervention ${interventionId} non trouvee`);
    }

    // Verifier que l'utilisateur existe
    const user = await this.prisma.user.findUnique({
      where: { id: createTimeEntryDto.userId },
    });

    if (!user) {
      throw new NotFoundException(`Utilisateur ${createTimeEntryDto.userId} non trouve`);
    }

    return this.prisma.timeEntry.create({
      data: {
        interventionId,
        userId: createTimeEntryDto.userId,
        hours: createTimeEntryDto.hours,
        date: new Date(createTimeEntryDto.date),
        description: createTimeEntryDto.description,
      },
      include: {
        user: {
          select: { id: true, nom: true, prenom: true },
        },
        intervention: {
          select: { id: true, description: true },
        },
      },
    });
  }

  async findByIntervention(interventionId: string): Promise<unknown[]> {
    // Verifier que l'intervention existe
    const intervention = await this.prisma.intervention.findUnique({
      where: { id: interventionId },
    });

    if (!intervention) {
      throw new NotFoundException(`Intervention ${interventionId} non trouvee`);
    }

    return this.prisma.timeEntry.findMany({
      where: { interventionId },
      include: {
        user: {
          select: { id: true, nom: true, prenom: true },
        },
      },
      orderBy: { date: 'desc' },
    });
  }

  async findOne(id: string): Promise<unknown> {
    const timeEntry = await this.prisma.timeEntry.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, nom: true, prenom: true },
        },
        intervention: {
          include: {
            chantier: {
              select: { id: true, adresse: true, ville: true },
            },
          },
        },
      },
    });

    if (!timeEntry) {
      throw new NotFoundException(`TimeEntry ${id} non trouvee`);
    }

    return timeEntry;
  }

  async update(id: string, updateTimeEntryDto: UpdateTimeEntryDto): Promise<unknown> {
    await this.findOne(id);

    const data: Record<string, unknown> = {};

    if (updateTimeEntryDto.userId) {
      // Verifier que l'utilisateur existe
      const user = await this.prisma.user.findUnique({
        where: { id: updateTimeEntryDto.userId },
      });
      if (!user) {
        throw new NotFoundException(`Utilisateur ${updateTimeEntryDto.userId} non trouve`);
      }
      data.userId = updateTimeEntryDto.userId;
    }

    if (updateTimeEntryDto.hours !== undefined) {
      data.hours = updateTimeEntryDto.hours;
    }

    if (updateTimeEntryDto.date) {
      data.date = new Date(updateTimeEntryDto.date);
    }

    if (updateTimeEntryDto.description !== undefined) {
      data.description = updateTimeEntryDto.description;
    }

    return this.prisma.timeEntry.update({
      where: { id },
      data,
      include: {
        user: {
          select: { id: true, nom: true, prenom: true },
        },
        intervention: {
          select: { id: true, description: true },
        },
      },
    });
  }

  async remove(id: string): Promise<unknown> {
    await this.findOne(id);

    return this.prisma.timeEntry.delete({
      where: { id },
    });
  }
}
