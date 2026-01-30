import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MessagingService } from './messaging.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SendMessageDto } from './dto/messaging.dto';
import { Request } from 'express';

interface UserRequest extends Request {
  user: { id: string; email: string; role: string };
}

@ApiTags('Messaging (Admin)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('messaging')
export class MessagingController {
  constructor(private readonly messagingService: MessagingService) {}

  @Get('conversations')
  @ApiOperation({ summary: 'Liste de toutes les conversations' })
  async getAllConversations() {
    return this.messagingService.getAllConversations();
  }

  @Get('conversations/:id')
  @ApiOperation({ summary: 'Détail d\'une conversation' })
  async getConversation(@Param('id') id: string) {
    const conversation = await this.messagingService.getConversation(id);
    await this.messagingService.markAsRead(id, false);
    return conversation;
  }

  @Post('conversations/:id/messages')
  @ApiOperation({ summary: 'Répondre à une conversation' })
  async sendMessage(
    @Req() req: UserRequest,
    @Param('id') conversationId: string,
    @Body() dto: SendMessageDto,
  ) {
    return this.messagingService.addMessage(
      conversationId,
      'entreprise',
      req.user.id,
      dto.content,
      dto.attachments,
    );
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Nombre de conversations non lues' })
  async getUnreadCount() {
    const count = await this.messagingService.getUnreadCount();
    return { count };
  }
}
