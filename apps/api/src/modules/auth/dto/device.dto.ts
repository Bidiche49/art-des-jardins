import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO pour les query params de la liste des devices
 */
export class DeviceListQueryDto {
  @ApiPropertyOptional({
    description: 'Nombre de devices a retourner',
    default: 20,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional({
    description: 'Nombre de devices a ignorer (pagination)',
    default: 0,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number = 0;
}

/**
 * DTO representant un device connu
 */
export class DeviceDto {
  @ApiProperty({
    description: 'ID unique du device',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  id: string;

  @ApiProperty({
    description: 'Nom lisible du device (ex: "Chrome sur Windows")',
    example: 'Chrome sur Windows',
    nullable: true,
  })
  name: string | null;

  @ApiProperty({
    description: 'Derniere adresse IP connue',
    example: '192.168.1.100',
    nullable: true,
  })
  lastIp: string | null;

  @ApiPropertyOptional({
    description: 'Dernier pays detecte',
    example: 'France',
    nullable: true,
  })
  lastCountry?: string | null;

  @ApiPropertyOptional({
    description: 'Derniere ville detectee',
    example: 'Angers',
    nullable: true,
  })
  lastCity?: string | null;

  @ApiProperty({
    description: 'Date de derniere utilisation',
    example: '2026-02-03T12:00:00.000Z',
  })
  lastUsedAt: Date;

  @ApiPropertyOptional({
    description: 'Date de validation par l\'utilisateur (null si non valide)',
    example: '2026-02-01T10:30:00.000Z',
    nullable: true,
  })
  trustedAt?: Date | null;

  @ApiProperty({
    description: 'Indique si ce device est celui de la requete actuelle',
    example: false,
  })
  isCurrent: boolean;

  @ApiProperty({
    description: 'Date de premiere detection',
    example: '2026-01-15T08:00:00.000Z',
  })
  createdAt: Date;
}

/**
 * DTO de reponse pour la liste paginee des devices
 */
export class DeviceListResponseDto {
  @ApiProperty({
    description: 'Liste des devices',
    type: [DeviceDto],
  })
  devices: DeviceDto[];

  @ApiProperty({
    description: 'Nombre total de devices',
    example: 5,
  })
  total: number;
}
