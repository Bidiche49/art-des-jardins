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
  Res,
  StreamableFile,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiProduces } from '@nestjs/swagger';
import { DevisService } from './devis.service';
import { CreateDevisDto } from './dto/create-devis.dto';
import { UpdateDevisDto } from './dto/update-devis.dto';
import { DevisFiltersDto } from './dto/devis-filters.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole, DevisStatut } from '@art-et-jardin/database';
import { PdfService } from '../pdf/pdf.service';
import { MailService } from '../mail/mail.service';

@ApiTags('Devis')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('devis')
export class DevisController {
  constructor(
    private devisService: DevisService,
    private pdfService: PdfService,
    private mailService: MailService,
  ) {}

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

  @Get(':id/pdf')
  @ApiOperation({ summary: 'Telecharger le PDF du devis' })
  @ApiProduces('application/pdf')
  @ApiResponse({ status: 200, description: 'PDF du devis (avec signature si signe)' })
  @ApiResponse({ status: 404, description: 'Devis non trouve' })
  async getPdf(@Param('id') id: string, @Res({ passthrough: true }) res: Response) {
    const devis = await this.devisService.findOneWithDetails(id);
    const client = devis.chantier.client;

    const pdfBuffer = await this.pdfService.generateDevis({
      numero: devis.numero,
      dateCreation: devis.dateCreation,
      dateValidite: devis.dateValidite,
      client: {
        nom: client.nom,
        prenom: client.prenom || undefined,
        raisonSociale: client.raisonSociale || undefined,
        adresse: client.adresse,
        codePostal: client.codePostal,
        ville: client.ville,
        email: client.email,
      },
      lignes: devis.lignes.map((l) => ({
        designation: l.designation,
        quantite: Number(l.quantite),
        unite: l.unite,
        prixUnitaire: Number(l.prixUnitaire),
        montantHT: Number(l.montantHT),
      })),
      totalHT: Number(devis.totalHT),
      tauxTVA: Number(devis.tauxTVA),
      montantTVA: Number(devis.montantTVA),
      totalTTC: Number(devis.totalTTC),
      notes: devis.notes || undefined,
      signature: devis.signature,
    });

    const filename = devis.signature
      ? `devis-${devis.numero}-signe.pdf`
      : `devis-${devis.numero}.pdf`;

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
    });

    return new StreamableFile(pdfBuffer);
  }

  @Post(':id/send')
  @ApiOperation({ summary: 'Envoyer le devis par email au client' })
  @ApiResponse({ status: 200, description: 'Devis envoye' })
  @ApiResponse({ status: 404, description: 'Devis non trouve' })
  async sendByEmail(@Param('id') id: string) {
    const devis = await this.devisService.findOneWithDetails(id);
    const client = devis.chantier.client;
    const clientName = client.raisonSociale || `${client.prenom || ''} ${client.nom}`.trim();

    const pdfBuffer = await this.pdfService.generateDevis({
      numero: devis.numero,
      dateCreation: devis.dateCreation,
      dateValidite: devis.dateValidite,
      client: {
        nom: client.nom,
        prenom: client.prenom || undefined,
        raisonSociale: client.raisonSociale || undefined,
        adresse: client.adresse,
        codePostal: client.codePostal,
        ville: client.ville,
        email: client.email,
      },
      lignes: devis.lignes.map((l) => ({
        designation: l.designation,
        quantite: Number(l.quantite),
        unite: l.unite,
        prixUnitaire: Number(l.prixUnitaire),
        montantHT: Number(l.montantHT),
      })),
      totalHT: Number(devis.totalHT),
      tauxTVA: Number(devis.tauxTVA),
      montantTVA: Number(devis.montantTVA),
      totalTTC: Number(devis.totalTTC),
      notes: devis.notes || undefined,
      signature: devis.signature,
    });

    const sent = await this.mailService.sendDevis(client.email, devis.numero, clientName, pdfBuffer);

    // Update status to 'envoye' if sent successfully
    if (sent) {
      await this.devisService.updateStatut(id, 'envoye' as any);
    }

    return { success: sent, email: client.email };
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
