import { IsOptional, IsString, IsEnum, IsNumber, Min, IsUUID, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { DevisStatut } from '@art-et-jardin/database';

export class DevisFiltersDto {
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

  @ApiPropertyOptional({ description: 'Filtrer par client (via chantier)' })
  @IsOptional()
  @IsUUID()
  clientId?: string;

  @ApiPropertyOptional({ description: 'Filtrer par statut', enum: DevisStatut })
  @IsOptional()
  @IsEnum(DevisStatut)
  statut?: DevisStatut;

  @ApiPropertyOptional({ description: 'Date de debut' })
  @IsOptional()
  @IsDateString()
  dateDebut?: string;

  @ApiPropertyOptional({ description: 'Date de fin' })
  @IsOptional()
  @IsDateString()
  dateFin?: string;

  @ApiPropertyOptional({ description: 'Recherche par numero' })
  @IsOptional()
  @IsString()
  search?: string;
}
