import { IsString, IsUUID, IsOptional, IsDateString, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AbsenceType } from '@art-et-jardin/database';

export class CreateAbsenceDto {
  @ApiPropertyOptional({ description: 'ID de l\'employe (patron peut creer pour un autre)' })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiProperty({ description: 'Date de debut de l\'absence' })
  @IsDateString()
  dateDebut: string;

  @ApiProperty({ description: 'Date de fin de l\'absence' })
  @IsDateString()
  dateFin: string;

  @ApiProperty({ enum: AbsenceType, description: 'Type d\'absence' })
  @IsEnum(AbsenceType)
  type: AbsenceType;

  @ApiPropertyOptional({ description: 'Motif de l\'absence' })
  @IsOptional()
  @IsString()
  motif?: string;
}
