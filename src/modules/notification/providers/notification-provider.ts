import { NotificationType } from '@prisma/client';

export interface NotificationDeliveryRequest {
  type: NotificationType;
  recipientUserId: string;
  content: string;
  externalRef: string;
}

export interface NotificationDeliveryResult {
  success: boolean;
  provider: string;
  errorCode?: string;
  errorMsg?: string;
}

export interface NotificationProvider {
  readonly name: string;
  supports(type: NotificationType): boolean;
  send(input: NotificationDeliveryRequest): Promise<NotificationDeliveryResult>;
}
