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
import { MaterialUsagesService } from './material-usages.service';
import { CreateMaterialUsageDto } from './dto/create-material-usage.dto';
import { UpdateMaterialUsageDto } from './dto/update-material-usage.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('Materials')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class MaterialUsagesController {
  constructor(private materialUsagesService: MaterialUsagesService) {}

  @Post('chantiers/:chantierId/materials')
  @ApiOperation({ summary: 'Ajouter un materiau a un chantier' })
  @ApiResponse({ status: 201, description: 'Materiau cree avec cout total calcule' })
  @ApiResponse({ status: 404, description: 'Chantier non trouve' })
  create(
    @Param('chantierId') chantierId: string,
    @Body() createMaterialUsageDto: CreateMaterialUsageDto,
  ): Promise<unknown> {
    return this.materialUsagesService.create(chantierId, createMaterialUsageDto);
  }

  @Get('chantiers/:chantierId/materials')
  @ApiOperation({ summary: 'Lister les materiaux d\'un chantier' })
  @ApiResponse({ status: 200, description: 'Liste des materiaux du chantier' })
  @ApiResponse({ status: 404, description: 'Chantier non trouve' })
  findByChantier(@Param('chantierId') chantierId: string): Promise<unknown[]> {
    return this.materialUsagesService.findByChantier(chantierId);
  }

  @Get('materials/:id')
  @ApiOperation({ summary: 'Obtenir un materiau' })
  @ApiResponse({ status: 200, description: 'Details du materiau' })
  @ApiResponse({ status: 404, description: 'Materiau non trouve' })
  findOne(@Param('id') id: string): Promise<unknown> {
    return this.materialUsagesService.findOne(id);
  }

  @Put('materials/:id')
  @ApiOperation({ summary: 'Modifier un materiau' })
  @ApiResponse({ status: 200, description: 'Materiau modifie avec cout total recalcule' })
  @ApiResponse({ status: 404, description: 'Materiau non trouve' })
  update(
    @Param('id') id: string,
    @Body() updateMaterialUsageDto: UpdateMaterialUsageDto,
  ): Promise<unknown> {
    return this.materialUsagesService.update(id, updateMaterialUsageDto);
  }

  @Delete('materials/:id')
  @ApiOperation({ summary: 'Supprimer un materiau' })
  @ApiResponse({ status: 200, description: 'Materiau supprime' })
  @ApiResponse({ status: 404, description: 'Materiau non trouve' })
  remove(@Param('id') id: string): Promise<unknown> {
    return this.materialUsagesService.remove(id);
  }
}
