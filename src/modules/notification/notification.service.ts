import { Injectable } from '@nestjs/common';
import {
  AppointmentStatus,
  NotificationStatus,
  NotificationType,
  OutboxStatus,
} from '@prisma/client';
import { uuidv7 } from 'uuidv7';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class NotificationService {
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
            email: true,
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
    const events = await this.prisma.outboxEvent.findMany({
      where: { status: OutboxStatus.PENDING },
      orderBy: { createdAt: 'asc' },
      take: Math.min(safeLimit, 500),
    });

    let processed = 0;
    for (const event of events) {
      try {
        if (event.aggregateType === 'APPOINTMENT' && event.eventType === 'APPOINTMENT_CREATED') {
          const payload = event.payload as {
            patientId?: string;
            doctorId?: string;
            appointmentId?: string;
          };

          if (payload.patientId) {
            const patient = await this.prisma.patientProfile.findUnique({
              where: { id: payload.patientId },
              select: { userId: true },
            });
            if (patient) {
              await this.prisma.notificationLog.create({
                data: {
                  id: uuidv7(),
                  userId: patient.userId,
                  type: NotificationType.EMAIL,
                  content: `Appointment ${payload.appointmentId ?? ''} created successfully.`,
                  status: NotificationStatus.SENT,
                  provider: 'IN_APP',
                },
              });
            }
          }
        }

        if (event.aggregateType === 'QUESTION' && event.eventType === 'QUESTION_ANSWERED') {
          const payload = event.payload as { questionId?: string };
          if (payload.questionId) {
            const question = await this.prisma.question.findUnique({
              where: { id: payload.questionId },
              include: {
                patient: true,
              },
            });
            if (question) {
              await this.prisma.notificationLog.create({
                data: {
                  id: uuidv7(),
                  userId: question.patient.userId,
                  type: NotificationType.EMAIL,
                  content: `Your question "${question.title}" has been answered.`,
                  status: NotificationStatus.SENT,
                  provider: 'IN_APP',
                },
              });
            }
          }
        }

        await this.prisma.outboxEvent.update({
          where: { id: event.id },
          data: {
            status: OutboxStatus.SENT,
          },
        });
        processed += 1;
      } catch (error: any) {
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
      await this.prisma.notificationLog.createMany({
        data: [
          {
            id: uuidv7(),
            userId: appointment.patient.userId,
            type: NotificationType.EMAIL,
            content: `Reminder: appointment at ${appointment.scheduledAt.toISOString()}.`,
            status: NotificationStatus.SENT,
            provider: 'IN_APP',
          },
          {
            id: uuidv7(),
            userId: appointment.doctor.userId,
            type: NotificationType.EMAIL,
            content: `Reminder: appointment at ${appointment.scheduledAt.toISOString()}.`,
            status: NotificationStatus.SENT,
            provider: 'IN_APP',
          },
        ],
      });
    }

    return {
      remindersSent: appointments.length * 2,
      appointmentsScanned: appointments.length,
      withinMinutes: safeWithinMinutes,
    };
  }
}
