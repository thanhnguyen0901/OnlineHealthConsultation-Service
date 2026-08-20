import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';

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

  private buildConsultationDateWhere(range: TimeRange): Prisma.ConsultationSessionWhereInput {
    const dateFilter = this.buildDateFilter(range);
    if (!dateFilter) return {};

    return {
      OR: [
        { startedAt: dateFilter },
        {
          startedAt: null,
          createdAt: dateFilter,
        },
      ],
    };
  }

  async getDashboard(query: ReportQueryDto) {
    const range = this.parseTimeRange(query);
    const appointmentDateFilter = this.buildDateFilter(range);
    const consultationWhere = this.buildConsultationDateWhere(range);

    const [
      totalConsultations,
      consultationsByStatus,
      totalAppointments,
      totalUsers,
      totalActiveUsers,
      totalDoctors,
      totalActiveDoctors,
      totalPatients,
      totalActivePatients,
      totalSpecialties,
      totalQuestions,
      pendingQuestions,
      answeredQuestions,
      totalRatings,
      appointmentsByStatus,
    ] = await Promise.all([
      this.prisma.consultationSession.count({ where: consultationWhere }),
      this.prisma.consultationSession.groupBy({
        by: ['status'],
        where: consultationWhere,
        _count: {
          _all: true,
        },
      }),
      this.prisma.appointment.count({
        where: {
          scheduledAt: appointmentDateFilter,
        },
      }),
      this.prisma.user.count({ where: { deletedAt: null } }),
      this.prisma.user.count({
        where: {
          isActive: true,
          deletedAt: null,
        },
      }),
      this.prisma.user.count({
        where: {
          role: Role.DOCTOR,
          deletedAt: null,
        },
      }),
      this.prisma.doctorProfile.count({ where: { isActive: true } }),
      this.prisma.user.count({
        where: {
          role: Role.PATIENT,
          deletedAt: null,
        },
      }),
      this.prisma.user.count({
        where: {
          role: Role.PATIENT,
          isActive: true,
          deletedAt: null,
        },
      }),
      this.prisma.specialty.count(),
      this.prisma.question.count(),
      this.prisma.question.count({ where: { status: 'PENDING' } }),
      this.prisma.question.count({ where: { status: 'ANSWERED' } }),
      this.prisma.rating.count(),
      this.prisma.appointment.groupBy({
        by: ['status'],
        where: {
          scheduledAt: appointmentDateFilter,
        },
        _count: {
          _all: true,
        },
      }),
    ]);

    return {
      totalConsultations,
      consultationsByStatus: consultationsByStatus.map((item) => ({
        status: item.status,
        count: item._count._all,
      })),
      totalAppointments,
      totalUsers,
      totalActiveUsers,
      totalDoctors,
      totalActiveDoctors,
      totalPatients,
      totalActivePatients,
      totalSpecialties,
      totalQuestions,
      pendingQuestions,
      answeredQuestions,
      totalRatings,
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
    const consultationWhere = this.buildConsultationDateWhere(range);

    const consultations = await this.prisma.consultationSession.findMany({
      where: consultationWhere,
      select: {
        startedAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    const bucketMap = new Map<string, number>();
    for (const consultation of consultations) {
      const key = this.toBucketKey(consultation.startedAt ?? consultation.createdAt, groupBy);
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
