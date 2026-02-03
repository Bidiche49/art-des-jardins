import { IsString, IsNumber, MinLength, MaxLength, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMaterialUsageDto {
  @ApiProperty({ description: 'Nom du materiau', example: 'Gravier' })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  name: string;

  @ApiProperty({ description: 'Quantite utilisee', example: 10.5, minimum: 0.01 })
  @IsNumber()
  @Min(0.01)
  quantity: number;

  @ApiProperty({ description: 'Cout unitaire en euros', example: 15.00, minimum: 0 })
  @IsNumber()
  @Min(0)
  unitCost: number;
}
