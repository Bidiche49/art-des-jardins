import { IsOptional, IsString, IsEnum, IsNumber, Min, IsUUID, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { FactureStatut } from '@art-et-jardin/database';

export class FactureFiltersDto {
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

  @ApiPropertyOptional({ description: 'Filtrer par devis' })
  @IsOptional()
  @IsUUID()
  devisId?: string;

  @ApiPropertyOptional({ description: 'Filtrer par client (via devis/chantier)' })
  @IsOptional()
  @IsUUID()
  clientId?: string;

  @ApiPropertyOptional({ description: 'Filtrer par statut', enum: FactureStatut })
  @IsOptional()
  @IsEnum(FactureStatut)
  statut?: FactureStatut;

  @ApiPropertyOptional({ description: 'Date de debut' })
  @IsOptional()
  @IsDateString()
  dateDebut?: string;

  @ApiPropertyOptional({ description: 'Date de fin' })
  @IsOptional()
  @IsDateString()
  dateFin?: string;

  @ApiPropertyOptional({ description: 'Factures en retard uniquement' })
  @IsOptional()
  @Type(() => Boolean)
  enRetard?: boolean;

  @ApiPropertyOptional({ description: 'Recherche par numero' })
  @IsOptional()
  @IsString()
  search?: string;
}
