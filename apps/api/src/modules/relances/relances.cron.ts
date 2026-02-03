import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { RelancesService } from './relances.service';
import { TriggerResult } from './relances.types';

@Injectable()
export class RelancesCronService implements OnModuleInit {
  private readonly logger = new Logger(RelancesCronService.name);

  constructor(private relancesService: RelancesService) {}

  onModuleInit() {
    const config = this.relancesService.getConfig();
    if (config.enabled) {
      this.logger.log(
        `Relances automatiques activees - J+${config.j1}/J+${config.j2}/J+${config.j3} - Execution quotidienne a 9h`,
      );
    } else {
      this.logger.warn('Relances automatiques desactivees - activer avec RELANCE_ENABLED=true');
    }
  }

  /**
   * Cron job quotidien a 9h du matin
   * Verifie les factures en retard et envoie les relances necessaires
   */
  @Cron('0 9 * * *', {
    name: 'daily-relances',
    timeZone: 'Europe/Paris',
  })
  async handleDailyRelances() {
    if (!this.relancesService.isEnabled()) {
      return;
    }

    this.logger.log('Debut du traitement des relances automatiques...');

    try {
      const factures = await this.relancesService.getUnpaidFactures();
      this.logger.log(`${factures.length} facture(s) en retard detectee(s)`);

      let sent = 0;
      let skipped = 0;
      let errors = 0;

      for (const facture of factures) {
        const nextLevel = this.relancesService.determineNextLevel(
          facture.joursRetard,
          facture.lastRelance?.level || null,
        );

        if (!nextLevel) {
          skipped++;
          continue;
        }

        this.logger.debug(
          `Facture ${facture.numero}: ${facture.joursRetard}j retard, niveau suivant: ${nextLevel}`,
        );

        const result = await this.relancesService.sendRelance(
          facture.id,
          nextLevel,
          undefined, // Pas de userId pour les relances auto
          false, // auto, pas manual
        );

        if (result.success) {
          sent++;
        } else {
          errors++;
          this.logger.error(`Echec relance ${facture.numero}: ${result.error}`);
        }
      }

      this.logger.log(
        `Relances terminees: ${sent} envoyee(s), ${skipped} sautee(s), ${errors} erreur(s)`,
      );
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Erreur traitement relances: ${err.message}`, err.stack);
    }
  }

  /**
   * Trigger manuel pour tests (appele via API)
   */
  async triggerManual(): Promise<TriggerResult> {
    const factures = await this.relancesService.getUnpaidFactures();
    const details: Array<{
      factureNumero: string;
      level: string;
      success: boolean;
      error?: string;
    }> = [];

    let sent = 0;
    let skipped = 0;
    let errors = 0;

    for (const facture of factures) {
      const nextLevel = this.relancesService.determineNextLevel(
        facture.joursRetard,
        facture.lastRelance?.level || null,
      );

      if (!nextLevel) {
        skipped++;
        continue;
      }

      const result = await this.relancesService.sendRelance(
        facture.id,
        nextLevel,
        undefined,
        false,
      );

      details.push({
        factureNumero: facture.numero,
        level: nextLevel,
        success: result.success,
        error: result.error,
      });

      if (result.success) {
        sent++;
      } else {
        errors++;
      }
    }

    return {
      processed: factures.length,
      sent,
      skipped,
      errors,
      details,
    };
  }
}
