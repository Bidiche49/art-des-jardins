import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateConversationDto {
  @ApiProperty({ example: 'Question sur mon devis' })
  @IsString()
  @IsNotEmpty({ message: 'Le sujet est requis' })
  subject: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  chantierId?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  message?: string;
}

export class SendMessageDto {
  @ApiProperty({ example: 'Bonjour, j\'ai une question...' })
  @IsString()
  @IsNotEmpty({ message: 'Le message est requis' })
  content: string;

  @ApiProperty({ required: false, type: [String] })
  @IsArray()
  @IsOptional()
  attachments?: string[];
}
