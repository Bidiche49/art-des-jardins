import { IsOptional, IsString, IsEnum, IsNumber, Min, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ChantierStatut } from '@art-et-jardin/database';

export class ChantierFiltersDto {
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

  @ApiPropertyOptional({ description: 'Filtrer par client' })
  @IsOptional()
  @IsUUID()
  clientId?: string;

  @ApiPropertyOptional({ description: 'Filtrer par statut', enum: ChantierStatut })
  @IsOptional()
  @IsEnum(ChantierStatut)
  statut?: ChantierStatut;

  @ApiPropertyOptional({ description: 'Filtrer par responsable' })
  @IsOptional()
  @IsUUID()
  responsableId?: string;

  @ApiPropertyOptional({ description: 'Filtrer par ville' })
  @IsOptional()
  @IsString()
  ville?: string;

  @ApiPropertyOptional({ description: 'Recherche textuelle' })
  @IsOptional()
  @IsString()
  search?: string;
}
