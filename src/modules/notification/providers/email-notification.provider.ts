import { Injectable, Logger } from '@nestjs/common';
import { NotificationType } from '@prisma/client';

import {
  NotificationDeliveryRequest,
  NotificationDeliveryResult,
  NotificationProvider,
} from './notification-provider';

@Injectable()
export class EmailNotificationProvider implements NotificationProvider {
  readonly name = process.env.NOTIFICATION_EMAIL_PROVIDER ?? 'EMAIL_PROVIDER';
  private readonly logger = new Logger(EmailNotificationProvider.name);

  supports(type: NotificationType) {
    return type === NotificationType.EMAIL;
  }

  async send(input: NotificationDeliveryRequest): Promise<NotificationDeliveryResult> {
    if (process.env.NOTIFICATION_EMAIL_PROVIDER_ENABLED !== 'true') {
      return {
        success: false,
        provider: this.name,
        errorCode: 'EMAIL_PROVIDER_NOT_CONFIGURED',
        errorMsg: 'Configure NOTIFICATION_EMAIL_PROVIDER_ENABLED and provider secrets.',
      };
    }

    this.logger.log(
      `Email provider dry-run accepted ${input.externalRef} for user:${input.recipientUserId}`,
    );
    return {
      success: true,
      provider: this.name,
    };
  }
}
