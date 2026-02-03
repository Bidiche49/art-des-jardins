import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { SecurityAlertService } from '../alerts/security-alert.service';

interface AuditLogFilters {
  page?: number;
  limit?: number;
  userId?: string;
  action?: string;
  entite?: string;
  dateDebut?: string;
  dateFin?: string;
}

interface CreateAuditLogDto {
  userId?: string;
  action: string;
  entite: string;
  entiteId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class AuditService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => SecurityAlertService))
    private securityAlertService: SecurityAlertService,
  ) {}

  async log(data: CreateAuditLogDto): Promise<any> {
    const auditLog = await this.prisma.auditLog.create({
      data: {
        userId: data.userId,
        action: data.action,
        entite: data.entite,
        entiteId: data.entiteId,
        details: data.details as any,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
      },
    });

    // Verifier les patterns de securite suspects (async, ne bloque pas)
    if (data.entite === 'auth') {
      this.securityAlertService
        .checkAndAlert({
          action: data.action,
          userId: data.userId,
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
          details: data.details,
        })
        .catch(() => {
          // Ignore les erreurs de securite alert pour ne pas bloquer l'audit
        });
    }

    return auditLog;
  }

  async findAll(filters: AuditLogFilters): Promise<any> {
    const { page = 1, limit = 50, userId, action, entite, dateDebut, dateFin } = filters;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (userId) {
      where.userId = userId;
    }

    if (action) {
      where.action = { contains: action, mode: 'insensitive' };
    }

    if (entite) {
      where.entite = entite;
    }

    if (dateDebut || dateFin) {
      where.createdAt = {};
      if (dateDebut) {
        (where.createdAt as Record<string, unknown>).gte = new Date(dateDebut);
      }
      if (dateFin) {
        (where.createdAt as Record<string, unknown>).lte = new Date(dateFin);
      }
    }

    const [data, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { id: true, nom: true, prenom: true, email: true },
          },
        },
      }),
      this.prisma.auditLog.count({ where }),
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

  async exportCsv(filters: Omit<AuditLogFilters, 'page' | 'limit'>) {
    const { userId, action, entite, dateDebut, dateFin } = filters;

    const where: Record<string, unknown> = {};

    if (userId) where.userId = userId;
    if (action) where.action = { contains: action, mode: 'insensitive' };
    if (entite) where.entite = entite;
    if (dateDebut || dateFin) {
      where.createdAt = {};
      if (dateDebut) (where.createdAt as Record<string, unknown>).gte = new Date(dateDebut);
      if (dateFin) (where.createdAt as Record<string, unknown>).lte = new Date(dateFin);
    }

    const logs = await this.prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { nom: true, prenom: true, email: true },
        },
      },
    });

    // Generate CSV
    const headers = ['Date', 'Utilisateur', 'Email', 'Action', 'Entite', 'EntiteId', 'IP', 'Details'];
    const rows = logs.map((log) => [
      log.createdAt.toISOString(),
      log.user ? `${log.user.prenom} ${log.user.nom}` : 'Systeme',
      log.user?.email || '',
      log.action,
      log.entite,
      log.entiteId || '',
      log.ipAddress || '',
      JSON.stringify(log.details || {}),
    ]);

    const csv = [headers.join(';'), ...rows.map((row) => row.join(';'))].join('\n');

    return csv;
  }
}
