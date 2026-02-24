import { IsString, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateContactDto {
  @ApiProperty({ example: 'Jean Dupont' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'jean.dupont@email.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: '06 12 34 56 78' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'Angers' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: 'entretien' })
  @IsOptional()
  @IsString()
  service?: string;

  @ApiProperty({ example: 'Je souhaite un devis pour l\'entretien de mon jardin.' })
  @IsString()
  message: string;

  @ApiPropertyOptional({ description: 'Honeypot anti-spam (doit rester vide)' })
  @IsOptional()
  @IsString()
  honeypot?: string;
}
