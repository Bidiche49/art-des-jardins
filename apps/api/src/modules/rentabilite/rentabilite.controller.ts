import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RentabiliteService } from './rentabilite.service';
import { RapportFilterDto } from './dto/rapport-filter.dto';
import { RentabiliteDto } from './dto/rentabilite.dto';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class RentabiliteController {
  constructor(private readonly rentabiliteService: RentabiliteService) {}

  /**
   * GET /api/v1/chantiers/:chantierId/rentabilite
   * Retourne la rentabilite d'un chantier specifique
   */
  @Get('chantiers/:chantierId/rentabilite')
  @Roles('patron', 'employe')
  async getRentabiliteChantier(
    @Param('chantierId') chantierId: string,
  ): Promise<RentabiliteDto> {
    return this.rentabiliteService.calculerRentabilite(chantierId);
  }

  /**
   * GET /api/v1/rentabilite/rapport
   * Retourne un rapport de rentabilite pour une periode
   */
  @Get('rentabilite/rapport')
  @Roles('patron')
  async getRapportRentabilite(
    @Query() filters: RapportFilterDto,
  ): Promise<RentabiliteDto[]> {
    return this.rentabiliteService.genererRapport(filters.dateDebut, filters.dateFin);
  }
}
