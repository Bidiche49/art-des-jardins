import { IsOptional, IsUUID, IsDateString, IsBoolean, IsEnum, IsInt, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { AbsenceType } from '@art-et-jardin/database';

export class AbsenceFiltersDto {
  @ApiPropertyOptional({ description: 'Numero de page' })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Nombre de resultats par page' })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  limit?: number = 50;

  @ApiPropertyOptional({ description: 'Filtrer par employe' })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiPropertyOptional({ description: 'Date de debut minimum' })
  @IsOptional()
  @IsDateString()
  dateDebut?: string;

  @ApiPropertyOptional({ description: 'Date de fin maximum' })
  @IsOptional()
  @IsDateString()
  dateFin?: string;

  @ApiPropertyOptional({ enum: AbsenceType, description: 'Type d\'absence' })
  @IsOptional()
  @IsEnum(AbsenceType)
  type?: AbsenceType;

  @ApiPropertyOptional({ description: 'Filtrer par statut validation' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  validee?: boolean;
}
