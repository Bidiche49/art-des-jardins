import {
  IsEnum,
  IsOptional,
  IsNumber,
  IsDateString,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PhotoType } from '@art-et-jardin/database';
import { Transform } from 'class-transformer';

export class CreatePhotoDto {
  @ApiProperty({
    description: 'Type de photo',
    enum: PhotoType,
    example: PhotoType.BEFORE,
  })
  @IsEnum(PhotoType)
  type: PhotoType;

  @ApiPropertyOptional({ description: 'Latitude GPS', example: 47.4784 })
  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  @Transform(({ value }) => (value ? parseFloat(value) : undefined))
  latitude?: number;

  @ApiPropertyOptional({ description: 'Longitude GPS', example: -0.5632 })
  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  @Transform(({ value }) => (value ? parseFloat(value) : undefined))
  longitude?: number;

  @ApiProperty({
    description: 'Date/heure de prise de la photo',
    example: '2026-02-03T10:30:00Z',
  })
  @IsDateString()
  takenAt: string;
}
