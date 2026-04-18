import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as cron from 'node-cron';

import { NotificationService } from './notification.service';

@Injectable()
export class NotificationScheduler implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(NotificationScheduler.name);
  private outboxTask?: cron.ScheduledTask;
  private reminderTask?: cron.ScheduledTask;

  constructor(private readonly notificationService: NotificationService) {}

  onModuleInit() {
    const outboxCron = process.env.NOTIFICATION_OUTBOX_CRON ?? '*/1 * * * *';
    const reminderCron = process.env.NOTIFICATION_REMINDER_CRON ?? '*/5 * * * *';

    this.outboxTask = cron.schedule(outboxCron, async () => {
      try {
        const batchLimit = parseInt(process.env.NOTIFICATION_OUTBOX_BATCH_LIMIT ?? '100', 10);
        const result = await this.notificationService.processOutboxBatch(batchLimit);
        if (result.scanned > 0) {
          this.logger.log(`Outbox batch processed ${result.processed}/${result.scanned}`);
        }
      } catch (error: any) {
        this.logger.error(`Outbox scheduler failed: ${error?.message ?? 'Unknown error'}`);
      }
    });

    this.reminderTask = cron.schedule(reminderCron, async () => {
      try {
        const withinMinutes = parseInt(process.env.NOTIFICATION_REMINDER_WINDOW_MINUTES ?? '60', 10);
        const result = await this.notificationService.sendAppointmentReminders(withinMinutes);
        if (result.appointmentsScanned > 0) {
          this.logger.log(
            `Appointment reminders sent: ${result.remindersSent} for ${result.appointmentsScanned} appointments`,
          );
        }
      } catch (error: any) {
        this.logger.error(`Reminder scheduler failed: ${error?.message ?? 'Unknown error'}`);
      }
    });

    this.logger.log(`Notification schedulers started (outbox: ${outboxCron}, reminder: ${reminderCron})`);
  }

  onModuleDestroy() {
    this.outboxTask?.stop();
    this.reminderTask?.stop();
  }
}
