import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { EventsGateway } from '../websocket/events.gateway';
import { WS_EVENTS } from '../websocket/websocket.events';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ClientFiltersDto } from './dto/client-filters.dto';

@Injectable()
export class ClientsService {
  constructor(
    private prisma: PrismaService,
    private eventsGateway: EventsGateway,
  ) {}

  async findAll(filters: ClientFiltersDto) {
    const { page = 1, limit = 20, type, ville, search } = filters;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (type) {
      where.type = type;
    }

    if (ville) {
      where.ville = { contains: ville, mode: 'insensitive' };
    }

    if (search) {
      where.OR = [
        { nom: { contains: search, mode: 'insensitive' } },
        { prenom: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { raisonSociale: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.client.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.client.count({ where }),
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
    const client = await this.prisma.client.findUnique({
      where: { id },
      include: {
        chantiers: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!client) {
      throw new NotFoundException(`Client ${id} non trouve`);
    }

    return client;
  }

  async create(createClientDto: CreateClientDto) {
    const client = await this.prisma.client.create({
      data: createClientDto,
    });

    // Emit WebSocket event
    const displayName = client.raisonSociale || `${client.prenom || ''} ${client.nom}`.trim();
    this.eventsGateway.broadcast(WS_EVENTS.CLIENT_CREATED, {
      id: client.id,
      name: displayName,
      type: client.type,
    });

    return client;
  }

  async update(id: string, updateClientDto: UpdateClientDto) {
    await this.findOne(id); // Check exists

    return this.prisma.client.update({
      where: { id },
      data: updateClientDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Check exists

    return this.prisma.client.delete({
      where: { id },
    });
  }
}
