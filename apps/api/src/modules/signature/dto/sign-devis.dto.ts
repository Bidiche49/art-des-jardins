import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class SignDevisDto {
  @ApiProperty({ description: 'Signature en base64 (image PNG)' })
  @IsString()
  @IsNotEmpty()
  signatureBase64: string;

  @ApiProperty({ description: 'Acceptation des CGV' })
  @IsBoolean()
  cgvAccepted: boolean;
}
