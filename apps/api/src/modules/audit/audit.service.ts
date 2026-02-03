import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { SecurityAlertService } from '../alerts/security-alert.service';
import {
  SecurityLogsQueryDto,
  SecurityStats,
  PaginatedSecurityLogs,
} from './dto/security-logs-query.dto';

interface AuditLogFilters {
  page?: number;
  limit?: number;
  userId?: string;
  action?: string;
  entite?: string;
  dateDebut?: string;
  dateFin?: string;
}

// Actions considerees comme critiques
const CRITICAL_ACTIONS = ['SUSPICIOUS_ACTIVITY', 'BRUTEFORCE_DETECTED', 'BRUTEFORCE_IP_DETECTED'];
// Actions considerees comme warning
const WARNING_ACTIONS = ['LOGIN_FAILED', 'PASSWORD_RESET_REQUESTED', 'ACCOUNT_LOCKED'];

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

  // =====================================================
  // Security Logs Methods (for admin dashboard)
  // =====================================================

  /**
   * Determine la severite d'une action de securite
   */
  private getSeverity(action: string): 'info' | 'warning' | 'critical' {
    if (CRITICAL_ACTIONS.includes(action)) return 'critical';
    if (WARNING_ACTIONS.includes(action)) return 'warning';
    return 'info';
  }

  /**
   * Retourne les logs de securite pagines avec filtres
   * Filtre uniquement sur entite = 'auth' ou 'security'
   */
  async findSecurityLogs(query: SecurityLogsQueryDto): Promise<PaginatedSecurityLogs> {
    const { type, userId, from, to, severity, page = 1, limit = 50 } = query;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {
      entite: { in: ['auth', 'security'] },
    };

    if (type) {
      where.action = type;
    }

    if (userId) {
      where.userId = userId;
    }

    if (from || to) {
      where.createdAt = {};
      if (from) (where.createdAt as Record<string, unknown>).gte = new Date(from);
      if (to) (where.createdAt as Record<string, unknown>).lte = new Date(to);
    }

    // Filtre par severite - necessite de filtrer par actions
    if (severity) {
      const actionsForSeverity = this.getActionsForSeverity(severity);
      if (type) {
        // Si un type est deja specifie, on verifie qu'il correspond a la severite
        if (!actionsForSeverity.includes(type)) {
          // Aucun resultat si le type ne correspond pas a la severite
          return {
            data: [],
            meta: { total: 0, page, limit, totalPages: 0 },
          };
        }
      } else {
        where.action = { in: actionsForSeverity };
      }
    }

    const [logs, total] = await Promise.all([
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

    const data = logs.map((log) => ({
      id: log.id,
      action: log.action,
      entite: log.entite,
      userId: log.userId,
      ipAddress: log.ipAddress,
      userAgent: log.userAgent,
      details: log.details as Record<string, unknown> | null,
      createdAt: log.createdAt,
      severity: this.getSeverity(log.action),
      user: log.user,
    }));

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

  /**
   * Retourne les actions correspondant a une severite
   */
  private getActionsForSeverity(severity: 'info' | 'warning' | 'critical'): string[] {
    if (severity === 'critical') return CRITICAL_ACTIONS;
    if (severity === 'warning') return WARNING_ACTIONS;
    // Pour 'info', on retourne tout sauf critical et warning
    return ['LOGIN_SUCCESS', 'LOGOUT', 'PASSWORD_CHANGED', 'TOKEN_REFRESHED'];
  }

  /**
   * Statistiques des logs de securite
   */
  async getSecurityStats(from?: string, to?: string): Promise<SecurityStats> {
    const where: Record<string, unknown> = {
      entite: { in: ['auth', 'security'] },
    };

    if (from || to) {
      where.createdAt = {};
      if (from) (where.createdAt as Record<string, unknown>).gte = new Date(from);
      if (to) (where.createdAt as Record<string, unknown>).lte = new Date(to);
    }

    // Total par type d'action
    const byAction = await this.prisma.auditLog.groupBy({
      by: ['action'],
      where,
      _count: { action: true },
    });

    const totalByType: Record<string, number> = {};
    byAction.forEach((item) => {
      totalByType[item.action] = item._count.action;
    });

    // Top users avec echecs de connexion
    const failedLogins = await this.prisma.auditLog.groupBy({
      by: ['userId'],
      where: {
        ...where,
        action: 'LOGIN_FAILED',
        userId: { not: null },
      },
      _count: { userId: true },
      orderBy: { _count: { userId: 'desc' } },
      take: 10,
    });

    // Recuperer les infos utilisateurs
    const userIds = failedLogins.map((f) => f.userId).filter((id): id is string => id !== null);
    const users = await this.prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, email: true, nom: true, prenom: true },
    });

    const userMap = new Map(users.map((u) => [u.id, u]));
    const topFailedUsers = failedLogins.map((f) => {
      const user = f.userId ? userMap.get(f.userId) : null;
      return {
        userId: f.userId!,
        email: user?.email || null,
        nom: user?.nom || null,
        prenom: user?.prenom || null,
        count: f._count.userId!,
      };
    });

    // Tendance journaliere (7 derniers jours)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailyLogs = await this.prisma.auditLog.findMany({
      where: {
        entite: { in: ['auth', 'security'] },
        createdAt: { gte: sevenDaysAgo },
      },
      select: { action: true, createdAt: true },
    });

    // Grouper par jour
    const dailyMap = new Map<string, { count: number; failedCount: number; successCount: number }>();
    dailyLogs.forEach((log) => {
      const dateKey = log.createdAt.toISOString().split('T')[0];
      if (!dailyMap.has(dateKey)) {
        dailyMap.set(dateKey, { count: 0, failedCount: 0, successCount: 0 });
      }
      const entry = dailyMap.get(dateKey)!;
      entry.count++;
      if (log.action === 'LOGIN_FAILED') entry.failedCount++;
      if (log.action === 'LOGIN_SUCCESS') entry.successCount++;
    });

    const dailyTrend = Array.from(dailyMap.entries())
      .map(([date, stats]) => ({ date, ...stats }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Comptage total et critiques
    const totalLogs = await this.prisma.auditLog.count({ where });
    const criticalCount = await this.prisma.auditLog.count({
      where: {
        ...where,
        action: { in: CRITICAL_ACTIONS },
      },
    });

    return {
      totalByType,
      topFailedUsers,
      dailyTrend,
      totalLogs,
      criticalCount,
    };
  }

  /**
   * Export CSV des logs de securite
   */
  async exportSecurityLogsCsv(query: SecurityLogsQueryDto): Promise<string> {
    const { type, userId, from, to, severity } = query;

    const where: Record<string, unknown> = {
      entite: { in: ['auth', 'security'] },
    };

    if (type) where.action = type;
    if (userId) where.userId = userId;
    if (from || to) {
      where.createdAt = {};
      if (from) (where.createdAt as Record<string, unknown>).gte = new Date(from);
      if (to) (where.createdAt as Record<string, unknown>).lte = new Date(to);
    }
    if (severity) {
      const actionsForSeverity = this.getActionsForSeverity(severity);
      if (!type) {
        where.action = { in: actionsForSeverity };
      }
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

    const headers = ['Date', 'Action', 'Severite', 'Utilisateur', 'Email', 'IP', 'UserAgent', 'Details'];
    const rows = logs.map((log) => {
      const sev = this.getSeverity(log.action);
      return [
        log.createdAt.toISOString(),
        log.action,
        sev,
        log.user ? `${log.user.prenom} ${log.user.nom}` : '',
        log.user?.email || '',
        log.ipAddress || '',
        (log.userAgent || '').replace(/;/g, ','),
        JSON.stringify(log.details || {}).replace(/;/g, ','),
      ];
    });

    return [headers.join(';'), ...rows.map((row) => row.join(';'))].join('\n');
  }
}
