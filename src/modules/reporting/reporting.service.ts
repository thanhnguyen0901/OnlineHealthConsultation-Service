import { BadRequestException, Injectable } from '@nestjs/common';
import { AppointmentStatus, Role } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';
import { ReportQueryDto, TrendGroupBy } from './dto/report-query.dto';

type TimeRange = {
  from?: Date;
  to?: Date;
};

@Injectable()
export class ReportingService {
  constructor(private readonly prisma: PrismaService) {}

  private parseTimeRange(query: ReportQueryDto): TimeRange {
    const from = query.from ? new Date(query.from) : undefined;
    const to = query.to ? new Date(query.to) : undefined;

    if (from && Number.isNaN(from.getTime())) {
      throw new BadRequestException('Invalid from datetime');
    }
    if (to && Number.isNaN(to.getTime())) {
      throw new BadRequestException('Invalid to datetime');
    }
    if (from && to && from > to) {
      throw new BadRequestException('from must be earlier than to');
    }

    return { from, to };
  }

  private buildDateFilter(range: TimeRange) {
    if (!range.from && !range.to) {
      return undefined;
    }

    return {
      gte: range.from,
      lte: range.to,
    };
  }

  async getDashboard(query: ReportQueryDto) {
    const range = this.parseTimeRange(query);
    const dateFilter = this.buildDateFilter(range);

    const [
      totalConsultations,
      totalAppointments,
      totalActiveUsers,
      totalActiveDoctors,
      totalActivePatients,
      appointmentsByStatus,
    ] = await Promise.all([
      this.prisma.appointment.count({
        where: {
          status: AppointmentStatus.COMPLETED,
          scheduledAt: dateFilter,
        },
      }),
      this.prisma.appointment.count({
        where: {
          scheduledAt: dateFilter,
        },
      }),
      this.prisma.user.count({
        where: {
          isActive: true,
          deletedAt: null,
        },
      }),
      this.prisma.doctorProfile.count({ where: { isActive: true } }),
      this.prisma.user.count({
        where: {
          role: Role.PATIENT,
          isActive: true,
          deletedAt: null,
        },
      }),
      this.prisma.appointment.groupBy({
        by: ['status'],
        where: {
          scheduledAt: dateFilter,
        },
        _count: {
          _all: true,
        },
      }),
    ]);

    return {
      totalConsultations,
      totalAppointments,
      totalActiveUsers,
      totalActiveDoctors,
      totalActivePatients,
      appointmentsByStatus: appointmentsByStatus.map((item) => ({
        status: item.status,
        count: item._count._all,
      })),
      range: {
        from: range.from?.toISOString() ?? null,
        to: range.to?.toISOString() ?? null,
      },
    };
  }

  async getConsultationTrend(query: ReportQueryDto) {
    const range = this.parseTimeRange(query);
    const groupBy: TrendGroupBy = query.groupBy ?? 'day';
    const dateFilter = this.buildDateFilter(range);

    const appointments = await this.prisma.appointment.findMany({
      where: {
        status: AppointmentStatus.COMPLETED,
        scheduledAt: dateFilter,
      },
      select: {
        scheduledAt: true,
      },
      orderBy: { scheduledAt: 'asc' },
    });

    const bucketMap = new Map<string, number>();
    for (const appointment of appointments) {
      const key = this.toBucketKey(appointment.scheduledAt, groupBy);
      bucketMap.set(key, (bucketMap.get(key) ?? 0) + 1);
    }

    return {
      groupBy,
      range: {
        from: range.from?.toISOString() ?? null,
        to: range.to?.toISOString() ?? null,
      },
      points: Array.from(bucketMap.entries()).map(([bucket, count]) => ({
        bucket,
        count,
      })),
    };
  }

  private toBucketKey(date: Date, groupBy: TrendGroupBy): string {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');

    if (groupBy === 'day') {
      return `${year}-${month}-${day}`;
    }

    if (groupBy === 'month') {
      return `${year}-${month}`;
    }

    const janFirst = new Date(Date.UTC(year, 0, 1));
    const diffDays = Math.floor((date.getTime() - janFirst.getTime()) / (24 * 60 * 60 * 1000));
    const week = Math.floor(diffDays / 7) + 1;
    return `${year}-W${String(week).padStart(2, '0')}`;
  }
}
