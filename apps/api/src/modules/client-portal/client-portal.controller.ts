import { Controller, Get, Param, UseGuards, Req, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ClientPortalService } from './client-portal.service';
import { ClientAuthGuard } from '../client-auth/guards/client-auth.guard';
import { Request } from 'express';

interface ClientRequest extends Request {
  client: { id: string; email: string };
}

@ApiTags('Client Portal')
@ApiBearerAuth()
@UseGuards(ClientAuthGuard)
@Controller('client-portal')
export class ClientPortalController {
  constructor(private readonly clientPortalService: ClientPortalService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Obtenir le dashboard client' })
  async getDashboard(@Req() req: ClientRequest) {
    return this.clientPortalService.getDashboard(req.client.id);
  }

  @Get('devis')
  @ApiOperation({ summary: 'Liste des devis du client' })
  async getDevis(@Req() req: ClientRequest) {
    return this.clientPortalService.getDevis(req.client.id);
  }

  @Get('devis/:id')
  @ApiOperation({ summary: 'Détail d\'un devis' })
  async getDevisById(@Req() req: ClientRequest, @Param('id') id: string) {
    const devis = await this.clientPortalService.getDevisById(req.client.id, id);
    if (!devis) {
      throw new NotFoundException('Devis non trouvé');
    }
    return devis;
  }

  @Get('factures')
  @ApiOperation({ summary: 'Liste des factures du client' })
  async getFactures(@Req() req: ClientRequest) {
    return this.clientPortalService.getFactures(req.client.id);
  }

  @Get('factures/:id')
  @ApiOperation({ summary: 'Détail d\'une facture' })
  async getFactureById(@Req() req: ClientRequest, @Param('id') id: string) {
    const facture = await this.clientPortalService.getFactureById(req.client.id, id);
    if (!facture) {
      throw new NotFoundException('Facture non trouvée');
    }
    return facture;
  }

  @Get('chantiers')
  @ApiOperation({ summary: 'Liste des chantiers du client' })
  async getChantiers(@Req() req: ClientRequest) {
    return this.clientPortalService.getChantiers(req.client.id);
  }

  @Get('chantiers/:id')
  @ApiOperation({ summary: 'Détail d\'un chantier' })
  async getChantierById(@Req() req: ClientRequest, @Param('id') id: string) {
    const chantier = await this.clientPortalService.getChantierById(req.client.id, id);
    if (!chantier) {
      throw new NotFoundException('Chantier non trouvé');
    }
    return chantier;
  }
}
