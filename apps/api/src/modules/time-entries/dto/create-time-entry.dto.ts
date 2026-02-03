import { IsUUID, IsNumber, IsDateString, IsOptional, IsString, Min, Max, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTimeEntryDto {
  @ApiProperty({ description: 'ID de l\'utilisateur' })
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'Nombre d\'heures travaillees', minimum: 0.25, maximum: 24 })
  @IsNumber()
  @Min(0.25)
  @Max(24)
  hours: number;

  @ApiProperty({ description: 'Date de la saisie (YYYY-MM-DD)' })
  @IsDateString()
  date: string;

  @ApiPropertyOptional({ description: 'Description du travail effectue', maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
