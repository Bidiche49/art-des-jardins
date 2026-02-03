import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsUUID,
  IsArray,
} from 'class-validator';

export enum NotificationTypeDto {
  INFO = 'info',
  WARNING = 'warning',
  SUCCESS = 'success',
  ACTION_REQUIRED = 'action_required',
}

export class CreateInAppNotificationDto {
  @ApiProperty({ description: 'User ID to send notification to' })
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @ApiProperty({
    enum: NotificationTypeDto,
    description: 'Notification type',
    default: NotificationTypeDto.INFO,
  })
  @IsEnum(NotificationTypeDto)
  type: NotificationTypeDto;

  @ApiProperty({ description: 'Notification title' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: 'Notification message' })
  @IsNotEmpty()
  @IsString()
  message: string;

  @ApiPropertyOptional({ description: 'Link to navigate when clicked (e.g., /devis/123)' })
  @IsOptional()
  @IsString()
  link?: string;
}

export class MarkNotificationReadDto {
  @ApiProperty({ description: 'Notification ID' })
  @IsNotEmpty()
  @IsUUID()
  id: string;
}

export class MarkMultipleReadDto {
  @ApiProperty({ description: 'Array of notification IDs', type: [String] })
  @IsArray()
  @IsUUID('4', { each: true })
  ids: string[];
}

export class InAppNotificationResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty({ enum: NotificationTypeDto })
  type: NotificationTypeDto;

  @ApiProperty()
  title: string;

  @ApiProperty()
  message: string;

  @ApiPropertyOptional()
  link?: string;

  @ApiPropertyOptional()
  readAt?: Date;

  @ApiProperty()
  createdAt: Date;
}

export class NotificationCountResponseDto {
  @ApiProperty({ description: 'Total unread notifications count' })
  unread: number;

  @ApiProperty({ description: 'Unread by type breakdown' })
  byType: {
    info: number;
    warning: number;
    success: number;
    action_required: number;
  };
}
