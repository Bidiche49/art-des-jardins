import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/database/prisma.service';
import { createMockClient, createMockPatron } from './helpers/test-utils';
import { ConfigService } from '@nestjs/config';
import {
  JWT_TEST_SECRET,
  createClientToken,
  createPatronToken,
} from './helpers/jwt.helper';

describe('Messaging (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  const mockClient = createMockClient({ id: 'client-id-123' });
  const mockPatron = createMockPatron({ id: 'patron-id-123' });

  const mockConversation = {
    id: 'conversation-id-123',
    clientId: mockClient.id,
    sujet: 'Question sur le devis',
    statut: 'ouverte',
    createdAt: new Date(),
    updatedAt: new Date(),
    client: mockClient,
  };

  const mockMessage = {
    id: 'message-id-123',
    conversationId: mockConversation.id,
    contenu: 'Bonjour, j\'ai une question sur le devis.',
    expediteurType: 'client',
    expediteurId: mockClient.id,
    lu: false,
    createdAt: new Date(),
  };

  let clientToken: string;
  let patronToken: string;

  beforeAll(async () => {
    clientToken = createClientToken(mockClient.id, mockClient.email);
    patronToken = createPatronToken(mockPatron.id, mockPatron.email);

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ConfigService)
      .useValue({
        get: jest.fn((key: string) => {
          const config: Record<string, string> = {
            JWT_SECRET: JWT_TEST_SECRET,
            JWT_EXPIRES_IN: '15m',
          };
          return config[key];
        }),
      })
      .overrideProvider(PrismaService)
      .useValue({
        client: {
          findUnique: jest.fn(),
        },
        user: {
          findUnique: jest.fn(),
        },
        conversation: {
          create: jest.fn(),
          findMany: jest.fn(),
          findUnique: jest.fn(),
          update: jest.fn(),
        },
        message: {
          create: jest.fn(),
          findMany: jest.fn(),
          updateMany: jest.fn(),
          count: jest.fn(),
        },
        $connect: jest.fn(),
        $disconnect: jest.fn(),
        onModuleInit: jest.fn(),
        onModuleDestroy: jest.fn(),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();

    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    (prisma.client.findUnique as jest.Mock).mockResolvedValue(mockClient);
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockPatron);
  });

  describe('POST /messaging/conversations (client)', () => {
    it('should return 201 when client creates a new conversation', async () => {
      (prisma.conversation.create as jest.Mock).mockResolvedValue(mockConversation);
      (prisma.message.create as jest.Mock).mockResolvedValue(mockMessage);

      const response = await request(app.getHttpServer())
        .post('/messaging/conversations')
        .set('Authorization', `Bearer ${clientToken}`)
        .send({
          sujet: 'Question sur le devis',
          message: 'Bonjour, j\'ai une question.',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('sujet', 'Question sur le devis');
      expect(prisma.conversation.create).toHaveBeenCalled();
      expect(prisma.message.create).toHaveBeenCalled();
    });

    it('should return 400 without sujet', async () => {
      await request(app.getHttpServer())
        .post('/messaging/conversations')
        .set('Authorization', `Bearer ${clientToken}`)
        .send({ message: 'Bonjour' })
        .expect(400);
    });

    it('should return 401 without token', async () => {
      await request(app.getHttpServer())
        .post('/messaging/conversations')
        .send({ sujet: 'Test', message: 'Test' })
        .expect(401);
    });
  });

  describe('GET /messaging/conversations (client)', () => {
    it('should return 200 with client conversations list', async () => {
      (prisma.conversation.findMany as jest.Mock).mockResolvedValue([
        { ...mockConversation, messages: [mockMessage] },
      ]);

      const response = await request(app.getHttpServer())
        .get('/messaging/conversations')
        .set('Authorization', `Bearer ${clientToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(prisma.conversation.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { clientId: mockClient.id },
        }),
      );
    });
  });

  describe('GET /messaging/conversations/:id (client)', () => {
    it('should return 200 with conversation details and messages', async () => {
      (prisma.conversation.findUnique as jest.Mock).mockResolvedValue({
        ...mockConversation,
        messages: [mockMessage],
      });
      (prisma.message.updateMany as jest.Mock).mockResolvedValue({ count: 1 });

      const response = await request(app.getHttpServer())
        .get(`/messaging/conversations/${mockConversation.id}`)
        .set('Authorization', `Bearer ${clientToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', mockConversation.id);
      expect(response.body).toHaveProperty('messages');
    });

    it('should return 404 for conversation belonging to another client', async () => {
      (prisma.conversation.findUnique as jest.Mock).mockResolvedValue({
        ...mockConversation,
        clientId: 'other-client-id',
      });

      await request(app.getHttpServer())
        .get(`/messaging/conversations/${mockConversation.id}`)
        .set('Authorization', `Bearer ${clientToken}`)
        .expect(404);
    });
  });

  describe('POST /messaging/conversations/:id/messages (client)', () => {
    it('should return 201 when client sends a message', async () => {
      (prisma.conversation.findUnique as jest.Mock).mockResolvedValue(mockConversation);
      (prisma.message.create as jest.Mock).mockResolvedValue({
        ...mockMessage,
        contenu: 'Nouveau message',
      });
      (prisma.conversation.update as jest.Mock).mockResolvedValue(mockConversation);

      const response = await request(app.getHttpServer())
        .post(`/messaging/conversations/${mockConversation.id}/messages`)
        .set('Authorization', `Bearer ${clientToken}`)
        .send({ contenu: 'Nouveau message' })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('contenu', 'Nouveau message');
    });

    it('should return 400 without contenu', async () => {
      await request(app.getHttpServer())
        .post(`/messaging/conversations/${mockConversation.id}/messages`)
        .set('Authorization', `Bearer ${clientToken}`)
        .send({})
        .expect(400);
    });
  });

  describe('GET /messaging/admin/conversations (patron)', () => {
    it('should return 200 with all conversations for admin', async () => {
      (prisma.conversation.findMany as jest.Mock).mockResolvedValue([
        mockConversation,
      ]);

      const response = await request(app.getHttpServer())
        .get('/messaging/admin/conversations')
        .set('Authorization', `Bearer ${patronToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should filter by statut', async () => {
      (prisma.conversation.findMany as jest.Mock).mockResolvedValue([]);

      await request(app.getHttpServer())
        .get('/messaging/admin/conversations?statut=ouverte')
        .set('Authorization', `Bearer ${patronToken}`)
        .expect(200);

      expect(prisma.conversation.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ statut: 'ouverte' }),
        }),
      );
    });

    it('should return 401 for client token', async () => {
      await request(app.getHttpServer())
        .get('/messaging/admin/conversations')
        .set('Authorization', `Bearer ${clientToken}`)
        .expect(401);
    });
  });

  describe('POST /messaging/admin/conversations/:id/messages (patron)', () => {
    it('should return 201 when admin sends a message', async () => {
      (prisma.conversation.findUnique as jest.Mock).mockResolvedValue(mockConversation);
      (prisma.message.create as jest.Mock).mockResolvedValue({
        ...mockMessage,
        expediteurType: 'employe',
        expediteurId: mockPatron.id,
        contenu: 'Reponse admin',
      });
      (prisma.conversation.update as jest.Mock).mockResolvedValue(mockConversation);

      const response = await request(app.getHttpServer())
        .post(`/messaging/admin/conversations/${mockConversation.id}/messages`)
        .set('Authorization', `Bearer ${patronToken}`)
        .send({ contenu: 'Reponse admin' })
        .expect(201);

      expect(response.body).toHaveProperty('expediteurType', 'employe');
    });
  });

  describe('PATCH /messaging/admin/conversations/:id/close (patron)', () => {
    it('should return 200 when closing a conversation', async () => {
      (prisma.conversation.findUnique as jest.Mock).mockResolvedValue(mockConversation);
      (prisma.conversation.update as jest.Mock).mockResolvedValue({
        ...mockConversation,
        statut: 'fermee',
      });

      const response = await request(app.getHttpServer())
        .patch(`/messaging/admin/conversations/${mockConversation.id}/close`)
        .set('Authorization', `Bearer ${patronToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('statut', 'fermee');
    });
  });

  describe('GET /messaging/unread-count', () => {
    it('should return 200 with unread count for client', async () => {
      (prisma.message.count as jest.Mock).mockResolvedValue(5);

      const response = await request(app.getHttpServer())
        .get('/messaging/unread-count')
        .set('Authorization', `Bearer ${clientToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('count', 5);
    });

    it('should return 200 with unread count for admin', async () => {
      (prisma.message.count as jest.Mock).mockResolvedValue(10);

      const response = await request(app.getHttpServer())
        .get('/messaging/unread-count')
        .set('Authorization', `Bearer ${patronToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('count', 10);
    });
  });
});
