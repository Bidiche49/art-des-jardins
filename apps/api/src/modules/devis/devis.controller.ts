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
import { DevisService } from './devis.service';
import { CreateDevisDto } from './dto/create-devis.dto';
import { UpdateDevisDto } from './dto/update-devis.dto';
import { DevisFiltersDto } from './dto/devis-filters.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole, DevisStatut } from '@art-et-jardin/database';

@ApiTags('Devis')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('devis')
export class DevisController {
  constructor(private devisService: DevisService) {}

  @Get()
  @ApiOperation({ summary: 'Lister les devis' })
  @ApiResponse({ status: 200, description: 'Liste paginee des devis' })
  findAll(@Query() filters: DevisFiltersDto) {
    return this.devisService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un devis' })
  @ApiResponse({ status: 200, description: 'Details du devis avec lignes' })
  @ApiResponse({ status: 404, description: 'Devis non trouve' })
  findOne(@Param('id') id: string) {
    return this.devisService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Creer un devis' })
  @ApiResponse({ status: 201, description: 'Devis cree avec numero auto-genere' })
  create(@Body() createDevisDto: CreateDevisDto) {
    return this.devisService.create(createDevisDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Modifier un devis (brouillon uniquement)' })
  @ApiResponse({ status: 200, description: 'Devis modifie' })
  @ApiResponse({ status: 400, description: 'Devis non modifiable (pas en brouillon)' })
  update(@Param('id') id: string, @Body() updateDevisDto: UpdateDevisDto) {
    return this.devisService.update(id, updateDevisDto);
  }

  @Patch(':id/statut')
  @ApiOperation({ summary: 'Changer le statut du devis' })
  @ApiResponse({ status: 200, description: 'Statut mis a jour' })
  updateStatut(@Param('id') id: string, @Body('statut') statut: DevisStatut) {
    return this.devisService.updateStatut(id, statut);
  }

  @Delete(':id')
  @Roles(UserRole.patron)
  @ApiOperation({ summary: 'Supprimer un devis (patron uniquement)' })
  @ApiResponse({ status: 200, description: 'Devis supprime' })
  @ApiResponse({ status: 400, description: 'Devis avec factures non supprimable' })
  remove(@Param('id') id: string) {
    return this.devisService.remove(id);
  }
}
