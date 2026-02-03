import { Controller, Get, Param, Query, UseGuards, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { DocumentArchiveService } from './document-archive.service';
import { DocumentType } from '@art-et-jardin/database';

@ApiTags('Archives')
@Controller('admin/archives')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('patron', 'employe')
@ApiBearerAuth()
export class DocumentArchiveController {
  constructor(private readonly archiveService: DocumentArchiveService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Statistiques des archives' })
  @ApiResponse({ status: 200, description: 'Statistiques' })
  async getStats() {
    return this.archiveService.getArchiveStats();
  }

  @Get('search')
  @ApiOperation({ summary: 'Rechercher dans les archives' })
  @ApiQuery({ name: 'type', required: false, enum: ['devis', 'devis_signe', 'facture', 'relance'] })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Liste des archives' })
  async searchArchives(
    @Query('type') type?: DocumentType,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('limit') limit?: number,
  ): Promise<unknown[]> {
    return this.archiveService.searchArchives({
      documentType: type,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get(':type/:documentId')
  @ApiOperation({ summary: 'Recuperer les archives d\'un document' })
  @ApiResponse({ status: 200, description: 'Liste des versions archivees' })
  async getDocumentArchives(
    @Param('type') type: DocumentType,
    @Param('documentId') documentId: string,
  ): Promise<unknown[]> {
    return this.archiveService.getDocumentArchives(type, documentId);
  }

  @Get(':type/:documentId/download')
  @ApiOperation({ summary: 'Telecharger la derniere version archivee' })
  @ApiResponse({ status: 200, description: 'PDF archive' })
  @ApiResponse({ status: 404, description: 'Archive non trouvee' })
  async downloadArchive(
    @Param('type') type: DocumentType,
    @Param('documentId') documentId: string,
    @Res() res: Response,
  ): Promise<void> {
    const archive = await this.archiveService.getArchivedDocument(type, documentId) as { fileName: string; buffer: Buffer } | null;

    if (!archive) {
      res.status(404).json({ message: 'Archive non trouvee' });
      return;
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${archive.fileName}"`);
    res.setHeader('Content-Length', archive.buffer.length);
    res.send(archive.buffer);
  }

  @Get(':archiveId/verify')
  @Roles('patron')
  @ApiOperation({ summary: 'Verifier l\'integrite d\'une archive' })
  @ApiResponse({ status: 200, description: 'Resultat de la verification' })
  async verifyIntegrity(@Param('archiveId') archiveId: string) {
    const isValid = await this.archiveService.verifyArchiveIntegrity(archiveId);
    return {
      archiveId,
      integrityValid: isValid,
      checkedAt: new Date(),
    };
  }
}
