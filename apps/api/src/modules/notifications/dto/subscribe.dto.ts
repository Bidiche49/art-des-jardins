import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class SubscribeDto {
  @ApiProperty({ description: 'Push subscription endpoint URL' })
  @IsNotEmpty()
  @IsUrl()
  endpoint: string;

  @ApiProperty({ description: 'P256DH key for encryption' })
  @IsNotEmpty()
  @IsString()
  p256dh: string;

  @ApiProperty({ description: 'Auth secret' })
  @IsNotEmpty()
  @IsString()
  auth: string;
}

export class SendNotificationDto {
  @ApiProperty({ description: 'Notification title' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: 'Notification body' })
  @IsNotEmpty()
  @IsString()
  body: string;

  @ApiProperty({ description: 'Optional URL to open on click', required: false })
  @IsString()
  url?: string;
}
