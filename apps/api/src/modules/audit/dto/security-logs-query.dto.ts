import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsDateString, IsInt, Min, Max, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class SecurityLogsQueryDto {
  @ApiPropertyOptional({ description: 'Type d\'action (LOGIN_FAILED, LOGIN_SUCCESS, SUSPICIOUS_ACTIVITY, etc.)' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ description: 'ID utilisateur' })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional({ description: 'Date debut (ISO format)' })
  @IsOptional()
  @IsDateString()
  from?: string;

  @ApiPropertyOptional({ description: 'Date fin (ISO format)' })
  @IsOptional()
  @IsDateString()
  to?: string;

  @ApiPropertyOptional({
    description: 'Severite: info, warning, critical',
    enum: ['info', 'warning', 'critical']
  })
  @IsOptional()
  @IsIn(['info', 'warning', 'critical'])
  severity?: 'info' | 'warning' | 'critical';

  @ApiPropertyOptional({ default: 1, description: 'Numero de page' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 50, description: 'Nombre d\'elements par page (max 100)' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 50;
}

export interface SecurityStats {
  totalByType: Record<string, number>;
  topFailedUsers: Array<{
    userId: string;
    email: string | null;
    nom: string | null;
    prenom: string | null;
    count: number;
  }>;
  dailyTrend: Array<{
    date: string;
    count: number;
    failedCount: number;
    successCount: number;
  }>;
  totalLogs: number;
  criticalCount: number;
}

export interface PaginatedSecurityLogs {
  data: Array<{
    id: string;
    action: string;
    entite: string;
    userId: string | null;
    ipAddress: string | null;
    userAgent: string | null;
    details: Record<string, unknown> | null;
    createdAt: Date;
    severity: 'info' | 'warning' | 'critical';
    user: {
      id: string;
      nom: string;
      prenom: string;
      email: string;
    } | null;
  }>;
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
