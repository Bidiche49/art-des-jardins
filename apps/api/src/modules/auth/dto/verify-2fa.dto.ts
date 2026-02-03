import { IsString, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class Verify2FADto {
  @ApiProperty({
    description: 'Code TOTP à 6 chiffres ou code de récupération',
    example: '123456',
  })
  @IsString()
  @Length(6, 10) // 6 for TOTP, 8 for recovery code
  token: string;
}

export class LoginWith2FADto {
  @ApiProperty({ description: 'Email utilisateur', example: 'patron@artjardin.fr' })
  @IsString()
  email: string;

  @ApiProperty({ description: 'Mot de passe', example: 'password123' })
  @IsString()
  password: string;

  @ApiProperty({
    description: 'Code TOTP 2FA (optionnel si 2FA non activé)',
    example: '123456',
    required: false,
  })
  @IsString()
  @Length(6, 10)
  totpCode?: string;
}

export class Disable2FADto {
  @ApiProperty({
    description: 'Code TOTP actuel pour confirmer la désactivation',
    example: '123456',
  })
  @IsString()
  @Length(6, 6)
  @Matches(/^\d{6}$/, { message: 'Le code doit être composé de 6 chiffres' })
  token: string;
}

export class RegenerateRecoveryCodesDto {
  @ApiProperty({
    description: 'Code TOTP actuel pour confirmer la régénération',
    example: '123456',
  })
  @IsString()
  @Length(6, 6)
  @Matches(/^\d{6}$/, { message: 'Le code doit être composé de 6 chiffres' })
  token: string;
}
