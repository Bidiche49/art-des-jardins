import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MessagingService } from './messaging.service';
import { ClientAuthGuard } from '../client-auth/guards/client-auth.guard';
import { CreateConversationDto, SendMessageDto } from './dto/messaging.dto';
import { Request } from 'express';

interface ClientRequest extends Request {
  client: { id: string; email: string };
}

@ApiTags('Client Messaging')
@ApiBearerAuth()
@UseGuards(ClientAuthGuard)
@Controller('client-messaging')
export class ClientMessagingController {
  constructor(private readonly messagingService: MessagingService) {}

  @Get('conversations')
  @ApiOperation({ summary: 'Liste des conversations du client' })
  async getConversations(@Req() req: ClientRequest) {
    return this.messagingService.getClientConversations(req.client.id);
  }

  @Get('conversations/:id')
  @ApiOperation({ summary: 'Détail d\'une conversation' })
  async getConversation(@Req() req: ClientRequest, @Param('id') id: string) {
    const conversation = await this.messagingService.getConversation(id, req.client.id);
    await this.messagingService.markAsRead(id, true);
    return conversation;
  }

  @Post('conversations')
  @ApiOperation({ summary: 'Créer une nouvelle conversation' })
  async createConversation(@Req() req: ClientRequest, @Body() dto: CreateConversationDto) {
    return this.messagingService.createConversation(
      req.client.id,
      dto.subject,
      dto.chantierId,
      dto.message,
    );
  }

  @Post('conversations/:id/messages')
  @ApiOperation({ summary: 'Envoyer un message' })
  async sendMessage(
    @Req() req: ClientRequest,
    @Param('id') conversationId: string,
    @Body() dto: SendMessageDto,
  ) {
    await this.messagingService.getConversation(conversationId, req.client.id);
    return this.messagingService.addMessage(
      conversationId,
      'client',
      req.client.id,
      dto.content,
      dto.attachments,
    );
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Nombre de conversations non lues' })
  async getUnreadCount(@Req() req: ClientRequest) {
    const count = await this.messagingService.getUnreadCount(req.client.id);
    return { count };
  }
}
