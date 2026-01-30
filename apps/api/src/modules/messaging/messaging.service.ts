import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

type SenderType = 'client' | 'entreprise';

@Injectable()
export class MessagingService {
  constructor(private prisma: PrismaService) {}

  async getClientConversations(clientId: string) {
    return this.prisma.conversation.findMany({
      where: { clientId },
      include: {
        chantier: { select: { id: true, description: true } },
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { lastMessageAt: 'desc' },
    });
  }

  async getConversation(conversationId: string, clientId?: string) {
    const where = clientId
      ? { id: conversationId, clientId }
      : { id: conversationId };

    const conversation = await this.prisma.conversation.findFirst({
      where,
      include: {
        client: { select: { id: true, nom: true, prenom: true, email: true } },
        chantier: { select: { id: true, description: true, adresse: true } },
        messages: { orderBy: { createdAt: 'asc' } },
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation non trouvée');
    }

    return conversation;
  }

  async createConversation(
    clientId: string,
    subject: string,
    chantierId?: string,
    initialMessage?: string,
  ) {
    const conversation = await this.prisma.conversation.create({
      data: {
        clientId,
        chantierId,
        subject,
        unreadByAdmin: true,
        unreadByClient: false,
      },
    });

    if (initialMessage) {
      await this.addMessage(conversation.id, 'client', clientId, initialMessage);
    }

    return conversation;
  }

  async addMessage(
    conversationId: string,
    senderType: 'client' | 'entreprise',
    senderId: string | null,
    content: string,
    attachments: string[] = [],
  ) {
    const message = await this.prisma.message.create({
      data: {
        conversationId,
        senderType: senderType as SenderType,
        senderId,
        content,
        attachments,
      },
    });

    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: {
        lastMessageAt: new Date(),
        unreadByClient: senderType === 'entreprise',
        unreadByAdmin: senderType === 'client',
      },
    });

    return message;
  }

  async markAsRead(conversationId: string, byClient: boolean) {
    const updateData = byClient
      ? { unreadByClient: false }
      : { unreadByAdmin: false };

    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: updateData,
    });

    const markField = byClient ? 'client' : 'entreprise';
    await this.prisma.message.updateMany({
      where: {
        conversationId,
        senderType: markField === 'client' ? 'entreprise' : 'client',
        readAt: null,
      },
      data: { readAt: new Date() },
    });
  }

  async getAllConversations() {
    return this.prisma.conversation.findMany({
      include: {
        client: { select: { id: true, nom: true, prenom: true, email: true } },
        chantier: { select: { id: true, description: true } },
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { lastMessageAt: 'desc' },
    });
  }

  async getUnreadCount(clientId?: string) {
    if (clientId) {
      return this.prisma.conversation.count({
        where: { clientId, unreadByClient: true },
      });
    }
    return this.prisma.conversation.count({
      where: { unreadByAdmin: true },
    });
  }
}
