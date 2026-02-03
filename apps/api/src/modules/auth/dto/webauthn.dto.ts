import { IsString, IsOptional, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class WebAuthnRegisterVerifyDto {
  @ApiProperty({
    description: 'JSON stringified RegistrationResponseJSON from WebAuthn API',
    example: '{"id":"...", "rawId":"...", "response":{...}, "type":"public-key"}',
  })
  @IsString()
  response: string;

  @ApiPropertyOptional({
    description: 'Optional device name for identification',
    example: 'iPhone de Jean',
  })
  @IsOptional()
  @IsString()
  deviceName?: string;
}

export class WebAuthnLoginOptionsDto {
  @ApiPropertyOptional({
    description: 'Email to filter credentials (optional for discoverable credentials)',
    example: 'patron@artjardin.fr',
  })
  @IsOptional()
  @IsEmail()
  email?: string;
}

export class WebAuthnLoginVerifyDto {
  @ApiProperty({
    description: 'JSON stringified AuthenticationResponseJSON from WebAuthn API',
    example: '{"id":"...", "rawId":"...", "response":{...}, "type":"public-key"}',
  })
  @IsString()
  response: string;
}

export class WebAuthnCredentialDto {
  @ApiProperty({ description: 'Internal credential ID' })
  id: string;

  @ApiProperty({ description: 'WebAuthn credential ID' })
  credentialId: string;

  @ApiPropertyOptional({ description: 'Device name' })
  deviceName: string | null;

  @ApiPropertyOptional({ description: 'Device type (singleDevice, multiDevice)' })
  deviceType: string | null;

  @ApiPropertyOptional({ description: 'Last time the credential was used' })
  lastUsedAt: Date | null;

  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;
}

export class WebAuthnRegisterSuccessDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ description: 'The created credential ID' })
  credentialId: string;
}

export class WebAuthnDeleteCredentialParamsDto {
  @ApiProperty({ description: 'Credential ID to delete' })
  @IsString()
  id: string;
}
