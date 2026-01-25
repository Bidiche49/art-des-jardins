import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateInterventionDto } from './create-intervention.dto';
import { IsOptional, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateInterventionDto extends PartialType(OmitType(CreateInterventionDto, ['chantierId'] as const)) {
  @ApiPropertyOptional({ description: 'Intervention validee par le responsable' })
  @IsOptional()
  @IsBoolean()
  valide?: boolean;
}
