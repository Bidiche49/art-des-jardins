import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { TimeEntriesService } from './time-entries.service';
import { CreateTimeEntryDto } from './dto/create-time-entry.dto';
import { UpdateTimeEntryDto } from './dto/update-time-entry.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('Time Entries')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class TimeEntriesController {
  constructor(private timeEntriesService: TimeEntriesService) {}

  @Post('interventions/:interventionId/time-entries')
  @ApiOperation({ summary: 'Creer une saisie d\'heures pour une intervention' })
  @ApiResponse({ status: 201, description: 'Saisie creee' })
  @ApiResponse({ status: 404, description: 'Intervention ou utilisateur non trouve' })
  create(
    @Param('interventionId') interventionId: string,
    @Body() createTimeEntryDto: CreateTimeEntryDto,
  ): Promise<unknown> {
    return this.timeEntriesService.create(interventionId, createTimeEntryDto);
  }

  @Get('interventions/:interventionId/time-entries')
  @ApiOperation({ summary: 'Lister les saisies d\'heures d\'une intervention' })
  @ApiResponse({ status: 200, description: 'Liste des saisies' })
  @ApiResponse({ status: 404, description: 'Intervention non trouvee' })
  findByIntervention(@Param('interventionId') interventionId: string): Promise<unknown[]> {
    return this.timeEntriesService.findByIntervention(interventionId);
  }

  @Get('time-entries/:id')
  @ApiOperation({ summary: 'Obtenir une saisie d\'heures' })
  @ApiResponse({ status: 200, description: 'Details de la saisie' })
  @ApiResponse({ status: 404, description: 'Saisie non trouvee' })
  findOne(@Param('id') id: string): Promise<unknown> {
    return this.timeEntriesService.findOne(id);
  }

  @Put('time-entries/:id')
  @ApiOperation({ summary: 'Modifier une saisie d\'heures' })
  @ApiResponse({ status: 200, description: 'Saisie modifiee' })
  @ApiResponse({ status: 404, description: 'Saisie non trouvee' })
  update(@Param('id') id: string, @Body() updateTimeEntryDto: UpdateTimeEntryDto): Promise<unknown> {
    return this.timeEntriesService.update(id, updateTimeEntryDto);
  }

  @Delete('time-entries/:id')
  @ApiOperation({ summary: 'Supprimer une saisie d\'heures' })
  @ApiResponse({ status: 200, description: 'Saisie supprimee' })
  @ApiResponse({ status: 404, description: 'Saisie non trouvee' })
  remove(@Param('id') id: string): Promise<unknown> {
    return this.timeEntriesService.remove(id);
  }
}
