import { Injectable } from '@nestjs/common';
import { NotificationType } from '@prisma/client';

import {
  NotificationDeliveryRequest,
  NotificationDeliveryResult,
  NotificationProvider,
} from './notification-provider';

@Injectable()
export class SmsNotificationProvider implements NotificationProvider {
  readonly name = process.env.NOTIFICATION_SMS_PROVIDER ?? 'SMS_PROVIDER';

  supports(type: NotificationType) {
    return type === NotificationType.SMS;
  }

  async send(_input: NotificationDeliveryRequest): Promise<NotificationDeliveryResult> {
    return {
      success: false,
      provider: this.name,
      errorCode: 'SMS_PROVIDER_NOT_CONFIGURED',
      errorMsg: 'SMS notifications are optional and no SMS provider is configured.',
    };
  }
}
