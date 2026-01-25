import { IsString, IsUUID, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateInterventionDto {
  @ApiProperty({ description: 'ID du chantier' })
  @IsUUID()
  chantierId: string;

  @ApiProperty({ description: 'Date de l\'intervention' })
  @IsDateString()
  date: string;

  @ApiProperty({ description: 'Heure de debut' })
  @IsDateString()
  heureDebut: string;

  @ApiPropertyOptional({ description: 'Heure de fin (null si en cours)' })
  @IsOptional()
  @IsDateString()
  heureFin?: string;

  @ApiPropertyOptional({ description: 'Description du travail effectue' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}
