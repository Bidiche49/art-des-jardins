import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AlertsService } from './alerts.service';
import { AlertsCronService } from './alerts.cron';

@ApiTags('alerts')
@Controller('alerts')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AlertsController {
  constructor(
    private alertsService: AlertsService,
    private alertsCron: AlertsCronService,
  ) {}

  @Get('stats')
  @Roles('patron')
  @ApiOperation({ summary: 'Statistiques et etat des alertes' })
  @ApiResponse({ status: 200, description: 'Stats retournees' })
  async getStats() {
    return this.alertsService.getStats();
  }

  @Get('config')
  @Roles('patron')
  @ApiOperation({ summary: 'Configuration des alertes' })
  @ApiResponse({ status: 200, description: 'Config retournee' })
  getConfig() {
    return this.alertsService.getConfig();
  }

  @Post('trigger')
  @Roles('patron')
  @ApiOperation({ summary: 'Declencher manuellement la verification' })
  @ApiResponse({ status: 201, description: 'Verification effectuee' })
  async trigger() {
    await this.alertsCron.triggerManual();
    return { status: 'ok', timestamp: new Date() };
  }

  @Post('test')
  @Roles('patron')
  @ApiOperation({ summary: 'Envoyer une alerte de test' })
  @ApiResponse({ status: 201, description: 'Alerte de test envoyee' })
  async sendTestAlert() {
    const success = await this.alertsService.sendAlert({
      type: 'SERVICE_RECOVERED',
      service: 'test',
      message: 'Ceci est une alerte de test',
      timestamp: new Date(),
    });
    return { success, timestamp: new Date() };
  }
}
