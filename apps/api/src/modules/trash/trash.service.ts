import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../database/prisma.service';
import { AuditService } from '../audit/audit.service';
import { SoftDeleteEntity, TrashStats } from './trash.types';

@Injectable()
export class TrashService {
  private readonly logger = new Logger(TrashService.name);
  private readonly retentionDays: number;

  // Mapping des entités vers les modèles Prisma
  private readonly entityMap: Record<SoftDeleteEntity, string> = {
    client: 'client',
    chantier: 'chantier',
    devis: 'devis',
    facture: 'facture',
    intervention: 'intervention',
  };

  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
    private config: ConfigService,
  ) {
    this.retentionDays = parseInt(
      this.config.get('SOFT_DELETE_RETENTION_DAYS') || '90',
      10,
    );
  }

  /**
   * Liste les elements supprimes d'une entite
   */
  async listDeleted(
    entity: SoftDeleteEntity,
    page = 1,
    limit = 20,
  ): Promise<{ data: any[]; total: number }> {
    const model = this.getModel(entity);
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      model.findMany({
        where: { deletedAt: { not: null } },
        skip,
        take: limit,
        orderBy: { deletedAt: 'desc' },
      }),
      model.count({ where: { deletedAt: { not: null } } }),
    ]);

    return { data, total };
  }

  /**
   * Recupere un element supprime par ID
   */
  async getDeleted(entity: SoftDeleteEntity, id: string): Promise<any> {
    const model = this.getModel(entity);

    const item = await model.findFirst({
      where: { id, deletedAt: { not: null } },
    });

    if (!item) {
      throw new NotFoundException(`Element ${entity}/${id} non trouve dans la corbeille`);
    }

    return item;
  }

  /**
   * Restaure un element supprime
   */
  async restore(entity: SoftDeleteEntity, id: string, userId?: string): Promise<any> {
    const model = this.getModel(entity);

    // Verifier que l'element existe et est supprime
    const existing = await model.findFirst({
      where: { id, deletedAt: { not: null } },
    });

    if (!existing) {
      throw new NotFoundException(`Element ${entity}/${id} non trouve dans la corbeille`);
    }

    // Restaurer
    const restored = await model.update({
      where: { id },
      data: { deletedAt: null },
    });

    // Audit log
    await this.audit.log({
      userId,
      action: 'RESTORE',
      entite: this.capitalizeFirst(entity),
      entiteId: id,
      details: { entity, restoredAt: new Date() },
    });

    this.logger.log(`Restored ${entity}/${id}`);

    return restored;
  }

  /**
   * Supprime definitivement un element (purge)
   */
  async purge(entity: SoftDeleteEntity, id: string, userId?: string): Promise<void> {
    const model = this.getModel(entity);

    // Verifier que l'element existe et est supprime
    const existing = await model.findFirst({
      where: { id, deletedAt: { not: null } },
    });

    if (!existing) {
      throw new NotFoundException(`Element ${entity}/${id} non trouve dans la corbeille`);
    }

    // Supprimer definitivement
    await model.delete({ where: { id } });

    // Audit log
    await this.audit.log({
      userId,
      action: 'PURGE',
      entite: this.capitalizeFirst(entity),
      entiteId: id,
      details: { entity, purgedAt: new Date() },
    });

    this.logger.log(`Purged ${entity}/${id}`);
  }

  /**
   * Statistiques de la corbeille
   */
  async getStats(): Promise<TrashStats> {
    const [client, chantier, devis, facture, intervention] = await Promise.all([
      this.prisma.client.count({ where: { deletedAt: { not: null } } }),
      this.prisma.chantier.count({ where: { deletedAt: { not: null } } }),
      this.prisma.devis.count({ where: { deletedAt: { not: null } } }),
      this.prisma.facture.count({ where: { deletedAt: { not: null } } }),
      this.prisma.intervention.count({ where: { deletedAt: { not: null } } }),
    ]);

    return {
      client,
      chantier,
      devis,
      facture,
      intervention,
      total: client + chantier + devis + facture + intervention,
    };
  }

  /**
   * Cron job pour purger les elements supprimes depuis plus de retentionDays
   * Execute tous les jours a 3h du matin
   */
  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async autoPurge(): Promise<{ purged: number }> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.retentionDays);

    this.logger.log(`Auto-purging items deleted before ${cutoffDate.toISOString()}`);

    let purged = 0;

    for (const entity of Object.keys(this.entityMap) as SoftDeleteEntity[]) {
      try {
        const model = this.getModel(entity);
        const result = await model.deleteMany({
          where: { deletedAt: { lt: cutoffDate } },
        });
        purged += result.count;

        if (result.count > 0) {
          this.logger.log(`Purged ${result.count} ${entity}(s)`);
        }
      } catch (error) {
        const err = error as Error;
        this.logger.error(`Error purging ${entity}: ${err.message}`);
      }
    }

    this.logger.log(`Auto-purge completed: ${purged} items purged`);

    return { purged };
  }

  /**
   * Soft delete d'un element (utilise par les services)
   */
  async softDelete(
    entity: SoftDeleteEntity,
    id: string,
    userId?: string,
    cascade = false,
  ): Promise<any> {
    const model = this.getModel(entity);

    // Verifier que l'element existe
    const existing = await model.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Element ${entity}/${id} non trouve`);
    }

    if (existing.deletedAt) {
      throw new BadRequestException(`Element ${entity}/${id} deja supprime`);
    }

    // Soft delete
    const deleted = await model.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    // Cascade soft delete si demande
    if (cascade) {
      await this.cascadeSoftDelete(entity, id);
    }

    // Audit log
    await this.audit.log({
      userId,
      action: 'SOFT_DELETE',
      entite: this.capitalizeFirst(entity),
      entiteId: id,
      details: { entity, cascade },
    });

    this.logger.log(`Soft deleted ${entity}/${id}${cascade ? ' (cascade)' : ''}`);

    return deleted;
  }

  /**
   * Cascade soft delete pour les entites liees
   */
  private async cascadeSoftDelete(entity: SoftDeleteEntity, id: string): Promise<void> {
    const now = new Date();

    switch (entity) {
      case 'client':
        // Soft delete tous les chantiers du client
        const chantiers = await this.prisma.chantier.findMany({
          where: { clientId: id, deletedAt: null },
          select: { id: true },
        });
        for (const chantier of chantiers) {
          await this.cascadeSoftDelete('chantier', chantier.id);
        }
        await this.prisma.chantier.updateMany({
          where: { clientId: id, deletedAt: null },
          data: { deletedAt: now },
        });
        break;

      case 'chantier':
        // Soft delete tous les devis du chantier
        await this.prisma.devis.updateMany({
          where: { chantierId: id, deletedAt: null },
          data: { deletedAt: now },
        });
        // Soft delete toutes les interventions du chantier
        await this.prisma.intervention.updateMany({
          where: { chantierId: id, deletedAt: null },
          data: { deletedAt: now },
        });
        break;

      case 'devis':
        // Soft delete toutes les factures du devis
        await this.prisma.facture.updateMany({
          where: { devisId: id, deletedAt: null },
          data: { deletedAt: now },
        });
        break;
    }
  }

  /**
   * Obtient le modele Prisma pour une entite
   */
  private getModel(entity: SoftDeleteEntity): any {
    const modelName = this.entityMap[entity];
    if (!modelName) {
      throw new BadRequestException(`Entite inconnue: ${entity}`);
    }
    return (this.prisma as any)[modelName];
  }

  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
