import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { InAppNotificationsService } from './in-app-notifications.service';
import {
  CreateInAppNotificationDto,
  MarkMultipleReadDto,
  NotificationTypeDto,
  InAppNotificationResponseDto,
  NotificationCountResponseDto,
} from './dto/in-app-notification.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@art-et-jardin/database';

@ApiTags('In-App Notifications')
@Controller('in-app-notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class InAppNotificationsController {
  constructor(private inAppNotificationsService: InAppNotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get user notifications' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Max items (default 50)' })
  @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Skip items (default 0)' })
  @ApiQuery({ name: 'unreadOnly', required: false, type: Boolean, description: 'Only unread' })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: NotificationTypeDto,
    description: 'Filter by type',
  })
  @ApiResponse({ status: 200, description: 'List of notifications', type: [InAppNotificationResponseDto] })
  getNotifications(
    @Request() req: any,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Query('unreadOnly') unreadOnly?: boolean,
    @Query('type') type?: NotificationTypeDto,
  ) {
    return this.inAppNotificationsService.getForUser(req.user.id, {
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      unreadOnly: unreadOnly === true || unreadOnly === 'true' as any,
      type,
    });
  }

  @Get('count')
  @ApiOperation({ summary: 'Get unread notifications count' })
  @ApiResponse({ status: 200, description: 'Unread count', type: NotificationCountResponseDto })
  getUnreadCount(@Request() req: any) {
    return this.inAppNotificationsService.getUnreadCount(req.user.id);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark a notification as read' })
  @ApiResponse({ status: 200, description: 'Notification marked as read', type: InAppNotificationResponseDto })
  markAsRead(
    @Request() req: any,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.inAppNotificationsService.markAsRead(req.user.id, id);
  }

  @Post('mark-multiple-read')
  @ApiOperation({ summary: 'Mark multiple notifications as read' })
  @ApiResponse({ status: 200, description: 'Notifications marked as read' })
  markMultipleAsRead(@Request() req: any, @Body() dto: MarkMultipleReadDto) {
    return this.inAppNotificationsService.markMultipleAsRead(req.user.id, dto.ids);
  }

  @Post('mark-all-read')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  @ApiResponse({ status: 200, description: 'All notifications marked as read' })
  markAllAsRead(@Request() req: any) {
    return this.inAppNotificationsService.markAllAsRead(req.user.id);
  }

  // Admin endpoints (patron only)

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.patron)
  @ApiOperation({ summary: 'Create a notification for a user (patron only)' })
  @ApiResponse({ status: 201, description: 'Notification created', type: InAppNotificationResponseDto })
  createNotification(@Body() dto: CreateInAppNotificationDto) {
    return this.inAppNotificationsService.create(dto);
  }

  @Post('broadcast')
  @UseGuards(RolesGuard)
  @Roles(UserRole.patron)
  @ApiOperation({ summary: 'Broadcast notification to a role (patron only)' })
  @ApiQuery({ name: 'role', enum: ['patron', 'employe'], required: true })
  @ApiResponse({ status: 201, description: 'Notifications created' })
  broadcastToRole(
    @Query('role') role: 'patron' | 'employe',
    @Body() dto: Omit<CreateInAppNotificationDto, 'userId'>,
  ) {
    return this.inAppNotificationsService.createForRole(role, dto);
  }

  @Post('cleanup')
  @UseGuards(RolesGuard)
  @Roles(UserRole.patron)
  @ApiOperation({ summary: 'Cleanup old notifications (patron only)' })
  @ApiResponse({ status: 200, description: 'Old notifications deleted' })
  cleanupOld() {
    return this.inAppNotificationsService.cleanupOldNotifications();
  }
}
