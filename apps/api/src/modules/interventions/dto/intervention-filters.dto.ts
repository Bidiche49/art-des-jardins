import { IsOptional, IsNumber, Min, IsUUID, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class InterventionFiltersDto {
  @ApiPropertyOptional({ description: 'Page (defaut: 1)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ description: 'Limite par page (defaut: 20)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number;

  @ApiPropertyOptional({ description: 'Filtrer par chantier' })
  @IsOptional()
  @IsUUID()
  chantierId?: string;

  @ApiPropertyOptional({ description: 'Filtrer par employe' })
  @IsOptional()
  @IsUUID()
  employeId?: string;

  @ApiPropertyOptional({ description: 'Date de debut' })
  @IsOptional()
  @IsDateString()
  dateDebut?: string;

  @ApiPropertyOptional({ description: 'Date de fin' })
  @IsOptional()
  @IsDateString()
  dateFin?: string;

  @ApiPropertyOptional({ description: 'Interventions validees uniquement' })
  @IsOptional()
  @Type(() => Boolean)
  valide?: boolean;

  @ApiPropertyOptional({ description: 'Interventions en cours (sans heure de fin)' })
  @IsOptional()
  @Type(() => Boolean)
  enCours?: boolean;
}
