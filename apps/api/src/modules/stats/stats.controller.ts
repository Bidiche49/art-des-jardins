import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('stats')
@UseGuards(JwtAuthGuard)
export class StatsController {
  @Get('dashboard')
  async getDashboard() {
    return {
      clientsActifs: 0,
      chantiersEnCours: 0,
      devisEnAttente: 0,
      caAnnuel: 0,
    };
  }

  @Get('ca')
  async getChiffreAffaires(@Query('annee') annee: string) {
    return {
      annee: parseInt(annee) || new Date().getFullYear(),
      total: 0,
      parMois: Array(12).fill(0),
    };
  }

  @Get('interventions-a-venir')
  async getInterventionsAVenir(@Query('jours') jours: string) {
    return [];
  }
}
