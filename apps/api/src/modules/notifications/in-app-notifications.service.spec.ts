import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { InAppNotificationsService } from './in-app-notifications.service';
import { PrismaService } from '../../database/prisma.service';
import { NotificationTypeDto } from './dto/in-app-notification.dto';

describe('InAppNotificationsService', () => {
  let service: InAppNotificationsService;

  const mockNotification = {
    id: 'notif-1',
    userId: 'user-1',
    type: 'info',
    title: 'Test Notification',
    message: 'This is a test',
    link: '/test',
    readAt: null,
    createdAt: new Date('2026-02-01'),
  };

  const mockPrismaService = {
    notification: {
      create: jest.fn(),
      createMany: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      deleteMany: jest.fn(),
    },
    user: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InAppNotificationsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<InAppNotificationsService>(InAppNotificationsService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a notification', async () => {
      mockPrismaService.notification.create.mockResolvedValue(mockNotification);

      const result = await service.create({
        userId: 'user-1',
        type: NotificationTypeDto.INFO,
        title: 'Test Notification',
        message: 'This is a test',
        link: '/test',
      });

      expect(result).toEqual(mockNotification);
      expect(mockPrismaService.notification.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-1',
          type: 'info',
          title: 'Test Notification',
          message: 'This is a test',
          link: '/test',
        },
      });
    });
  });

  describe('createForUsers', () => {
    it('should create notifications for multiple users', async () => {
      mockPrismaService.notification.createMany.mockResolvedValue({ count: 3 });

      const result = await service.createForUsers(['user-1', 'user-2', 'user-3'], {
        type: NotificationTypeDto.WARNING,
        title: 'Broadcast',
        message: 'Message to all',
      });

      expect(result).toEqual({ count: 3 });
      expect(mockPrismaService.notification.createMany).toHaveBeenCalled();
    });
  });

  describe('createForRole', () => {
    it('should create notifications for all users with a role', async () => {
      mockPrismaService.user.findMany.mockResolvedValue([{ id: 'user-1' }, { id: 'user-2' }]);
      mockPrismaService.notification.createMany.mockResolvedValue({ count: 2 });

      const result = await service.createForRole('patron', {
        type: NotificationTypeDto.INFO,
        title: 'Patron only',
        message: 'Message for patrons',
      });

      expect(result).toEqual({ count: 2 });
      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith({
        where: { role: 'patron', actif: true },
        select: { id: true },
      });
    });

    it('should return count 0 if no users found', async () => {
      mockPrismaService.user.findMany.mockResolvedValue([]);

      const result = await service.createForRole('employe', {
        type: NotificationTypeDto.INFO,
        title: 'Test',
        message: 'Message',
      });

      expect(result).toEqual({ count: 0 });
      expect(mockPrismaService.notification.createMany).not.toHaveBeenCalled();
    });
  });

  describe('getForUser', () => {
    it('should get notifications with pagination', async () => {
      mockPrismaService.notification.findMany.mockResolvedValue([mockNotification]);
      mockPrismaService.notification.count.mockResolvedValue(10);

      const result = await service.getForUser('user-1', { limit: 5, offset: 0 });

      expect(result.notifications).toHaveLength(1);
      expect(result.total).toBe(10);
      expect(result.hasMore).toBe(true);
    });

    it('should filter by unread only', async () => {
      mockPrismaService.notification.findMany.mockResolvedValue([mockNotification]);
      mockPrismaService.notification.count.mockResolvedValue(1);

      await service.getForUser('user-1', { unreadOnly: true });

      expect(mockPrismaService.notification.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            userId: 'user-1',
            readAt: null,
          }),
        }),
      );
    });

    it('should filter by type', async () => {
      mockPrismaService.notification.findMany.mockResolvedValue([]);
      mockPrismaService.notification.count.mockResolvedValue(0);

      await service.getForUser('user-1', { type: NotificationTypeDto.WARNING });

      expect(mockPrismaService.notification.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            type: 'warning',
          }),
        }),
      );
    });
  });

  describe('getUnreadCount', () => {
    it('should return unread count by type', async () => {
      mockPrismaService.notification.count
        .mockResolvedValueOnce(10) // total
        .mockResolvedValueOnce(5)  // info
        .mockResolvedValueOnce(2)  // warning
        .mockResolvedValueOnce(2)  // success
        .mockResolvedValueOnce(1); // action_required

      const result = await service.getUnreadCount('user-1');

      expect(result).toEqual({
        unread: 10,
        byType: {
          info: 5,
          warning: 2,
          success: 2,
          action_required: 1,
        },
      });
    });
  });

  describe('markAsRead', () => {
    it('should mark notification as read', async () => {
      mockPrismaService.notification.findUnique.mockResolvedValue(mockNotification);
      mockPrismaService.notification.update.mockResolvedValue({
        ...mockNotification,
        readAt: new Date(),
      });

      const result = await service.markAsRead('user-1', 'notif-1');

      expect(result.readAt).toBeDefined();
      expect(mockPrismaService.notification.update).toHaveBeenCalledWith({
        where: { id: 'notif-1' },
        data: { readAt: expect.any(Date) },
      });
    });

    it('should throw NotFoundException if notification not found', async () => {
      mockPrismaService.notification.findUnique.mockResolvedValue(null);

      await expect(service.markAsRead('user-1', 'notif-999')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if notification belongs to another user', async () => {
      mockPrismaService.notification.findUnique.mockResolvedValue({
        ...mockNotification,
        userId: 'user-2',
      });

      await expect(service.markAsRead('user-1', 'notif-1')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should return notification if already read', async () => {
      const readNotification = { ...mockNotification, readAt: new Date() };
      mockPrismaService.notification.findUnique.mockResolvedValue(readNotification);

      const result = await service.markAsRead('user-1', 'notif-1');

      expect(result).toEqual(readNotification);
      expect(mockPrismaService.notification.update).not.toHaveBeenCalled();
    });
  });

  describe('markMultipleAsRead', () => {
    it('should mark multiple notifications as read', async () => {
      mockPrismaService.notification.updateMany.mockResolvedValue({ count: 3 });

      const result = await service.markMultipleAsRead('user-1', ['n1', 'n2', 'n3']);

      expect(result).toEqual({ count: 3 });
      expect(mockPrismaService.notification.updateMany).toHaveBeenCalledWith({
        where: {
          id: { in: ['n1', 'n2', 'n3'] },
          userId: 'user-1',
          readAt: null,
        },
        data: { readAt: expect.any(Date) },
      });
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all notifications as read for user', async () => {
      mockPrismaService.notification.updateMany.mockResolvedValue({ count: 5 });

      const result = await service.markAllAsRead('user-1');

      expect(result).toEqual({ count: 5 });
      expect(mockPrismaService.notification.updateMany).toHaveBeenCalledWith({
        where: expect.objectContaining({
          userId: 'user-1',
          readAt: null,
        }),
        data: { readAt: expect.any(Date) },
      });
    });
  });

  describe('cleanupOldNotifications', () => {
    it('should delete notifications older than 30 days', async () => {
      mockPrismaService.notification.deleteMany.mockResolvedValue({ count: 100 });

      const result = await service.cleanupOldNotifications();

      expect(result).toEqual({ deleted: 100 });
      expect(mockPrismaService.notification.deleteMany).toHaveBeenCalledWith({
        where: {
          createdAt: { lt: expect.any(Date) },
        },
      });
    });
  });

  describe('convenience methods', () => {
    beforeEach(() => {
      mockPrismaService.user.findMany.mockResolvedValue([{ id: 'patron-1' }]);
      mockPrismaService.notification.createMany.mockResolvedValue({ count: 1 });
      mockPrismaService.notification.create.mockResolvedValue(mockNotification);
    });

    it('notifyDevisSigned should notify patrons', async () => {
      await service.notifyDevisSigned('devis-1', 'DEV-2026-001', 'Client Test');

      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith({
        where: { role: 'patron', actif: true },
        select: { id: true },
      });
      expect(mockPrismaService.notification.createMany).toHaveBeenCalled();
    });

    it('notifyFactureOverdue should notify patrons', async () => {
      await service.notifyFactureOverdue('facture-1', 'FAC-2026-001', 15);

      expect(mockPrismaService.user.findMany).toHaveBeenCalled();
      expect(mockPrismaService.notification.createMany).toHaveBeenCalled();
    });

    it('notifyInterventionTomorrow should notify specific user', async () => {
      await service.notifyInterventionTomorrow(
        'user-1',
        'chantier-1',
        '123 rue Test',
        '08:00',
      );

      expect(mockPrismaService.notification.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: 'user-1',
          type: 'info',
          title: 'Intervention demain',
        }),
      });
    });

    it('notifyNewClientMessage should notify target users', async () => {
      mockPrismaService.notification.createMany.mockResolvedValue({ count: 2 });

      await service.notifyNewClientMessage('conv-1', 'Jean Dupont', ['user-1', 'user-2']);

      expect(mockPrismaService.notification.createMany).toHaveBeenCalledWith({
        data: expect.arrayContaining([
          expect.objectContaining({
            userId: 'user-1',
            type: 'action_required',
          }),
          expect.objectContaining({
            userId: 'user-2',
            type: 'action_required',
          }),
        ]),
      });
    });
  });
});
