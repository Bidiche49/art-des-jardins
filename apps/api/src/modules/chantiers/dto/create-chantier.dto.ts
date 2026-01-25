import { IsString, IsEnum, IsOptional, IsNumber, IsArray, IsDateString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ChantierStatut, TypePrestation } from '@art-et-jardin/database';

export class CreateChantierDto {
  @ApiProperty({ description: 'ID du client' })
  @IsUUID()
  clientId: string;

  @ApiProperty({ description: 'Adresse du chantier' })
  @IsString()
  adresse: string;

  @ApiProperty({ description: 'Code postal' })
  @IsString()
  codePostal: string;

  @ApiProperty({ description: 'Ville' })
  @IsString()
  ville: string;

  @ApiPropertyOptional({ description: 'Latitude GPS' })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({ description: 'Longitude GPS' })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiProperty({ description: 'Types de prestation', enum: TypePrestation, isArray: true })
  @IsArray()
  @IsEnum(TypePrestation, { each: true })
  typePrestation: TypePrestation[];

  @ApiProperty({ description: 'Description du chantier' })
  @IsString()
  description: string;

  @ApiPropertyOptional({ description: 'Surface en m2' })
  @IsOptional()
  @IsNumber()
  surface?: number;

  @ApiPropertyOptional({ description: 'Statut', enum: ChantierStatut })
  @IsOptional()
  @IsEnum(ChantierStatut)
  statut?: ChantierStatut;

  @ApiPropertyOptional({ description: 'Date de visite prevue' })
  @IsOptional()
  @IsDateString()
  dateVisite?: string;

  @ApiPropertyOptional({ description: 'Date de debut prevue' })
  @IsOptional()
  @IsDateString()
  dateDebut?: string;

  @ApiPropertyOptional({ description: 'Date de fin prevue' })
  @IsOptional()
  @IsDateString()
  dateFin?: string;

  @ApiPropertyOptional({ description: 'ID du responsable' })
  @IsOptional()
  @IsUUID()
  responsableId?: string;

  @ApiPropertyOptional({ description: 'Notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}
