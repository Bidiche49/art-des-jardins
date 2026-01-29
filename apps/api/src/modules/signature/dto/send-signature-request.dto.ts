import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class SendSignatureRequestDto {
  @ApiPropertyOptional({ description: 'Email du client (si different de celui du chantier)' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: 'Message personnalise pour le client' })
  @IsOptional()
  @IsString()
  message?: string;
}
