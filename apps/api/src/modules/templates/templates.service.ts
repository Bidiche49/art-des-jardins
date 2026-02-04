import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { PrestationTemplate } from '@art-et-jardin/database';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { QueryTemplateDto } from './dto/query-template.dto';

interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

@Injectable()
export class TemplatesService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: QueryTemplateDto): Promise<PaginatedResult<PrestationTemplate>> {
    const { page = 1, limit = 20, category, search, isGlobal } = query;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (category) {
      where.category = category;
    }

    if (isGlobal !== undefined) {
      where.isGlobal = isGlobal;
    }

    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    const [data, total] = await Promise.all([
      this.prisma.prestationTemplate.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ category: 'asc' }, { name: 'asc' }],
      }),
      this.prisma.prestationTemplate.count({ where }),
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

  async findOne(id: string): Promise<PrestationTemplate> {
    const template = await this.prisma.prestationTemplate.findUnique({
      where: { id },
    });

    if (!template) {
      throw new NotFoundException(`Template ${id} non trouve`);
    }

    return template;
  }

  async create(createTemplateDto: CreateTemplateDto, userId?: string): Promise<PrestationTemplate> {
    return this.prisma.prestationTemplate.create({
      data: {
        ...createTemplateDto,
        createdBy: userId,
      },
    });
  }

  async update(id: string, updateTemplateDto: UpdateTemplateDto): Promise<PrestationTemplate> {
    await this.findOne(id);

    return this.prisma.prestationTemplate.update({
      where: { id },
      data: updateTemplateDto,
    });
  }

  async remove(id: string): Promise<PrestationTemplate> {
    await this.findOne(id);

    return this.prisma.prestationTemplate.delete({
      where: { id },
    });
  }
}
