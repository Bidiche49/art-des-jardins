import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { NotificationsService } from './notifications.service';
import { PrismaService } from '../../database/prisma.service';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    pushSubscription: {
      upsert: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
      count: jest.fn(),
    },
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      const config: Record<string, string> = {
        VAPID_PUBLIC_KEY: '',
        VAPID_PRIVATE_KEY: '',
        VAPID_SUBJECT: 'mailto:test@test.com',
      };
      return config[key];
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('subscribe', () => {
    it('should create a subscription', async () => {
      const subscription = {
        id: 'sub-123',
        userId: 'user-123',
        endpoint: 'https://push.example.com',
        p256dh: 'key123',
        auth: 'auth123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.pushSubscription.upsert.mockResolvedValue(subscription);

      const result = await service.subscribe('user-123', {
        endpoint: 'https://push.example.com',
        p256dh: 'key123',
        auth: 'auth123',
      });

      expect(result.success).toBe(true);
      expect(result.subscriptionId).toBe('sub-123');
      expect(mockPrismaService.pushSubscription.upsert).toHaveBeenCalled();
    });
  });

  describe('unsubscribe', () => {
    it('should delete a subscription', async () => {
      const subscription = {
        id: 'sub-123',
        userId: 'user-123',
        endpoint: 'https://push.example.com',
      };

      mockPrismaService.pushSubscription.findFirst.mockResolvedValue(subscription);
      mockPrismaService.pushSubscription.delete.mockResolvedValue(subscription);

      const result = await service.unsubscribe('user-123', 'https://push.example.com');

      expect(result.success).toBe(true);
      expect(mockPrismaService.pushSubscription.delete).toHaveBeenCalledWith({
        where: { id: 'sub-123' },
      });
    });

    it('should throw if subscription not found', async () => {
      mockPrismaService.pushSubscription.findFirst.mockResolvedValue(null);

      await expect(
        service.unsubscribe('user-123', 'https://push.example.com'),
      ).rejects.toThrow('Subscription not found');
    });
  });

  describe('sendToUser', () => {
    it('should return success even when not configured', async () => {
      mockPrismaService.pushSubscription.findMany.mockResolvedValue([]);

      const result = await service.sendToUser('user-123', {
        title: 'Test',
        body: 'Test message',
      });

      expect(result.success).toBe(true);
      expect(result.sent).toBe(0);
    });
  });

  describe('getUserSubscriptionsCount', () => {
    it('should return count of subscriptions', async () => {
      mockPrismaService.pushSubscription.count.mockResolvedValue(2);

      const result = await service.getUserSubscriptionsCount('user-123');

      expect(result).toBe(2);
      expect(mockPrismaService.pushSubscription.count).toHaveBeenCalledWith({
        where: { userId: 'user-123' },
      });
    });
  });

  describe('getVapidPublicKey', () => {
    it('should return empty string when not configured', () => {
      const result = service.getVapidPublicKey();
      expect(result).toBe('');
    });
  });
});
