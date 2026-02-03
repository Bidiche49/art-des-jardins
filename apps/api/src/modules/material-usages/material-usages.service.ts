import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateMaterialUsageDto } from './dto/create-material-usage.dto';
import { UpdateMaterialUsageDto } from './dto/update-material-usage.dto';

@Injectable()
export class MaterialUsagesService {
  constructor(private prisma: PrismaService) {}

  async create(chantierId: string, dto: CreateMaterialUsageDto): Promise<unknown> {
    // Verifier que le chantier existe
    const chantier = await this.prisma.chantier.findUnique({
      where: { id: chantierId },
    });

    if (!chantier) {
      throw new NotFoundException(`Chantier ${chantierId} non trouve`);
    }

    // Calculer le cout total
    const totalCost = dto.quantity * dto.unitCost;

    return this.prisma.materialUsage.create({
      data: {
        chantierId,
        name: dto.name,
        quantity: dto.quantity,
        unitCost: dto.unitCost,
        totalCost,
      },
      include: {
        chantier: {
          select: { id: true, adresse: true, ville: true },
        },
      },
    });
  }

  async findByChantier(chantierId: string): Promise<unknown[]> {
    // Verifier que le chantier existe
    const chantier = await this.prisma.chantier.findUnique({
      where: { id: chantierId },
    });

    if (!chantier) {
      throw new NotFoundException(`Chantier ${chantierId} non trouve`);
    }

    return this.prisma.materialUsage.findMany({
      where: { chantierId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string): Promise<unknown> {
    const material = await this.prisma.materialUsage.findUnique({
      where: { id },
      include: {
        chantier: {
          select: { id: true, adresse: true, ville: true },
        },
      },
    });

    if (!material) {
      throw new NotFoundException(`Materiau ${id} non trouve`);
    }

    return material;
  }

  async update(id: string, dto: UpdateMaterialUsageDto): Promise<unknown> {
    const existing = await this.prisma.materialUsage.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Materiau ${id} non trouve`);
    }

    // Recalculer totalCost si quantity ou unitCost change
    const quantity = dto.quantity ?? Number(existing.quantity);
    const unitCost = dto.unitCost ?? Number(existing.unitCost);
    const totalCost = quantity * unitCost;

    const data: Record<string, unknown> = {};

    if (dto.name !== undefined) {
      data.name = dto.name;
    }

    if (dto.quantity !== undefined) {
      data.quantity = dto.quantity;
    }

    if (dto.unitCost !== undefined) {
      data.unitCost = dto.unitCost;
    }

    // Toujours recalculer totalCost si quantity ou unitCost change
    if (dto.quantity !== undefined || dto.unitCost !== undefined) {
      data.totalCost = totalCost;
    }

    return this.prisma.materialUsage.update({
      where: { id },
      data,
      include: {
        chantier: {
          select: { id: true, adresse: true, ville: true },
        },
      },
    });
  }

  async remove(id: string): Promise<unknown> {
    await this.findOne(id);

    return this.prisma.materialUsage.delete({
      where: { id },
    });
  }
}
