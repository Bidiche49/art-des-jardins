import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PhotoType } from '@art-et-jardin/database';

export class PhotoResponseDto {
  @ApiProperty({ description: 'ID unique de la photo' })
  id: string;

  @ApiProperty({ description: 'ID de l\'intervention' })
  interventionId: string;

  @ApiProperty({
    description: 'Type de photo',
    enum: PhotoType,
  })
  type: PhotoType;

  @ApiProperty({ description: 'Nom du fichier original' })
  filename: string;

  @ApiProperty({ description: 'URL pre-signee pour acceder a la photo' })
  url: string;

  @ApiPropertyOptional({ description: 'URL de la miniature' })
  thumbnailUrl?: string;

  @ApiProperty({ description: 'Type MIME' })
  mimeType: string;

  @ApiProperty({ description: 'Taille en octets' })
  size: number;

  @ApiProperty({ description: 'Largeur en pixels' })
  width: number;

  @ApiProperty({ description: 'Hauteur en pixels' })
  height: number;

  @ApiPropertyOptional({ description: 'Latitude GPS' })
  latitude?: number;

  @ApiPropertyOptional({ description: 'Longitude GPS' })
  longitude?: number;

  @ApiProperty({ description: 'Date/heure de prise de la photo' })
  takenAt: Date;

  @ApiProperty({ description: 'Date/heure d\'upload' })
  uploadedAt: Date;

  @ApiProperty({ description: 'ID de l\'utilisateur qui a uploade' })
  uploadedBy: string;
}
