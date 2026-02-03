import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Request,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RelancesService } from './relances.service';
import { RelancesCronService } from './relances.cron';
import { ForceRelanceDto } from './dto/force-relance.dto';

@ApiTags('relances')
@Controller('relances')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class RelancesController {
  constructor(
    private relancesService: RelancesService,
    private relancesCron: RelancesCronService,
  ) {}

  @Get('stats')
  @Roles('patron')
  @ApiOperation({ summary: 'Statistiques des relances' })
  @ApiResponse({ status: 200, description: 'Statistiques retournees' })
  async getStats() {
    return this.relancesService.getStats();
  }

  @Get('config')
  @Roles('patron')
  @ApiOperation({ summary: 'Configuration des relances' })
  @ApiResponse({ status: 200, description: 'Configuration retournee' })
  getConfig() {
    return this.relancesService.getConfig();
  }

  @Get('planned')
  @Roles('patron')
  @ApiOperation({ summary: 'Relances planifiees (prochain batch)' })
  @ApiResponse({ status: 200, description: 'Liste des relances planifiees' })
  async getPlannedRelances() {
    return this.relancesService.getPlannedRelances();
  }

  @Get('unpaid')
  @Roles('patron')
  @ApiOperation({ summary: 'Factures en retard de paiement' })
  @ApiResponse({ status: 200, description: 'Liste des factures impayees' })
  async getUnpaidFactures() {
    return this.relancesService.getUnpaidFactures();
  }

  @Get('facture/:id/history')
  @Roles('patron')
  @ApiOperation({ summary: 'Historique des relances d\'une facture' })
  @ApiResponse({ status: 200, description: 'Historique retourne' })
  async getFactureHistory(@Param('id', ParseUUIDPipe) id: string) {
    return this.relancesService.getRelanceHistory(id);
  }

  @Post('facture/:id/send')
  @Roles('patron')
  @ApiOperation({ summary: 'Envoyer une relance manuellement' })
  @ApiResponse({ status: 201, description: 'Relance envoyee' })
  @ApiResponse({ status: 400, description: 'Facture non eligible' })
  @ApiResponse({ status: 404, description: 'Facture non trouvee' })
  async forceRelance(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ForceRelanceDto,
    @Request() req: any,
  ) {
    return this.relancesService.sendRelance(id, dto.level, req.user.sub, true);
  }

  @Post('facture/:id/cancel')
  @Roles('patron')
  @ApiOperation({ summary: 'Annuler les relances auto pour une facture' })
  @ApiResponse({ status: 200, description: 'Relances annulees' })
  async cancelRelances(@Param('id', ParseUUIDPipe) id: string, @Request() req: any) {
    return this.relancesService.cancelRelances(id, req.user.sub);
  }

  @Post('facture/:id/enable')
  @Roles('patron')
  @ApiOperation({ summary: 'Reactiver les relances auto pour une facture' })
  @ApiResponse({ status: 200, description: 'Relances reactivees' })
  async enableRelances(@Param('id', ParseUUIDPipe) id: string, @Request() req: any) {
    return this.relancesService.enableRelances(id, req.user.sub);
  }

  @Post('trigger')
  @Roles('patron')
  @ApiOperation({ summary: 'Declencher manuellement le traitement des relances' })
  @ApiResponse({ status: 201, description: 'Traitement effectue' })
  async triggerRelances() {
    return this.relancesCron.triggerManual();
  }
}
