import {
  Controller,
  Get,
  Query,
  UseGuards,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AuditService } from './audit.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@art-et-jardin/database';
import { SecurityLogsQueryDto } from './dto/security-logs-query.dto';

@ApiTags('Admin - Security Logs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.patron)
@Controller('admin/security-logs')
export class SecurityLogsController {
  constructor(private auditService: AuditService) {}

  @Get()
  @ApiOperation({ summary: 'Liste des logs de securite (admin uniquement)' })
  @ApiResponse({ status: 200, description: 'Liste paginee des logs de securite' })
  @ApiResponse({ status: 401, description: 'Non authentifie' })
  @ApiResponse({ status: 403, description: 'Acces refuse - role admin requis' })
  @ApiQuery({ name: 'type', required: false, description: 'Type d\'action (LOGIN_FAILED, LOGIN_SUCCESS, etc.)' })
  @ApiQuery({ name: 'userId', required: false, description: 'ID utilisateur' })
  @ApiQuery({ name: 'from', required: false, description: 'Date debut (ISO)' })
  @ApiQuery({ name: 'to', required: false, description: 'Date fin (ISO)' })
  @ApiQuery({ name: 'severity', required: false, enum: ['info', 'warning', 'critical'] })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(@Query() query: SecurityLogsQueryDto) {
    return this.auditService.findSecurityLogs(query);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Statistiques des logs de securite (admin uniquement)' })
  @ApiResponse({ status: 200, description: 'Statistiques de securite' })
  @ApiResponse({ status: 401, description: 'Non authentifie' })
  @ApiResponse({ status: 403, description: 'Acces refuse - role admin requis' })
  @ApiQuery({ name: 'from', required: false, description: 'Date debut pour les stats (ISO)' })
  @ApiQuery({ name: 'to', required: false, description: 'Date fin pour les stats (ISO)' })
  async getStats(
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.auditService.getSecurityStats(from, to);
  }

  @Get('export')
  @ApiOperation({ summary: 'Export CSV des logs de securite (admin uniquement)' })
  @ApiResponse({ status: 200, description: 'Fichier CSV' })
  @ApiResponse({ status: 401, description: 'Non authentifie' })
  @ApiResponse({ status: 403, description: 'Acces refuse - role admin requis' })
  async exportCsv(
    @Res() res: Response,
    @Query() query: SecurityLogsQueryDto,
  ) {
    const csv = await this.auditService.exportSecurityLogsCsv(query);
    const filename = `security_logs_${new Date().toISOString().split('T')[0]}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csv);
  }
}
