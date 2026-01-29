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
import { FacturesService } from './factures.service';
import { CreateFactureDto } from './dto/create-facture.dto';
import { UpdateFactureDto } from './dto/update-facture.dto';
import { FactureFiltersDto } from './dto/facture-filters.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole, FactureStatut } from '@art-et-jardin/database';
import { PdfService } from '../pdf/pdf.service';
import { MailService } from '../mail/mail.service';

@ApiTags('Factures')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('factures')
export class FacturesController {
  constructor(
    private facturesService: FacturesService,
    private pdfService: PdfService,
    private mailService: MailService,
  ) {}

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

  @Get(':id/pdf')
  @ApiOperation({ summary: 'Telecharger le PDF de la facture' })
  @ApiProduces('application/pdf')
  @ApiResponse({ status: 200, description: 'PDF de la facture' })
  @ApiResponse({ status: 404, description: 'Facture non trouvee' })
  async getPdf(@Param('id') id: string, @Res({ passthrough: true }) res: Response) {
    const facture = await this.facturesService.findOneWithDetails(id);
    const client = facture.devis.chantier.client;

    const pdfBuffer = await this.pdfService.generateFacture({
      numero: facture.numero,
      dateCreation: facture.dateEmission,
      dateEcheance: facture.dateEcheance,
      devisNumero: facture.devis.numero,
      client: {
        nom: client.nom,
        prenom: client.prenom || undefined,
        raisonSociale: client.raisonSociale || undefined,
        adresse: client.adresse,
        codePostal: client.codePostal,
        ville: client.ville,
        email: client.email,
      },
      lignes: facture.lignes.map((l) => ({
        designation: l.description,
        quantite: Number(l.quantite),
        unite: l.unite,
        prixUnitaire: Number(l.prixUnitaireHT),
        montantHT: Number(l.montantHT),
      })),
      totalHT: Number(facture.totalHT),
      tauxTVA: 20,
      montantTVA: Number(facture.totalTVA),
      totalTTC: Number(facture.totalTTC),
      notes: facture.notes || undefined,
    });

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="facture-${facture.numero}.pdf"`,
    });

    return new StreamableFile(pdfBuffer);
  }

  @Post(':id/send')
  @ApiOperation({ summary: 'Envoyer la facture par email au client' })
  @ApiResponse({ status: 200, description: 'Facture envoyee' })
  @ApiResponse({ status: 404, description: 'Facture non trouvee' })
  async sendByEmail(@Param('id') id: string) {
    const facture = await this.facturesService.findOneWithDetails(id);
    const client = facture.devis.chantier.client;
    const clientName = client.raisonSociale || `${client.prenom || ''} ${client.nom}`.trim();

    const pdfBuffer = await this.pdfService.generateFacture({
      numero: facture.numero,
      dateCreation: facture.dateEmission,
      dateEcheance: facture.dateEcheance,
      devisNumero: facture.devis.numero,
      client: {
        nom: client.nom,
        prenom: client.prenom || undefined,
        raisonSociale: client.raisonSociale || undefined,
        adresse: client.adresse,
        codePostal: client.codePostal,
        ville: client.ville,
        email: client.email,
      },
      lignes: facture.lignes.map((l) => ({
        designation: l.description,
        quantite: Number(l.quantite),
        unite: l.unite,
        prixUnitaire: Number(l.prixUnitaireHT),
        montantHT: Number(l.montantHT),
      })),
      totalHT: Number(facture.totalHT),
      tauxTVA: 20,
      montantTVA: Number(facture.totalTVA),
      totalTTC: Number(facture.totalTTC),
      notes: facture.notes || undefined,
    });

    const sent = await this.mailService.sendFacture(client.email, facture.numero, clientName, pdfBuffer);

    // Update status to 'envoyee' if sent successfully
    if (sent) {
      await this.facturesService.updateStatut(id, 'envoyee' as any);
    }

    return { success: sent, email: client.email };
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
