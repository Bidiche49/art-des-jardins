import { IsString, IsUUID, IsOptional, IsNumber, IsArray, ValidateNested, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CreateLigneDevisDto } from './create-ligne-devis.dto';

export class CreateDevisDto {
  @ApiProperty({ description: 'ID du chantier' })
  @IsUUID()
  chantierId: string;

  @ApiPropertyOptional({ description: 'Validite en jours (defaut: 30)' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  validiteJours?: number;

  @ApiPropertyOptional({ description: 'Conditions particulieres' })
  @IsOptional()
  @IsString()
  conditionsParticulieres?: string;

  @ApiPropertyOptional({ description: 'Notes internes' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ description: 'Lignes du devis', type: [CreateLigneDevisDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateLigneDevisDto)
  lignes: CreateLigneDevisDto[];
}
