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
import { AbsencesService } from './absences.service';
import { CreateAbsenceDto } from './dto/create-absence.dto';
import { UpdateAbsenceDto } from './dto/update-absence.dto';
import { AbsenceFiltersDto } from './dto/absence-filters.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@art-et-jardin/database';

@ApiTags('Absences')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('absences')
export class AbsencesController {
  constructor(private absencesService: AbsencesService) {}

  @Get()
  @ApiOperation({ summary: 'Lister les absences' })
  @ApiResponse({ status: 200, description: 'Liste paginee des absences' })
  findAll(@Query() filters: AbsenceFiltersDto) {
    return this.absencesService.findAll(filters);
  }

  @Get('pending')
  @Roles(UserRole.patron)
  @ApiOperation({ summary: 'Lister les absences en attente de validation (patron uniquement)' })
  @ApiResponse({ status: 200, description: 'Liste des absences a valider' })
  findPending(@Query() filters: AbsenceFiltersDto) {
    return this.absencesService.findAll({ ...filters, validee: false });
  }

  @Get('mes-absences')
  @ApiOperation({ summary: 'Mes absences' })
  @ApiResponse({ status: 200, description: 'Liste de mes absences' })
  findMine(@Query() filters: AbsenceFiltersDto, @Request() req: any) {
    return this.absencesService.findAll({ ...filters, userId: req.user.sub });
  }

  @Get('calendar')
  @ApiOperation({ summary: 'Absences pour le calendrier (periode)' })
  @ApiResponse({ status: 200, description: 'Absences validees pour la periode' })
  getForCalendar(
    @Query('dateDebut') dateDebut: string,
    @Query('dateFin') dateFin: string,
  ) {
    return this.absencesService.getAbsencesForPeriod(
      new Date(dateDebut),
      new Date(dateFin),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir une absence' })
  @ApiResponse({ status: 200, description: 'Details de l\'absence' })
  @ApiResponse({ status: 404, description: 'Absence non trouvee' })
  findOne(@Param('id') id: string) {
    return this.absencesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Declarer une absence' })
  @ApiResponse({ status: 201, description: 'Absence creee' })
  create(@Body() createAbsenceDto: CreateAbsenceDto, @Request() req: any) {
    return this.absencesService.create(
      createAbsenceDto,
      req.user.sub,
      req.user.role as UserRole,
    );
  }

  @Put(':id')
  @ApiOperation({ summary: 'Modifier une absence' })
  @ApiResponse({ status: 200, description: 'Absence modifiee' })
  update(
    @Param('id') id: string,
    @Body() updateAbsenceDto: UpdateAbsenceDto,
    @Request() req: any,
  ) {
    return this.absencesService.update(
      id,
      updateAbsenceDto,
      req.user.sub,
      req.user.role as UserRole,
    );
  }

  @Patch(':id/valider')
  @Roles(UserRole.patron)
  @ApiOperation({ summary: 'Valider une absence (patron uniquement)' })
  @ApiResponse({ status: 200, description: 'Absence validee' })
  valider(@Param('id') id: string) {
    return this.absencesService.valider(id);
  }

  @Patch(':id/refuser')
  @Roles(UserRole.patron)
  @ApiOperation({ summary: 'Refuser une absence (patron uniquement)' })
  @ApiResponse({ status: 200, description: 'Absence refusee' })
  refuser(@Param('id') id: string) {
    return this.absencesService.refuser(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une absence' })
  @ApiResponse({ status: 200, description: 'Absence supprimee' })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.absencesService.remove(
      id,
      req.user.sub,
      req.user.role as UserRole,
    );
  }
}
