import { IsString, IsUUID, IsOptional, IsNumber, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFactureDto {
  @ApiProperty({ description: 'ID du devis source' })
  @IsUUID()
  devisId: string;

  @ApiPropertyOptional({ description: 'Delai de paiement en jours (defaut: 30)' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  delaiPaiement?: number;

  @ApiPropertyOptional({ description: 'Mentions legales personnalisees' })
  @IsOptional()
  @IsString()
  mentionsLegales?: string;

  @ApiPropertyOptional({ description: 'Notes internes' })
  @IsOptional()
  @IsString()
  notes?: string;
}
