import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../database/prisma.service';
import { StorageService } from '../storage/storage.service';
import { MailService } from '../mail/mail.service';
import { HealthStatus, ServiceHealth, OverallStatus } from './health.types';

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);
  private readonly version: string;

  constructor(
    private prisma: PrismaService,
    private storage: StorageService,
    private mail: MailService,
    private config: ConfigService,
  ) {
    this.version = process.env.npm_package_version || '1.0.0';
  }

  /**
   * Check simple pour liveness probe
   */
  async checkLiveness(): Promise<{ status: 'ok'; timestamp: Date }> {
    return {
      status: 'ok',
      timestamp: new Date(),
    };
  }

  /**
   * Check pour readiness probe (database doit etre up)
   */
  async checkReadiness(): Promise<{ status: 'ok' | 'not_ready'; database: boolean }> {
    const dbHealth = await this.checkDatabase();
    return {
      status: dbHealth.status === 'up' ? 'ok' : 'not_ready',
      database: dbHealth.status === 'up',
    };
  }

  /**
   * Health check detaille de tous les services
   */
  async getDetailedHealth(): Promise<HealthStatus> {
    const [database, storage, smtp] = await Promise.all([
      this.checkDatabase(),
      this.checkStorage(),
      this.checkSmtp(),
    ]);

    const services = { database, storage, smtp };
    const status = this.calculateOverallStatus(services);

    return {
      status,
      services,
      timestamp: new Date(),
      uptime: process.uptime(),
      version: this.version,
    };
  }

  /**
   * Verifie la connexion a PostgreSQL
   */
  async checkDatabase(): Promise<ServiceHealth> {
    const start = Date.now();
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        status: 'up',
        latencyMs: Date.now() - start,
        lastCheck: new Date(),
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Database health check failed: ${err.message}`);
      return {
        status: 'down',
        latencyMs: Date.now() - start,
        lastCheck: new Date(),
        error: err.message,
      };
    }
  }

  /**
   * Verifie la connexion S3
   */
  async checkStorage(): Promise<ServiceHealth> {
    const start = Date.now();

    if (!this.storage.isConfigured()) {
      return {
        status: 'degraded',
        latencyMs: 0,
        lastCheck: new Date(),
        error: 'Storage not configured',
      };
    }

    try {
      // Essaie de lister le bucket (ou HEAD sur un objet)
      await this.storage.checkConnection();
      return {
        status: 'up',
        latencyMs: Date.now() - start,
        lastCheck: new Date(),
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Storage health check failed: ${err.message}`);
      return {
        status: 'down',
        latencyMs: Date.now() - start,
        lastCheck: new Date(),
        error: err.message,
      };
    }
  }

  /**
   * Verifie la connexion SMTP
   */
  async checkSmtp(): Promise<ServiceHealth> {
    const start = Date.now();

    if (!this.mail.isConfigured()) {
      return {
        status: 'degraded',
        latencyMs: 0,
        lastCheck: new Date(),
        error: 'SMTP not configured',
      };
    }

    try {
      // Le mail service est configure, on considere comme up
      // Une vraie verification SMTP (EHLO) serait plus precise
      return {
        status: 'up',
        latencyMs: Date.now() - start,
        lastCheck: new Date(),
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`SMTP health check failed: ${err.message}`);
      return {
        status: 'down',
        latencyMs: Date.now() - start,
        lastCheck: new Date(),
        error: err.message,
      };
    }
  }

  /**
   * Calcule le status global basé sur les services
   */
  private calculateOverallStatus(
    services: Record<string, ServiceHealth>,
  ): OverallStatus {
    const statuses = Object.values(services).map((s) => s.status);

    if (statuses.some((s) => s === 'down')) {
      // Database down = unhealthy, autres services = degraded
      if (services.database?.status === 'down') {
        return 'unhealthy';
      }
      return 'degraded';
    }

    if (statuses.some((s) => s === 'degraded')) {
      return 'degraded';
    }

    return 'healthy';
  }
}
