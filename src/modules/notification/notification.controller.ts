import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { NotificationStatus, Role } from '@prisma/client';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { NotificationService } from './notification.service';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Roles(Role.PATIENT, Role.DOCTOR, Role.ADMIN)
  @Get('mine')
  @ApiOperation({ summary: 'Get notifications of current user' })
  listMyNotifications(@CurrentUser() user: { sub: string }) {
    return this.notificationService.listMyNotifications(user.sub);
  }
}

@ApiTags('Admin Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin/notifications')
export class AdminNotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('logs')
  @ApiOperation({ summary: 'Admin lists notification logs' })
  listNotificationLogs(@Query('status') status?: NotificationStatus) {
    return this.notificationService.listAllNotificationLogs(status);
  }

  @Post('outbox/process')
  @ApiOperation({ summary: 'Admin triggers outbox processing batch' })
  processOutbox(@Query('limit') limit?: string) {
    const parsedLimit = limit ? Number(limit) : undefined;
    return this.notificationService.processOutboxBatch(parsedLimit);
  }

  @Post('reminders/appointments')
  @ApiOperation({ summary: 'Admin triggers appointment reminder notifications' })
  sendAppointmentReminders(@Query('withinMinutes') withinMinutes?: string) {
    const parsedWithinMinutes = withinMinutes ? Number(withinMinutes) : undefined;
    return this.notificationService.sendAppointmentReminders(parsedWithinMinutes);
  }
}
