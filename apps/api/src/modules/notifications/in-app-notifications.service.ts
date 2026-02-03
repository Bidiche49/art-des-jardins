import { Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { NotificationType } from '@art-et-jardin/database';
import {
  CreateInAppNotificationDto,
  NotificationTypeDto,
} from './dto/in-app-notification.dto';

@Injectable()
export class InAppNotificationsService {
  private readonly logger = new Logger(InAppNotificationsService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Create a new in-app notification
   */
  async create(dto: CreateInAppNotificationDto) {
    const notification = await this.prisma.notification.create({
      data: {
        userId: dto.userId,
        type: dto.type as NotificationType,
        title: dto.title,
        message: dto.message,
        link: dto.link,
      },
    });

    this.logger.debug(`Created notification ${notification.id} for user ${dto.userId}`);
    return notification;
  }

  /**
   * Create notification for multiple users at once
   */
  async createForUsers(
    userIds: string[],
    data: Omit<CreateInAppNotificationDto, 'userId'>,
  ) {
    const notifications = await this.prisma.notification.createMany({
      data: userIds.map((userId) => ({
        userId,
        type: data.type as NotificationType,
        title: data.title,
        message: data.message,
        link: data.link,
      })),
    });

    this.logger.debug(`Created ${notifications.count} notifications`);
    return { count: notifications.count };
  }

  /**
   * Create notification for all users with a specific role
   */
  async createForRole(
    role: 'patron' | 'employe',
    data: Omit<CreateInAppNotificationDto, 'userId'>,
  ) {
    const users = await this.prisma.user.findMany({
      where: { role, actif: true },
      select: { id: true },
    });

    if (users.length === 0) {
      return { count: 0 };
    }

    return this.createForUsers(
      users.map((u) => u.id),
      data,
    );
  }

  /**
   * Get notifications for a user with pagination
   */
  async getForUser(
    userId: string,
    options: {
      limit?: number;
      offset?: number;
      unreadOnly?: boolean;
      type?: NotificationTypeDto;
    } = {},
  ) {
    const { limit = 50, offset = 0, unreadOnly = false, type } = options;

    const where: any = { userId };

    if (unreadOnly) {
      where.readAt = null;
    }

    if (type) {
      where.type = type;
    }

    // Only get notifications from last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    where.createdAt = { gte: thirtyDaysAgo };

    const [notifications, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      this.prisma.notification.count({ where }),
    ]);

    return {
      notifications,
      total,
      hasMore: offset + notifications.length < total,
    };
  }

  /**
   * Get unread count for a user
   */
  async getUnreadCount(userId: string) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [total, info, warning, success, action_required] = await Promise.all([
      this.prisma.notification.count({
        where: {
          userId,
          readAt: null,
          createdAt: { gte: thirtyDaysAgo },
        },
      }),
      this.prisma.notification.count({
        where: {
          userId,
          readAt: null,
          type: 'info',
          createdAt: { gte: thirtyDaysAgo },
        },
      }),
      this.prisma.notification.count({
        where: {
          userId,
          readAt: null,
          type: 'warning',
          createdAt: { gte: thirtyDaysAgo },
        },
      }),
      this.prisma.notification.count({
        where: {
          userId,
          readAt: null,
          type: 'success',
          createdAt: { gte: thirtyDaysAgo },
        },
      }),
      this.prisma.notification.count({
        where: {
          userId,
          readAt: null,
          type: 'action_required',
          createdAt: { gte: thirtyDaysAgo },
        },
      }),
    ]);

    return {
      unread: total,
      byType: {
        info,
        warning,
        success,
        action_required,
      },
    };
  }

  /**
   * Mark a single notification as read
   */
  async markAsRead(userId: string, notificationId: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    if (notification.userId !== userId) {
      throw new ForbiddenException('Cannot mark notification belonging to another user');
    }

    if (notification.readAt) {
      return notification; // Already read
    }

    const updated = await this.prisma.notification.update({
      where: { id: notificationId },
      data: { readAt: new Date() },
    });

    this.logger.debug(`Marked notification ${notificationId} as read`);
    return updated;
  }

  /**
   * Mark multiple notifications as read
   */
  async markMultipleAsRead(userId: string, notificationIds: string[]) {
    const result = await this.prisma.notification.updateMany({
      where: {
        id: { in: notificationIds },
        userId,
        readAt: null,
      },
      data: { readAt: new Date() },
    });

    this.logger.debug(`Marked ${result.count} notifications as read`);
    return { count: result.count };
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = await this.prisma.notification.updateMany({
      where: {
        userId,
        readAt: null,
        createdAt: { gte: thirtyDaysAgo },
      },
      data: { readAt: new Date() },
    });

    this.logger.debug(`Marked all ${result.count} notifications as read for user ${userId}`);
    return { count: result.count };
  }

  /**
   * Delete old notifications (older than 30 days)
   */
  async cleanupOldNotifications() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = await this.prisma.notification.deleteMany({
      where: {
        createdAt: { lt: thirtyDaysAgo },
      },
    });

    if (result.count > 0) {
      this.logger.log(`Cleaned up ${result.count} old notifications`);
    }

    return { deleted: result.count };
  }

  // ========================================
  // CONVENIENCE METHODS FOR BUSINESS EVENTS
  // ========================================

  /**
   * Notify patron when a devis is signed
   */
  async notifyDevisSigned(devisId: string, devisNumero: string, clientName: string) {
    const patrons = await this.prisma.user.findMany({
      where: { role: 'patron', actif: true },
      select: { id: true },
    });

    return this.createForUsers(
      patrons.map((p) => p.id),
      {
        type: NotificationTypeDto.SUCCESS,
        title: 'Devis signé',
        message: `Le devis ${devisNumero} a été signé par ${clientName}`,
        link: `/devis/${devisId}`,
      },
    );
  }

  /**
   * Notify patron when a facture is overdue
   */
  async notifyFactureOverdue(factureId: string, factureNumero: string, daysOverdue: number) {
    const patrons = await this.prisma.user.findMany({
      where: { role: 'patron', actif: true },
      select: { id: true },
    });

    return this.createForUsers(
      patrons.map((p) => p.id),
      {
        type: NotificationTypeDto.WARNING,
        title: 'Facture en retard',
        message: `La facture ${factureNumero} est en retard de ${daysOverdue} jours`,
        link: `/factures/${factureId}`,
      },
    );
  }

  /**
   * Notify employe of tomorrow's intervention
   */
  async notifyInterventionTomorrow(
    userId: string,
    chantierId: string,
    adresse: string,
    heureDebut: string,
  ) {
    return this.create({
      userId,
      type: NotificationTypeDto.INFO,
      title: 'Intervention demain',
      message: `Intervention prévue à ${heureDebut} - ${adresse}`,
      link: `/chantiers/${chantierId}`,
    });
  }

  /**
   * Notify concerned users of a new client message
   */
  async notifyNewClientMessage(
    conversationId: string,
    clientName: string,
    targetUserIds: string[],
  ) {
    return this.createForUsers(targetUserIds, {
      type: NotificationTypeDto.ACTION_REQUIRED,
      title: 'Nouveau message',
      message: `${clientName} vous a envoyé un message`,
      link: `/conversations/${conversationId}`,
    });
  }
}
