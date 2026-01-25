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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { ChantiersService } from './chantiers.service';
import { CreateChantierDto } from './dto/create-chantier.dto';
import { UpdateChantierDto } from './dto/update-chantier.dto';
import { ChantierFiltersDto } from './dto/chantier-filters.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@art-et-jardin/database';

@ApiTags('Chantiers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('chantiers')
export class ChantiersController {
  constructor(private chantiersService: ChantiersService) {}

  @Get()
  @ApiOperation({ summary: 'Lister les chantiers' })
  @ApiResponse({ status: 200, description: 'Liste paginee des chantiers' })
  findAll(@Query() filters: ChantierFiltersDto) {
    return this.chantiersService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un chantier' })
  @ApiResponse({ status: 200, description: 'Details du chantier' })
  @ApiResponse({ status: 404, description: 'Chantier non trouve' })
  findOne(@Param('id') id: string) {
    return this.chantiersService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Creer un chantier' })
  @ApiResponse({ status: 201, description: 'Chantier cree' })
  create(@Body() createChantierDto: CreateChantierDto) {
    return this.chantiersService.create(createChantierDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Modifier un chantier' })
  @ApiResponse({ status: 200, description: 'Chantier modifie' })
  @ApiResponse({ status: 404, description: 'Chantier non trouve' })
  update(@Param('id') id: string, @Body() updateChantierDto: UpdateChantierDto) {
    return this.chantiersService.update(id, updateChantierDto);
  }

  @Patch(':id/statut')
  @ApiOperation({ summary: 'Changer le statut du chantier' })
  @ApiResponse({ status: 200, description: 'Statut mis a jour' })
  updateStatut(@Param('id') id: string, @Body('statut') statut: string) {
    return this.chantiersService.updateStatut(id, statut);
  }

  @Delete(':id')
  @Roles(UserRole.patron)
  @ApiOperation({ summary: 'Supprimer un chantier (patron uniquement)' })
  @ApiResponse({ status: 200, description: 'Chantier supprime' })
  @ApiResponse({ status: 404, description: 'Chantier non trouve' })
  remove(@Param('id') id: string) {
    return this.chantiersService.remove(id);
  }
}
