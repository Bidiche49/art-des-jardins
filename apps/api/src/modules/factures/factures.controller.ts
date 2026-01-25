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
import { FacturesService } from './factures.service';
import { CreateFactureDto } from './dto/create-facture.dto';
import { UpdateFactureDto } from './dto/update-facture.dto';
import { FactureFiltersDto } from './dto/facture-filters.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole, FactureStatut } from '@art-et-jardin/database';

@ApiTags('Factures')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('factures')
export class FacturesController {
  constructor(private facturesService: FacturesService) {}

  @Get()
  @ApiOperation({ summary: 'Lister les factures' })
  @ApiResponse({ status: 200, description: 'Liste paginee des factures' })
  findAll(@Query() filters: FactureFiltersDto) {
    return this.facturesService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir une facture' })
  @ApiResponse({ status: 200, description: 'Details de la facture avec lignes' })
  @ApiResponse({ status: 404, description: 'Facture non trouvee' })
  findOne(@Param('id') id: string) {
    return this.facturesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Creer une facture depuis un devis' })
  @ApiResponse({ status: 201, description: 'Facture creee' })
  @ApiResponse({ status: 400, description: 'Devis non accepte ou deja facture' })
  create(@Body() createFactureDto: CreateFactureDto) {
    return this.facturesService.create(createFactureDto);
  }

  @Post('from-devis/:devisId')
  @ApiOperation({ summary: 'Creer une facture depuis un devis (raccourci)' })
  @ApiResponse({ status: 201, description: 'Facture creee depuis le devis' })
  createFromDevis(@Param('devisId') devisId: string) {
    return this.facturesService.createFromDevis(devisId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Modifier une facture' })
  @ApiResponse({ status: 200, description: 'Facture modifiee' })
  update(@Param('id') id: string, @Body() updateFactureDto: UpdateFactureDto) {
    return this.facturesService.update(id, updateFactureDto);
  }

  @Patch(':id/statut')
  @ApiOperation({ summary: 'Changer le statut de la facture' })
  @ApiResponse({ status: 200, description: 'Statut mis a jour' })
  updateStatut(@Param('id') id: string, @Body('statut') statut: FactureStatut) {
    return this.facturesService.updateStatut(id, statut);
  }

  @Patch(':id/payer')
  @ApiOperation({ summary: 'Marquer la facture comme payee' })
  @ApiResponse({ status: 200, description: 'Facture marquee comme payee' })
  marquerPayee(
    @Param('id') id: string,
    @Body('modePaiement') modePaiement: string,
    @Body('referencePaiement') referencePaiement?: string,
  ) {
    return this.facturesService.marquerPayee(id, modePaiement, referencePaiement);
  }

  @Delete(':id')
  @Roles(UserRole.patron)
  @ApiOperation({ summary: 'Supprimer une facture (patron uniquement)' })
  @ApiResponse({ status: 200, description: 'Facture supprimee' })
  @ApiResponse({ status: 400, description: 'Facture payee non supprimable' })
  remove(@Param('id') id: string) {
    return this.facturesService.remove(id);
  }
}
