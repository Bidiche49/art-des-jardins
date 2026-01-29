import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { NotificationsCronService } from './notifications.cron';
import { SubscribeDto, SendNotificationDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@art-et-jardin/database';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(
    private notificationsService: NotificationsService,
    private notificationsCronService: NotificationsCronService,
  ) {}

  @Get('vapid-public-key')
  @ApiOperation({ summary: 'Get VAPID public key for push subscription' })
  @ApiResponse({ status: 200, description: 'VAPID public key' })
  getVapidPublicKey() {
    return {
      publicKey: this.notificationsService.getVapidPublicKey(),
    };
  }

  @Post('subscribe')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Subscribe to push notifications' })
  @ApiResponse({ status: 201, description: 'Subscription created' })
  subscribe(@Request() req: any, @Body() dto: SubscribeDto) {
    return this.notificationsService.subscribe(req.user.id, dto);
  }

  @Delete('unsubscribe')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Unsubscribe from push notifications' })
  @ApiResponse({ status: 200, description: 'Subscription removed' })
  unsubscribe(@Request() req: any, @Body() body: { endpoint: string }) {
    return this.notificationsService.unsubscribe(req.user.id, body.endpoint);
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get notification subscription status' })
  @ApiResponse({ status: 200, description: 'Subscription status' })
  async getStatus(@Request() req: any) {
    const count = await this.notificationsService.getUserSubscriptionsCount(req.user.id);
    return {
      subscribed: count > 0,
      subscriptionsCount: count,
    };
  }

  @Post('send')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.patron)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Send notification to all users (patron only)' })
  @ApiResponse({ status: 200, description: 'Notification sent' })
  sendToAll(@Body() dto: SendNotificationDto) {
    return this.notificationsService.sendToAll({
      title: dto.title,
      body: dto.body,
      url: dto.url,
    });
  }

  @Post('send/test')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Send test notification to self' })
  @ApiResponse({ status: 200, description: 'Test notification sent' })
  sendTest(@Request() req: any) {
    return this.notificationsService.sendToUser(req.user.id, {
      title: 'Test Notification',
      body: 'Si vous voyez ce message, les notifications fonctionnent !',
      url: '/dashboard',
    });
  }

  @Post('reminders/trigger')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.patron)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Manually trigger intervention reminders (patron only)' })
  @ApiQuery({ name: 'type', enum: ['morning', 'evening'], required: true })
  @ApiResponse({ status: 200, description: 'Reminder triggered' })
  async triggerReminder(@Query('type') type: 'morning' | 'evening') {
    if (type === 'morning') {
      await this.notificationsCronService.triggerMorningReminder();
      return { success: true, type: 'morning', message: 'Rappel matin declenche' };
    } else {
      await this.notificationsCronService.triggerEveningReminder();
      return { success: true, type: 'evening', message: 'Rappel soir declenche' };
    }
  }
}
