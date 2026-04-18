import { Module } from '@nestjs/common';

import { AdminNotificationController, NotificationController } from './notification.controller';
import { NotificationScheduler } from './notification.scheduler';
import { NotificationService } from './notification.service';

@Module({
  imports: [],
  controllers: [NotificationController, AdminNotificationController],
  providers: [NotificationService, NotificationScheduler],
  exports: [NotificationService],
})
export class NotificationModule {}
