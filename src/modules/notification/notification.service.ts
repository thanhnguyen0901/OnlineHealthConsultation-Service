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

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(private readonly prisma: PrismaService) {}

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
      });
      await this.createNotificationIdempotent({
        userId: appointment.doctor.userId,
        content: `Reminder: appointment at ${appointment.scheduledAt.toISOString()}.`,
        externalRef: `APPOINTMENT_REMINDER:${appointment.id}:DOCTOR`,
      });
    }

    return {
      remindersSent: appointments.length * 2,
      appointmentsScanned: appointments.length,
      withinMinutes: safeWithinMinutes,
    };
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
  }) {
    return this.prisma.notificationLog.upsert({
      where: { externalRef: input.externalRef },
      create: {
        id: uuidv7(),
        userId: input.userId,
        type: input.type ?? NotificationType.EMAIL,
        content: input.content,
        externalRef: input.externalRef,
        status: NotificationStatus.SENT,
        provider: input.provider ?? 'OUTBOX_WORKER',
      },
      update: {},
    });
  }
}
