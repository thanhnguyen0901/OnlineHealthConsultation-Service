import { Injectable } from '@nestjs/common';
import { AppointmentStatus, NotificationStatus, OutboxStatus } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class OperationsService {
  constructor(private readonly prisma: PrismaService) {}

  async healthCheck() {
    const startedAt = Date.now();
    await this.prisma.$queryRaw`SELECT 1`;
    const dbLatencyMs = Date.now() - startedAt;

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      checks: {
        database: {
          status: 'ok',
          latencyMs: dbLatencyMs,
        },
      },
    };
  }

  async getMetrics() {
    const [
      usersTotal,
      activeUsers,
      appointmentsTotal,
      appointmentsCompleted,
      pendingOutbox,
      failedNotifications,
      auditLogsTotal,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { isActive: true, deletedAt: null } }),
      this.prisma.appointment.count(),
      this.prisma.appointment.count({ where: { status: AppointmentStatus.COMPLETED } }),
      this.prisma.outboxEvent.count({ where: { status: OutboxStatus.PENDING } }),
      this.prisma.notificationLog.count({ where: { status: NotificationStatus.FAILED } }),
      this.prisma.auditLog.count(),
    ]);

    return {
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      counters: {
        usersTotal,
        activeUsers,
        appointmentsTotal,
        appointmentsCompleted,
        pendingOutbox,
        failedNotifications,
        auditLogsTotal,
      },
    };
  }
}
