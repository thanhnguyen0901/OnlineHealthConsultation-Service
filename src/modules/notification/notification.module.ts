import { Module } from '@nestjs/common';

import { AdminNotificationController, NotificationController } from './notification.controller';
import { NotificationScheduler } from './notification.scheduler';
import { NotificationService } from './notification.service';
import { DevelopmentNotificationProvider } from './providers/development-notification.provider';
import { EmailNotificationProvider } from './providers/email-notification.provider';
import { SmsNotificationProvider } from './providers/sms-notification.provider';

@Module({
  imports: [],
  controllers: [NotificationController, AdminNotificationController],
  providers: [
    NotificationService,
    NotificationScheduler,
    DevelopmentNotificationProvider,
    EmailNotificationProvider,
    SmsNotificationProvider,
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
