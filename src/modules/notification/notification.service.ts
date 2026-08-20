import { Injectable, Logger } from '@nestjs/common';
import {
  AppointmentStatus,
  NotificationStatus,
  NotificationType,
  OutboxStatus,
  Prisma,
} from '@prisma/client';
import { uuidv7 } from 'uuidv7';

import { PrismaService } from '../../prisma/prisma.service';
import { DevelopmentNotificationProvider } from './providers/development-notification.provider';
import { EmailNotificationProvider } from './providers/email-notification.provider';
import { SmsNotificationProvider } from './providers/sms-notification.provider';
import { NotificationProvider } from './providers/notification-provider';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly developmentProvider: DevelopmentNotificationProvider,
    private readonly emailProvider: EmailNotificationProvider,
    private readonly smsProvider: SmsNotificationProvider,
  ) {}

  listMyNotifications(userId: string) {
    return this.prisma.notificationLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  listAllNotificationLogs(status?: NotificationStatus) {
    return this.prisma.notificationLog.findMany({
      where: {
        status,
      },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
      take: 200,
    });
  }

  async processOutboxBatch(limit = 100) {
    const safeLimit = Number.isFinite(limit) && limit > 0 ? limit : 100;
    const now = new Date();
    const events = await this.prisma.outboxEvent.findMany({
      where: {
        OR: [
          { status: OutboxStatus.PENDING },
          {
            status: OutboxStatus.FAILED,
            OR: [{ nextRetryAt: null }, { nextRetryAt: { lte: now } }],
          },
        ],
      },
      orderBy: { createdAt: 'asc' },
      take: Math.min(safeLimit, 500),
    });

    let processed = 0;
    for (const event of events) {
      const claimed = await this.prisma.outboxEvent.updateMany({
        where: {
          id: event.id,
          OR: [{ status: OutboxStatus.PENDING }, { status: OutboxStatus.FAILED }],
        },
        data: {
          status: OutboxStatus.PROCESSING,
        },
      });
      if (claimed.count !== 1) {
        continue;
      }

      try {
        await this.dispatchOutboxEvent(event);

        await this.prisma.outboxEvent.update({
          where: { id: event.id },
          data: {
            status: OutboxStatus.SENT,
            nextRetryAt: null,
          },
        });
        processed += 1;
      } catch (error: any) {
        this.logger.error(`Outbox processing failed for ${event.id}: ${error?.message ?? 'Unknown error'}`);
        await this.prisma.outboxEvent.update({
          where: { id: event.id },
          data: {
            status: OutboxStatus.FAILED,
            retryCount: { increment: 1 },
            nextRetryAt: new Date(Date.now() + 5 * 60 * 1000),
          },
        });
      }
    }

    return {
      scanned: events.length,
      processed,
    };
  }

  async sendAppointmentReminders(withinMinutes = 60) {
    const safeWithinMinutes =
      Number.isFinite(withinMinutes) && withinMinutes > 0 ? withinMinutes : 60;
    const now = new Date();
    const until = new Date(now.getTime() + safeWithinMinutes * 60 * 1000);

    const appointments = await this.prisma.appointment.findMany({
      where: {
        status: AppointmentStatus.CONFIRMED,
        scheduledAt: {
          gte: now,
          lte: until,
        },
      },
      include: {
        patient: true,
        doctor: true,
      },
    });

    for (const appointment of appointments) {
      await this.createNotificationIdempotent({
        userId: appointment.patient.userId,
        content: `Reminder: appointment at ${appointment.scheduledAt.toISOString()}.`,
        externalRef: `APPOINTMENT_REMINDER:${appointment.id}:PATIENT`,
        throwOnFailure: false,
      });
      await this.createNotificationIdempotent({
        userId: appointment.doctor.userId,
        content: `Reminder: appointment at ${appointment.scheduledAt.toISOString()}.`,
        externalRef: `APPOINTMENT_REMINDER:${appointment.id}:DOCTOR`,
        throwOnFailure: false,
      });
    }

    return {
      remindersSent: appointments.length * 2,
      appointmentsScanned: appointments.length,
      withinMinutes: safeWithinMinutes,
    };
  }

  async createPasswordResetNotification(input: {
    userId: string;
    email: string;
    resetUrl: string;
    tokenId: string;
    expiresAt: Date;
  }) {
    const isProduction = process.env.NODE_ENV === 'production';
    const provider =
      process.env.PASSWORD_RESET_NOTIFICATION_PROVIDER ??
      (isProduction ? this.emailProvider.name : this.developmentProvider.name);
    const canStoreResetLink = !isProduction;
    const content = canStoreResetLink
      ? [
          `Password reset requested for ${input.email}.`,
          `Reset link: ${input.resetUrl}`,
          `This link expires at ${input.expiresAt.toISOString()}.`,
        ].join('\n')
      : [
          `Password reset requested for ${input.email}.`,
          'A reset link was generated but not stored because production email delivery is not configured.',
        ].join('\n');

    return this.createNotificationIdempotent({
      userId: input.userId,
      type: NotificationType.EMAIL,
      content,
      externalRef: `PASSWORD_RESET:${input.tokenId}`,
      provider,
      throwOnFailure: false,
    });
  }

  private async dispatchOutboxEvent(event: {
    id: string;
    aggregateType: string;
    eventType: string;
    payload: Prisma.JsonValue;
  }) {
    if (event.aggregateType === 'APPOINTMENT' && event.eventType === 'APPOINTMENT_CREATED') {
      const payload = event.payload as {
        patientId?: string;
        doctorId?: string;
        appointmentId?: string;
        scheduledAt?: string;
      };

      if (payload.patientId) {
        const patient = await this.prisma.patientProfile.findUnique({
          where: { id: payload.patientId },
          select: { userId: true },
        });
        if (patient) {
          await this.createNotificationIdempotent({
            userId: patient.userId,
            content: `Appointment ${payload.appointmentId ?? ''} created successfully.`,
            externalRef: `${event.id}:PATIENT_CREATED`,
          });
        }
      }

      if (payload.doctorId) {
        const doctor = await this.prisma.doctorProfile.findUnique({
          where: { id: payload.doctorId },
          select: { userId: true },
        });
        if (doctor) {
          await this.createNotificationIdempotent({
            userId: doctor.userId,
            content: `New appointment request ${payload.appointmentId ?? ''} has been created.`,
            externalRef: `${event.id}:DOCTOR_CREATED`,
          });
        }
      }

      return;
    }

    if (event.aggregateType === 'APPOINTMENT' && event.eventType === 'APPOINTMENT_CONFIRMED') {
      const payload = event.payload as {
        patientId?: string;
        appointmentId?: string;
        scheduledAt?: string;
      };
      if (!payload.patientId) {
        return;
      }

      const patient = await this.prisma.patientProfile.findUnique({
        where: { id: payload.patientId },
        select: { userId: true },
      });
      if (patient) {
        await this.createNotificationIdempotent({
          userId: patient.userId,
          content: `Your appointment ${payload.appointmentId ?? ''} has been confirmed.`,
          externalRef: `${event.id}:PATIENT_CONFIRMED`,
        });
      }
      return;
    }

    if (event.aggregateType === 'QUESTION' && event.eventType === 'QUESTION_ANSWERED') {
      const payload = event.payload as { questionId?: string };
      if (!payload.questionId) {
        return;
      }
      const question = await this.prisma.question.findUnique({
        where: { id: payload.questionId },
        include: {
          patient: true,
        },
      });
      if (question) {
        await this.createNotificationIdempotent({
          userId: question.patient.userId,
          content: `Your question "${question.title}" has been answered.`,
          externalRef: `${event.id}:PATIENT_QUESTION_ANSWERED`,
        });
      }
    }
  }

  private async createNotificationIdempotent(input: {
    userId: string;
    content: string;
    externalRef: string;
    type?: NotificationType;
    provider?: string;
    throwOnFailure?: boolean;
  }) {
    const type = input.type ?? NotificationType.EMAIL;
    const provider = this.resolveProvider(type, input.provider);
    const log = await this.prisma.notificationLog.upsert({
      where: { externalRef: input.externalRef },
      create: {
        id: uuidv7(),
        userId: input.userId,
        type,
        content: input.content,
        externalRef: input.externalRef,
        status: NotificationStatus.PENDING,
        provider: provider.name,
      },
      update: {},
    });

    if (log.status === NotificationStatus.SENT) {
      return log;
    }

    const result = await provider.send({
      type,
      recipientUserId: input.userId,
      content: input.content,
      externalRef: input.externalRef,
    });

    const updated = await this.prisma.notificationLog.update({
      where: { id: log.id },
      data: {
        status: result.success ? NotificationStatus.SENT : NotificationStatus.FAILED,
        provider: result.provider,
        errorCode: result.success ? null : result.errorCode ?? 'NOTIFICATION_DELIVERY_FAILED',
        errorMsg: result.success ? null : result.errorMsg ?? 'Notification delivery failed',
      },
    });

    if (!result.success && input.throwOnFailure !== false) {
      throw new Error(result.errorMsg ?? 'Notification delivery failed');
    }

    return updated;
  }

  private resolveProvider(type: NotificationType, preferredProvider?: string): NotificationProvider {
    if (preferredProvider === this.developmentProvider.name || preferredProvider === 'development') {
      return this.developmentProvider;
    }

    if (preferredProvider === this.emailProvider.name || preferredProvider === 'email') {
      return this.emailProvider;
    }

    if (preferredProvider && type === NotificationType.EMAIL) {
      return this.emailProvider;
    }

    if (type === NotificationType.SMS) {
      return process.env.NOTIFICATION_SMS_PROVIDER_ENABLED === 'true'
        ? this.smsProvider
        : this.developmentProvider;
    }

    const configuredProvider =
      process.env.NOTIFICATION_PROVIDER ??
      (process.env.NODE_ENV === 'production' ? 'email' : 'development');
    if (configuredProvider === 'email') {
      return this.emailProvider;
    }

    return this.developmentProvider;
  }
}
