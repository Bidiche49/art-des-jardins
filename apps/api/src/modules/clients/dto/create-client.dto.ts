import { IsString, IsEmail, IsEnum, IsOptional, IsArray, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ClientType } from '@art-et-jardin/database';

export class CreateClientDto {
  @ApiProperty({ enum: ClientType, example: 'particulier' })
  @IsEnum(ClientType)
  type: ClientType;

  @ApiProperty({ example: 'Dupont' })
  @IsString()
  nom: string;

  @ApiPropertyOptional({ example: 'Jean' })
  @IsOptional()
  @IsString()
  prenom?: string;

  @ApiPropertyOptional({ example: 'Dupont SARL' })
  @IsOptional()
  @IsString()
  raisonSociale?: string;

  @ApiProperty({ example: 'jean.dupont@email.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '06 12 34 56 78' })
  @IsString()
  telephone: string;

  @ApiPropertyOptional({ example: '06 98 76 54 32' })
  @IsOptional()
  @IsString()
  telephoneSecondaire?: string;

  @ApiProperty({ example: '15 rue des Fleurs' })
  @IsString()
  adresse: string;

  @ApiProperty({ example: '49000' })
  @IsString()
  @Matches(/^[0-9]{5}$/, { message: 'Code postal invalide' })
  codePostal: string;

  @ApiProperty({ example: 'Angers' })
  @IsString()
  ville: string;

  @ApiPropertyOptional({ example: 'Client fidele' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ type: [String], example: ['jardin', 'entretien'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
