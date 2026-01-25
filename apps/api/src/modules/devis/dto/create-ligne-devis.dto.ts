import { IsString, IsNumber, Min, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLigneDevisDto {
  @ApiProperty({ description: 'Description de la ligne' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Quantite' })
  @IsNumber()
  @Min(0)
  quantite: number;

  @ApiProperty({ description: 'Unite (m2, h, u, forfait...)' })
  @IsString()
  unite: string;

  @ApiProperty({ description: 'Prix unitaire HT' })
  @IsNumber()
  @Min(0)
  prixUnitaireHT: number;

  @ApiPropertyOptional({ description: 'Taux TVA en % (defaut: 20)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  tva?: number;

  @ApiPropertyOptional({ description: 'Ordre d\'affichage' })
  @IsOptional()
  @IsNumber()
  ordre?: number;
}
