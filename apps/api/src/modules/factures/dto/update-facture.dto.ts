import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { FactureStatut, ModePaiement } from '@art-et-jardin/database';

export class UpdateFactureDto {
  @ApiPropertyOptional({ description: 'Statut', enum: FactureStatut })
  @IsOptional()
  @IsEnum(FactureStatut)
  statut?: FactureStatut;

  @ApiPropertyOptional({ description: 'Date de paiement' })
  @IsOptional()
  @IsDateString()
  datePaiement?: string;

  @ApiPropertyOptional({ description: 'Mode de paiement', enum: ModePaiement })
  @IsOptional()
  @IsEnum(ModePaiement)
  modePaiement?: ModePaiement;

  @ApiPropertyOptional({ description: 'Reference du paiement' })
  @IsOptional()
  @IsString()
  referencePaiement?: string;

  @ApiPropertyOptional({ description: 'Mentions legales' })
  @IsOptional()
  @IsString()
  mentionsLegales?: string;

  @ApiPropertyOptional({ description: 'Notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}
