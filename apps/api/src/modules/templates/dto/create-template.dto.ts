import {
  IsString,
  IsOptional,
  IsIn,
  IsNumber,
  IsPositive,
  IsBoolean,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTemplateDto {
  @ApiProperty({ example: 'Tonte pelouse' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Tonte de pelouse avec ramassage' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    enum: ['entretien', 'creation', 'elagage', 'divers'],
    example: 'entretien',
  })
  @IsIn(['entretien', 'creation', 'elagage', 'divers'])
  category: string;

  @ApiProperty({
    enum: ['m2', 'ml', 'h', 'forfait', 'm3', 'unite'],
    example: 'm2',
  })
  @IsIn(['m2', 'ml', 'h', 'forfait', 'm3', 'unite'])
  unit: string;

  @ApiProperty({ example: 0.5 })
  @IsNumber()
  @IsPositive()
  unitPriceHT: number;

  @ApiPropertyOptional({ example: 20, default: 20 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  tvaRate?: number;

  @ApiPropertyOptional({ example: false, default: false })
  @IsOptional()
  @IsBoolean()
  isGlobal?: boolean;
}
