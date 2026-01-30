import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { MessagingService } from './messaging.service';
import { PrismaService } from '../../database/prisma.service';

describe('MessagingService', () => {
  let service: MessagingService;

  const mockConversation = {
    id: 'conv-1',
    clientId: 'client-123',
    chantierId: 'chantier-1',
    subject: 'Question sur le devis',
    unreadByAdmin: false,
    unreadByClient: false,
    lastMessageAt: new Date(),
    client: { id: 'client-123', nom: 'Dupont', prenom: 'Jean', email: 'client@example.com' },
    chantier: { id: 'chantier-1', description: 'Aménagement jardin', adresse: '123 rue Test' },
    messages: [{ id: 'msg-1', content: 'Bonjour', senderType: 'client', createdAt: new Date() }],
  };

  const mockPrismaService = {
    conversation: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    message: {
      create: jest.fn(),
      updateMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagingService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<MessagingService>(MessagingService);
    jest.clearAllMocks();
  });

  describe('getClientConversations', () => {
    it('should return conversations for a client', async () => {
      mockPrismaService.conversation.findMany.mockResolvedValue([mockConversation]);

      const result = await service.getClientConversations('client-123');

      expect(result).toHaveLength(1);
      expect(result[0].clientId).toBe('client-123');
      expect(mockPrismaService.conversation.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { clientId: 'client-123' },
        }),
      );
    });
  });

  describe('getConversation', () => {
    it('should return conversation with messages', async () => {
      mockPrismaService.conversation.findFirst.mockResolvedValue(mockConversation);

      const result = await service.getConversation('conv-1');

      expect(result.id).toBe('conv-1');
      expect(result.messages).toHaveLength(1);
    });

    it('should filter by clientId when provided', async () => {
      mockPrismaService.conversation.findFirst.mockResolvedValue(mockConversation);

      await service.getConversation('conv-1', 'client-123');

      expect(mockPrismaService.conversation.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'conv-1', clientId: 'client-123' },
        }),
      );
    });

    it('should throw NotFoundException when conversation not found', async () => {
      mockPrismaService.conversation.findFirst.mockResolvedValue(null);

      await expect(service.getConversation('unknown-conv')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createConversation', () => {
    it('should create a conversation', async () => {
      mockPrismaService.conversation.create.mockResolvedValue({
        id: 'conv-new',
        clientId: 'client-123',
        subject: 'New conversation',
      });

      const result = await service.createConversation('client-123', 'New conversation');

      expect(result.id).toBe('conv-new');
      expect(mockPrismaService.conversation.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            clientId: 'client-123',
            subject: 'New conversation',
            unreadByAdmin: true,
          }),
        }),
      );
    });

    it('should create conversation with chantier link', async () => {
      mockPrismaService.conversation.create.mockResolvedValue({ id: 'conv-new' });

      await service.createConversation('client-123', 'Subject', 'chantier-1');

      expect(mockPrismaService.conversation.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            chantierId: 'chantier-1',
          }),
        }),
      );
    });

    it('should add initial message if provided', async () => {
      mockPrismaService.conversation.create.mockResolvedValue({ id: 'conv-new' });
      mockPrismaService.message.create.mockResolvedValue({ id: 'msg-1' });
      mockPrismaService.conversation.update.mockResolvedValue({});

      await service.createConversation('client-123', 'Subject', undefined, 'Hello!');

      expect(mockPrismaService.message.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            content: 'Hello!',
            senderType: 'client',
          }),
        }),
      );
    });
  });

  describe('addMessage', () => {
    it('should create a message and update conversation', async () => {
      mockPrismaService.message.create.mockResolvedValue({
        id: 'msg-new',
        content: 'Test message',
        senderType: 'client',
      });
      mockPrismaService.conversation.update.mockResolvedValue({});

      const result = await service.addMessage('conv-1', 'client', 'client-123', 'Test message');

      expect(result.id).toBe('msg-new');
      expect(mockPrismaService.conversation.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'conv-1' },
          data: expect.objectContaining({
            unreadByAdmin: true,
            unreadByClient: false,
          }),
        }),
      );
    });

    it('should mark as unread for client when sent by entreprise', async () => {
      mockPrismaService.message.create.mockResolvedValue({ id: 'msg-new' });
      mockPrismaService.conversation.update.mockResolvedValue({});

      await service.addMessage('conv-1', 'entreprise', 'user-1', 'Response');

      expect(mockPrismaService.conversation.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            unreadByClient: true,
            unreadByAdmin: false,
          }),
        }),
      );
    });
  });

  describe('markAsRead', () => {
    it('should mark conversation as read by client', async () => {
      mockPrismaService.conversation.update.mockResolvedValue({});
      mockPrismaService.message.updateMany.mockResolvedValue({ count: 2 });

      await service.markAsRead('conv-1', true);

      expect(mockPrismaService.conversation.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { unreadByClient: false },
        }),
      );
    });

    it('should mark conversation as read by admin', async () => {
      mockPrismaService.conversation.update.mockResolvedValue({});
      mockPrismaService.message.updateMany.mockResolvedValue({ count: 2 });

      await service.markAsRead('conv-1', false);

      expect(mockPrismaService.conversation.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { unreadByAdmin: false },
        }),
      );
    });
  });

  describe('getUnreadCount', () => {
    it('should return unread count for client', async () => {
      mockPrismaService.conversation.count.mockResolvedValue(3);

      const result = await service.getUnreadCount('client-123');

      expect(result).toBe(3);
      expect(mockPrismaService.conversation.count).toHaveBeenCalledWith({
        where: { clientId: 'client-123', unreadByClient: true },
      });
    });

    it('should return unread count for admin', async () => {
      mockPrismaService.conversation.count.mockResolvedValue(5);

      const result = await service.getUnreadCount();

      expect(result).toBe(5);
      expect(mockPrismaService.conversation.count).toHaveBeenCalledWith({
        where: { unreadByAdmin: true },
      });
    });
  });
});
