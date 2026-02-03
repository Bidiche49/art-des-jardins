import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { BackupService } from './backup.service';

@ApiTags('Backup')
@Controller('admin/backup')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('patron')
@ApiBearerAuth()
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  @Post()
  @ApiOperation({ summary: 'Declencher un backup manuel' })
  @ApiResponse({ status: 201, description: 'Backup cree avec succes' })
  @ApiResponse({ status: 500, description: 'Erreur lors du backup' })
  async createBackup() {
    const result = await this.backupService.createBackup();
    return {
      message: 'Backup cree avec succes',
      ...result,
    };
  }

  @Get('history')
  @ApiOperation({ summary: 'Historique des backups' })
  @ApiResponse({ status: 200, description: 'Liste des backups' })
  async getHistory() {
    return this.backupService.getBackupHistory();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Statistiques des backups' })
  @ApiResponse({ status: 200, description: 'Statistiques' })
  async getStats() {
    return this.backupService.getBackupStats();
  }

  @Get('last')
  @ApiOperation({ summary: 'Dernier backup reussi' })
  @ApiResponse({ status: 200, description: 'Dernier backup' })
  async getLastBackup() {
    const backup = await this.backupService.getLastSuccessfulBackup();
    if (!backup) {
      return { message: 'Aucun backup disponible' };
    }
    return backup;
  }
}
