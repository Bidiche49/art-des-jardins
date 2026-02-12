import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { InterventionsService } from './interventions.service';
import { CreateInterventionDto } from './dto/create-intervention.dto';
import { UpdateInterventionDto } from './dto/update-intervention.dto';
import { InterventionFiltersDto } from './dto/intervention-filters.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@art-et-jardin/database';

@ApiTags('Interventions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('interventions')
export class InterventionsController {
  constructor(private interventionsService: InterventionsService) {}

  @Get()
  @ApiOperation({ summary: 'Lister les interventions' })
  @ApiResponse({ status: 200, description: 'Liste paginee des interventions' })
  findAll(@Query() filters: InterventionFiltersDto) {
    return this.interventionsService.findAll(filters);
  }

  @Get('en-cours')
  @ApiOperation({ summary: 'Obtenir l\'intervention en cours de l\'utilisateur' })
  @ApiResponse({ status: 200, description: 'Intervention en cours ou null' })
  getEnCours(@Request() req: any) {
    return this.interventionsService.getInterventionEnCours(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir une intervention' })
  @ApiResponse({ status: 200, description: 'Details de l\'intervention' })
  @ApiResponse({ status: 404, description: 'Intervention non trouvee' })
  findOne(@Param('id') id: string) {
    return this.interventionsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Creer une intervention' })
  @ApiResponse({ status: 201, description: 'Intervention creee' })
  create(@Body() createInterventionDto: CreateInterventionDto, @Request() req: any) {
    return this.interventionsService.create(createInterventionDto, req.user.id);
  }

  @Post('start/:chantierId')
  @ApiOperation({ summary: 'Demarrer un pointage rapide' })
  @ApiResponse({ status: 201, description: 'Pointage demarre' })
  @ApiResponse({ status: 400, description: 'Intervention deja en cours' })
  startIntervention(
    @Param('chantierId') chantierId: string,
    @Body('description') description: string,
    @Request() req: any,
  ) {
    return this.interventionsService.startIntervention(chantierId, req.user.id, description);
  }

  @Post(':id/stop')
  @ApiOperation({ summary: 'Arreter un pointage' })
  @ApiResponse({ status: 200, description: 'Pointage arrete, duree calculee' })
  @ApiResponse({ status: 400, description: 'Intervention deja terminee' })
  stopIntervention(@Param('id') id: string, @Request() req: any) {
    return this.interventionsService.stopIntervention(id, req.user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Modifier une intervention' })
  @ApiResponse({ status: 200, description: 'Intervention modifiee' })
  update(@Param('id') id: string, @Body() updateInterventionDto: UpdateInterventionDto) {
    return this.interventionsService.update(id, updateInterventionDto);
  }

  @Patch(':id/valider')
  @Roles(UserRole.patron)
  @ApiOperation({ summary: 'Valider une intervention (patron uniquement)' })
  @ApiResponse({ status: 200, description: 'Intervention validee' })
  valider(@Param('id') id: string) {
    return this.interventionsService.valider(id);
  }

  @Delete(':id')
  @Roles(UserRole.patron)
  @ApiOperation({ summary: 'Supprimer une intervention (patron uniquement)' })
  @ApiResponse({ status: 200, description: 'Intervention supprimee' })
  remove(@Param('id') id: string) {
    return this.interventionsService.remove(id);
  }
}
