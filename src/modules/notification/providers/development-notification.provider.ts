import { Injectable, Logger } from '@nestjs/common';
import { NotificationType } from '@prisma/client';

import {
  NotificationDeliveryRequest,
  NotificationDeliveryResult,
  NotificationProvider,
} from './notification-provider';

@Injectable()
export class DevelopmentNotificationProvider implements NotificationProvider {
  readonly name = 'DEV_NOTIFICATION';
  private readonly logger = new Logger(DevelopmentNotificationProvider.name);

  supports(type: NotificationType) {
    return type === NotificationType.EMAIL || type === NotificationType.SMS;
  }

  async send(input: NotificationDeliveryRequest): Promise<NotificationDeliveryResult> {
    this.logger.log(
      `[${input.type}] ${input.externalRef} -> user:${input.recipientUserId} | ${input.content}`,
    );
    return {
      success: true,
      provider: this.name,
    };
  }
}
