import {
  Controller,
  Get,
  Param,
  UseGuards,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ExportService } from './export.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@art-et-jardin/database';

@ApiTags('Export')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.patron)
@Controller('export')
export class ExportController {
  constructor(private exportService: ExportService) {}

  @Get('tables')
  @ApiOperation({ summary: 'Lister les tables exportables' })
  @ApiResponse({ status: 200, description: 'Liste des tables' })
  getTables() {
    return {
      tables: this.exportService.getExportableTables(),
    };
  }

  @Get('csv/:table')
  @ApiOperation({ summary: 'Exporter une table en CSV' })
  @ApiParam({ name: 'table', description: 'Nom de la table (clients, chantiers, devis, factures, interventions, users)' })
  @ApiResponse({ status: 200, description: 'Fichier CSV' })
  @ApiResponse({ status: 400, description: 'Table non exportable' })
  async exportCsv(@Param('table') table: string, @Res() res: Response) {
    const csv = await this.exportService.exportCsv(table as any);

    const filename = `${table}_${new Date().toISOString().split('T')[0]}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send('\ufeff' + csv); // BOM for Excel UTF-8 compatibility
  }

  @Get('full')
  @ApiOperation({ summary: 'Exporter toutes les donnees en ZIP' })
  @ApiResponse({ status: 200, description: 'Fichier ZIP contenant tous les CSV' })
  async exportFull(@Res() res: Response) {
    const filename = `export_complet_${new Date().toISOString().split('T')[0]}.zip`;

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    await this.exportService.exportFull(res);
  }
}
