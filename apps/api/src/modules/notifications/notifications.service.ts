import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as webpush from 'web-push';
import { PrismaService } from '../../database/prisma.service';
import { SubscribeDto, SendNotificationDto } from './dto';

interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  url?: string;
  tag?: string;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private readonly vapidPublicKey: string;
  private readonly vapidPrivateKey: string;
  private readonly isConfigured: boolean;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.vapidPublicKey = this.configService.get<string>('VAPID_PUBLIC_KEY') || '';
    this.vapidPrivateKey = this.configService.get<string>('VAPID_PRIVATE_KEY') || '';
    const vapidSubject = this.configService.get<string>('VAPID_SUBJECT') || 'mailto:contact@artjardin.fr';

    if (this.vapidPublicKey && this.vapidPrivateKey) {
      webpush.setVapidDetails(vapidSubject, this.vapidPublicKey, this.vapidPrivateKey);
      this.isConfigured = true;
      this.logger.log('Web Push configured successfully');
    } else {
      this.isConfigured = false;
      this.logger.warn('Web Push not configured - VAPID keys missing');
    }
  }

  /**
   * Get VAPID public key for client-side subscription
   */
  getVapidPublicKey(): string {
    return this.vapidPublicKey;
  }

  /**
   * Subscribe a user to push notifications
   */
  async subscribe(userId: string, dto: SubscribeDto) {
    // Upsert subscription (same endpoint = same device)
    const subscription = await this.prisma.pushSubscription.upsert({
      where: { endpoint: dto.endpoint },
      create: {
        userId,
        endpoint: dto.endpoint,
        p256dh: dto.p256dh,
        auth: dto.auth,
      },
      update: {
        userId,
        p256dh: dto.p256dh,
        auth: dto.auth,
        updatedAt: new Date(),
      },
    });

    this.logger.log(`User ${userId} subscribed to push notifications`);

    return {
      success: true,
      subscriptionId: subscription.id,
    };
  }

  /**
   * Unsubscribe from push notifications
   */
  async unsubscribe(userId: string, endpoint: string) {
    const subscription = await this.prisma.pushSubscription.findFirst({
      where: { userId, endpoint },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    await this.prisma.pushSubscription.delete({
      where: { id: subscription.id },
    });

    this.logger.log(`User ${userId} unsubscribed from push notifications`);

    return { success: true };
  }

  /**
   * Send notification to a specific user
   */
  async sendToUser(userId: string, notification: NotificationPayload) {
    if (!this.isConfigured) {
      this.logger.warn(`[DEV] Would send notification to user ${userId}: ${notification.title}`);
      return { success: true, sent: 0, failed: 0 };
    }

    const subscriptions = await this.prisma.pushSubscription.findMany({
      where: { userId },
    });

    if (subscriptions.length === 0) {
      this.logger.debug(`No subscriptions found for user ${userId}`);
      return { success: true, sent: 0, failed: 0 };
    }

    return this.sendToSubscriptions(subscriptions, notification);
  }

  /**
   * Send notification to all users with a specific role
   */
  async sendToRole(role: 'patron' | 'employe', notification: NotificationPayload) {
    if (!this.isConfigured) {
      this.logger.warn(`[DEV] Would send notification to role ${role}: ${notification.title}`);
      return { success: true, sent: 0, failed: 0 };
    }

    const subscriptions = await this.prisma.pushSubscription.findMany({
      where: {
        user: { role },
      },
    });

    if (subscriptions.length === 0) {
      this.logger.debug(`No subscriptions found for role ${role}`);
      return { success: true, sent: 0, failed: 0 };
    }

    return this.sendToSubscriptions(subscriptions, notification);
  }

  /**
   * Send notification to all subscribed users
   */
  async sendToAll(notification: NotificationPayload) {
    if (!this.isConfigured) {
      this.logger.warn(`[DEV] Would broadcast notification: ${notification.title}`);
      return { success: true, sent: 0, failed: 0 };
    }

    const subscriptions = await this.prisma.pushSubscription.findMany();

    if (subscriptions.length === 0) {
      this.logger.debug('No subscriptions found');
      return { success: true, sent: 0, failed: 0 };
    }

    return this.sendToSubscriptions(subscriptions, notification);
  }

  /**
   * Send notification to specific subscriptions
   */
  private async sendToSubscriptions(
    subscriptions: Array<{ id: string; endpoint: string; p256dh: string; auth: string }>,
    notification: NotificationPayload,
  ) {
    const payload = JSON.stringify({
      title: notification.title,
      body: notification.body,
      icon: notification.icon || '/icons/icon-192x192.png',
      badge: notification.badge || '/icons/badge-72x72.png',
      data: {
        url: notification.url || '/',
      },
      tag: notification.tag,
    });

    let sent = 0;
    let failed = 0;
    const expiredSubscriptions: string[] = [];

    await Promise.all(
      subscriptions.map(async (sub) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: {
                p256dh: sub.p256dh,
                auth: sub.auth,
              },
            },
            payload,
          );
          sent++;
        } catch (error: any) {
          failed++;
          // Handle expired/invalid subscriptions
          if (error.statusCode === 404 || error.statusCode === 410) {
            expiredSubscriptions.push(sub.id);
            this.logger.debug(`Subscription ${sub.id} expired, marking for deletion`);
          } else {
            this.logger.error(`Failed to send notification to ${sub.endpoint}: ${error.message}`);
          }
        }
      }),
    );

    // Clean up expired subscriptions
    if (expiredSubscriptions.length > 0) {
      await this.prisma.pushSubscription.deleteMany({
        where: { id: { in: expiredSubscriptions } },
      });
      this.logger.log(`Deleted ${expiredSubscriptions.length} expired subscriptions`);
    }

    this.logger.log(`Notifications sent: ${sent}, failed: ${failed}`);

    return { success: true, sent, failed };
  }

  /**
   * Get user's subscriptions count
   */
  async getUserSubscriptionsCount(userId: string): Promise<number> {
    return this.prisma.pushSubscription.count({
      where: { userId },
    });
  }
}
