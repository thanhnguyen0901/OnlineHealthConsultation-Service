import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  AppointmentStatus,
  NotificationStatus,
  NotificationType,
  Prisma,
  Role,
} from '@prisma/client';
import { uuidv7 } from 'uuidv7';

import { PrismaService } from '../../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { ListAppointmentQueryDto } from './dto/list-appointment-query.dto';
import { DoctorAvailabilityQueryDto } from './dto/doctor-availability-query.dto';

const CONFLICT_STATUSES: AppointmentStatus[] = [
  AppointmentStatus.PENDING_CONFIRMATION,
  AppointmentStatus.CONFIRMED,
];

type WorkingInterval = {
  start: Date;
  end: Date;
};

type AppointmentInterval = {
  id?: string;
  scheduledAt: Date;
  durationMinutes: number;
};

type PrismaClientOrTransaction = PrismaService | Prisma.TransactionClient;

@Injectable()
export class AppointmentService {
  constructor(private readonly prisma: PrismaService) {}

  private getAppTimeZone() {
    return process.env.APP_TIMEZONE ?? 'Asia/Ho_Chi_Minh';
  }

  private getDefaultDuration(durationMinutes?: number) {
    const duration =
      durationMinutes ?? parseInt(process.env.APPOINTMENT_DURATION_MINUTES ?? '60', 10);
    if (!Number.isFinite(duration) || duration < 15 || duration > 240) {
      throw new BadRequestException('Invalid appointment duration');
    }
    return duration;
  }

  private getSlotStepMinutes() {
    const step = parseInt(process.env.APPOINTMENT_SLOT_STEP_MINUTES ?? '30', 10);
    return Number.isFinite(step) && step > 0 ? step : 30;
  }

  private assertValidDateKey(date: string) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new BadRequestException('Invalid availability date');
    }
    const parsed = new Date(`${date}T00:00:00.000Z`);
    if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) {
      throw new BadRequestException('Invalid availability date');
    }
  }

  private parseTimeToMinutes(value: string) {
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) {
      return null;
    }
    const [hours, minutes] = value.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private getZonedDateKey(date: Date, timeZone = this.getAppTimeZone()) {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(date);
    const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
    return `${values.year}-${values.month}-${values.day}`;
  }

  private formatZonedTime(date: Date, timeZone = this.getAppTimeZone()) {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone,
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    }).formatToParts(date);
    const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
    return `${values.hour}:${values.minute}`;
  }

  private nextDateKey(date: string) {
    const next = new Date(`${date}T00:00:00.000Z`);
    next.setUTCDate(next.getUTCDate() + 1);
    return next.toISOString().slice(0, 10);
  }

  private localDateTimeToUtc(date: string, minutesOfDay: number, timeZone = this.getAppTimeZone()) {
    const [year, month, day] = date.split('-').map(Number);
    const hours = Math.floor(minutesOfDay / 60);
    const minutes = minutesOfDay % 60;

    if (timeZone === 'Asia/Ho_Chi_Minh') {
      return new Date(Date.UTC(year, month - 1, day, hours - 7, minutes, 0, 0));
    }
    if (timeZone === 'UTC') {
      return new Date(Date.UTC(year, month - 1, day, hours, minutes, 0, 0));
    }

    let candidate = new Date(Date.UTC(year, month - 1, day, hours, minutes, 0, 0));
    for (let attempt = 0; attempt < 2; attempt += 1) {
      const zonedDate = this.getZonedDateKey(candidate, timeZone);
      const zonedMinutes = this.parseTimeToMinutes(this.formatZonedTime(candidate, timeZone));
      if (zonedMinutes === null) {
        break;
      }
      const dayDiff =
        (new Date(`${date}T00:00:00.000Z`).getTime() -
          new Date(`${zonedDate}T00:00:00.000Z`).getTime()) /
        (24 * 60 * 60 * 1000);
      const minuteDiff = dayDiff * 24 * 60 + (minutesOfDay - zonedMinutes);
      if (minuteDiff === 0) {
        return candidate;
      }
      candidate = new Date(candidate.getTime() + minuteDiff * 60 * 1000);
    }
    return candidate;
  }

  private normalizeWorkingIntervals(schedule: Prisma.JsonValue | null | undefined, date: string) {
    this.assertValidDateKey(date);
    if (!Array.isArray(schedule)) {
      return [];
    }

    const intervals = schedule
      .map((slot) => {
        if (
          !slot ||
          typeof slot !== 'object' ||
          Array.isArray(slot) ||
          typeof slot?.date !== 'string' ||
          typeof slot.startTime !== 'string' ||
          typeof slot.endTime !== 'string' ||
          slot.date !== date ||
          slot.available === false
        ) {
          return null;
        }

        const startMinutes = this.parseTimeToMinutes(slot.startTime);
        const endMinutes = this.parseTimeToMinutes(slot.endTime);
        if (startMinutes === null || endMinutes === null || endMinutes <= startMinutes) {
          return null;
        }

        return {
          start: this.localDateTimeToUtc(date, startMinutes),
          end: this.localDateTimeToUtc(date, endMinutes),
        };
      })
      .filter((interval): interval is WorkingInterval => Boolean(interval))
      .sort((left, right) => left.start.getTime() - right.start.getTime());

    return intervals.reduce<WorkingInterval[]>((merged, interval) => {
      const last = merged[merged.length - 1];
      if (!last || interval.start > last.end) {
        merged.push({ ...interval });
        return merged;
      }
      if (interval.end > last.end) {
        last.end = interval.end;
      }
      return merged;
    }, []);
  }

  private overlaps(start: Date, end: Date, existing: AppointmentInterval) {
    const existingStart = existing.scheduledAt;
    const existingEnd = new Date(
      existingStart.getTime() + existing.durationMinutes * 60 * 1000,
    );
    return start < existingEnd && end > existingStart;
  }

  private buildCandidateSlots(
    intervals: WorkingInterval[],
    durationMinutes: number,
    slotStepMinutes: number,
  ) {
    const durationMs = durationMinutes * 60 * 1000;
    const stepMs = slotStepMinutes * 60 * 1000;
    const now = new Date();
    const slots: { start: Date; end: Date }[] = [];

    for (const interval of intervals) {
      for (
        let startMs = interval.start.getTime();
        startMs + durationMs <= interval.end.getTime();
        startMs += stepMs
      ) {
        const start = new Date(startMs);
        if (start <= now) {
          continue;
        }
        slots.push({
          start,
          end: new Date(startMs + durationMs),
        });
      }
    }

    return slots;
  }

  private assertInsideWorkingSchedule(
    schedule: Prisma.JsonValue | null | undefined,
    start: Date,
    durationMinutes: number,
  ) {
    const date = this.getZonedDateKey(start);
    const end = new Date(start.getTime() + durationMinutes * 60 * 1000);
    const intervals = this.normalizeWorkingIntervals(schedule, date);
    const insideSchedule = intervals.some(
      (interval) => start >= interval.start && end <= interval.end,
    );

    if (!insideSchedule) {
      throw new BadRequestException('Doctor is not available at this time');
    }
  }

  private async findConflictingAppointments(
    client: PrismaClientOrTransaction,
    input: {
      doctorId?: string;
      patientId?: string;
      start: Date;
      end: Date;
      excludeAppointmentId?: string;
    },
  ) {
    const windowStart = new Date(input.start.getTime() - 24 * 60 * 60 * 1000);
    const windowEnd = new Date(input.end.getTime() + 24 * 60 * 60 * 1000);

    return client.appointment.findMany({
      where: {
        ...(input.excludeAppointmentId ? { id: { not: input.excludeAppointmentId } } : {}),
        ...(input.doctorId ? { doctorId: input.doctorId } : {}),
        ...(input.patientId ? { patientId: input.patientId } : {}),
        status: { in: CONFLICT_STATUSES },
        scheduledAt: { gte: windowStart, lte: windowEnd },
      },
      select: {
        id: true,
        scheduledAt: true,
        durationMinutes: true,
      },
    });
  }

  private async assertNoAppointmentOverlap(
    client: PrismaClientOrTransaction,
    input: {
      doctorId: string;
      patientId: string;
      start: Date;
      durationMinutes: number;
      excludeAppointmentId?: string;
    },
  ) {
    const end = new Date(input.start.getTime() + input.durationMinutes * 60 * 1000);
    const [doctorConflicts, patientConflicts] = await Promise.all([
      this.findConflictingAppointments(client, {
        doctorId: input.doctorId,
        start: input.start,
        end,
        excludeAppointmentId: input.excludeAppointmentId,
      }),
      this.findConflictingAppointments(client, {
        patientId: input.patientId,
        start: input.start,
        end,
        excludeAppointmentId: input.excludeAppointmentId,
      }),
    ]);

    if (doctorConflicts.some((appointment) => this.overlaps(input.start, end, appointment))) {
      throw new BadRequestException('Doctor already has an appointment at this time');
    }

    if (patientConflicts.some((appointment) => this.overlaps(input.start, end, appointment))) {
      throw new BadRequestException('Patient already has an appointment at this time');
    }
  }

  private assertBookableDoctor(doctor: {
    isActive: boolean;
    approvalStatus: string;
    user: { isActive: boolean; deletedAt?: Date | null };
  }) {
    if (!doctor.isActive || doctor.approvalStatus !== 'APPROVED' || !doctor.user.isActive || doctor.user.deletedAt) {
      throw new BadRequestException('Doctor is not available for booking');
    }
  }

  async getDoctorAvailability(doctorId: string, query: DoctorAvailabilityQueryDto) {
    this.assertValidDateKey(query.date);
    const durationMinutes = this.getDefaultDuration(query.durationMinutes);
    const slotStepMinutes = this.getSlotStepMinutes();

    const doctor = await this.prisma.doctorProfile.findFirst({
      where: {
        id: doctorId,
        isActive: true,
        approvalStatus: 'APPROVED',
        user: {
          isActive: true,
          deletedAt: null,
        },
      },
      include: {
        user: {
          select: {
            isActive: true,
            deletedAt: true,
          },
        },
      },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found or not publicly available');
    }

    const intervals = this.normalizeWorkingIntervals(doctor.schedule, query.date);
    const candidates = this.buildCandidateSlots(intervals, durationMinutes, slotStepMinutes);
    const dayStart = this.localDateTimeToUtc(query.date, 0);
    const nextDayStart = this.localDateTimeToUtc(this.nextDateKey(query.date), 0);
    const availabilityWindowStart = new Date(dayStart.getTime() - 24 * 60 * 60 * 1000);
    const availabilityWindowEnd = new Date(nextDayStart.getTime() + 24 * 60 * 60 * 1000);
    const appointments = await this.prisma.appointment.findMany({
      where: {
        doctorId,
        status: { in: CONFLICT_STATUSES },
        scheduledAt: { gte: availabilityWindowStart, lt: availabilityWindowEnd },
      },
      select: {
        id: true,
        scheduledAt: true,
        durationMinutes: true,
      },
    });

    return {
      doctorId,
      date: query.date,
      timezone: this.getAppTimeZone(),
      durationMinutes,
      slotStepMinutes,
      slots: candidates
        .filter((slot) => !appointments.some((appointment) => this.overlaps(slot.start, slot.end, appointment)))
        .map((slot) => ({
          start: slot.start.toISOString(),
          end: slot.end.toISOString(),
          label: this.formatZonedTime(slot.start),
          available: true,
        })),
    };
  }

  private buildAppointmentFilters(query?: ListAppointmentQueryDto): Prisma.AppointmentWhereInput {
    const scheduledAt: Prisma.DateTimeFilter = {};

    if (query?.fromDate) {
      scheduledAt.gte = new Date(query.fromDate);
    }

    if (query?.toDate) {
      scheduledAt.lte = new Date(query.toDate);
    }

    return {
      ...(query?.status ? { status: query.status } : {}),
      ...(Object.keys(scheduledAt).length > 0 ? { scheduledAt } : {}),
    };
  }

  private getAppointmentDetailInclude() {
    return {
      patient: {
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              role: true,
              isActive: true,
            },
          },
        },
      },
      doctor: {
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              role: true,
              isActive: true,
            },
          },
          specialties: {
            include: {
              specialty: {
                select: {
                  id: true,
                  nameEn: true,
                  nameVi: true,
                },
              },
            },
          },
        },
      },
      session: {
        select: {
          id: true,
          status: true,
          startedAt: true,
          endedAt: true,
          summary: true,
          channel: true,
        },
      },
      rating: true,
    } satisfies Prisma.AppointmentInclude;
  }

  async createAppointment(userId: string, dto: CreateAppointmentDto) {
    const patient = await this.prisma.patientProfile.findUnique({ where: { userId } });
    if (!patient) {
      throw new NotFoundException('Patient profile not found');
    }

    const doctor = await this.prisma.doctorProfile.findUnique({
      where: { id: dto.doctorId },
      include: { user: true },
    });

    if (!doctor || !doctor.isActive || doctor.approvalStatus !== 'APPROVED' || !doctor.user.isActive) {
      throw new BadRequestException('Doctor is not available for booking');
    }

    const start = new Date(dto.scheduledAt);
    if (Number.isNaN(start.getTime())) {
      throw new BadRequestException('Invalid appointment time');
    }

    if (start <= new Date()) {
      throw new BadRequestException('Appointment time must be in the future');
    }

    const duration = this.getDefaultDuration(dto.durationMinutes);

    return this.prisma.$transaction(async (tx) => {
      const latestDoctor = await tx.doctorProfile.findUnique({
        where: { id: doctor.id },
        include: { user: { select: { isActive: true, deletedAt: true } } },
      });
      if (!latestDoctor) {
        throw new BadRequestException('Doctor is not available for booking');
      }
      this.assertBookableDoctor(latestDoctor);
      this.assertInsideWorkingSchedule(latestDoctor.schedule, start, duration);
      await this.assertNoAppointmentOverlap(tx, {
        doctorId: doctor.id,
        patientId: patient.id,
        start,
        durationMinutes: duration,
      });

      const appointment = await tx.appointment.create({
        data: {
          id: uuidv7(),
          patientId: patient.id,
          doctorId: doctor.id,
          scheduledAt: start,
          durationMinutes: duration,
          status: AppointmentStatus.PENDING_CONFIRMATION,
          reason: dto.reason,
          notes: dto.notes,
        },
      });

      await tx.outboxEvent.create({
        data: {
          id: uuidv7(),
          aggregateType: 'APPOINTMENT',
          aggregateId: appointment.id,
          eventType: 'APPOINTMENT_CREATED',
          payload: {
            appointmentId: appointment.id,
            patientId: patient.id,
            doctorId: doctor.id,
          },
        },
      });

      await tx.auditLog.create({
        data: {
          id: uuidv7(),
          actorUserId: userId,
          action: 'APPOINTMENT_CREATED',
          resource: 'APPOINTMENT',
          resourceId: appointment.id,
          metadata: {
            doctorId: doctor.id,
            patientId: patient.id,
            scheduledAt: start.toISOString(),
          },
        },
      });

      return appointment;
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
  }

  async listMyAppointments(userId: string, query?: ListAppointmentQueryDto) {
    const patient = await this.prisma.patientProfile.findUnique({ where: { userId } });
    if (!patient) {
      throw new NotFoundException('Patient profile not found');
    }

    return this.prisma.appointment.findMany({
      where: {
        patientId: patient.id,
        ...this.buildAppointmentFilters(query),
      },
      orderBy: { scheduledAt: 'desc' },
      include: {
        doctor: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
            specialties: {
              include: {
                specialty: {
                  select: {
                    id: true,
                    nameEn: true,
                    nameVi: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async cancelAppointment(userId: string, appointmentId: string) {
    const patient = await this.prisma.patientProfile.findUnique({ where: { userId } });
    if (!patient) {
      throw new NotFoundException('Patient profile not found');
    }

    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        patient: true,
      },
    });
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (appointment.patientId !== patient.id) {
      throw new ForbiddenException('Cannot cancel appointment of another patient');
    }

    if (
      appointment.status === AppointmentStatus.CANCELLED ||
      appointment.status === AppointmentStatus.COMPLETED
    ) {
      throw new BadRequestException('Appointment cannot be cancelled in current status');
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.appointment.update({
        where: { id: appointmentId },
        data: { status: AppointmentStatus.CANCELLED },
      });

      await tx.auditLog.create({
        data: {
          id: uuidv7(),
          actorUserId: userId,
          action: 'APPOINTMENT_CANCELLED_BY_PATIENT',
          resource: 'APPOINTMENT',
          resourceId: appointmentId,
        },
      });

      return updated;
    });
  }

  async listDoctorAppointments(userId: string, query?: ListAppointmentQueryDto) {
    const doctor = await this.prisma.doctorProfile.findUnique({ where: { userId } });
    if (!doctor) {
      throw new NotFoundException('Doctor profile not found');
    }

    return this.prisma.appointment.findMany({
      where: {
        doctorId: doctor.id,
        ...this.buildAppointmentFilters(query),
      },
      orderBy: { scheduledAt: 'desc' },
      include: {
        patient: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        doctor: {
          include: {
            specialties: {
              include: {
                specialty: {
                  select: {
                    id: true,
                    nameEn: true,
                    nameVi: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async getAppointmentDetail(userId: string, role: Role, appointmentId: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: this.getAppointmentDetailInclude(),
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (role === Role.PATIENT) {
      const patient = await this.prisma.patientProfile.findUnique({ where: { userId } });
      if (!patient || appointment.patientId !== patient.id) {
        throw new ForbiddenException('Cannot view appointment of another patient');
      }
    }

    if (role === Role.DOCTOR) {
      const doctor = await this.prisma.doctorProfile.findUnique({ where: { userId } });
      if (!doctor || appointment.doctorId !== doctor.id) {
        throw new ForbiddenException('Cannot view appointment of another doctor');
      }
    }

    return appointment;
  }

  async confirmAppointment(userId: string, appointmentId: string) {
    const doctor = await this.prisma.doctorProfile.findUnique({ where: { userId } });
    if (!doctor) {
      throw new NotFoundException('Doctor profile not found');
    }

    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        patient: true,
      },
    });
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (appointment.doctorId !== doctor.id) {
      throw new ForbiddenException('Cannot confirm appointment of another doctor');
    }

    if (appointment.status !== AppointmentStatus.PENDING_CONFIRMATION) {
      throw new BadRequestException('Appointment is not in pending confirmation status');
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.appointment.update({
        where: { id: appointmentId },
        data: { status: AppointmentStatus.CONFIRMED },
      });

      await tx.outboxEvent.create({
        data: {
          id: uuidv7(),
          aggregateType: 'APPOINTMENT',
          aggregateId: appointment.id,
          eventType: 'APPOINTMENT_CONFIRMED',
          payload: {
            appointmentId: appointment.id,
            patientId: appointment.patientId,
            doctorId: appointment.doctorId,
            scheduledAt: appointment.scheduledAt.toISOString(),
          },
        },
      });

      await tx.auditLog.create({
        data: {
          id: uuidv7(),
          actorUserId: userId,
          action: 'APPOINTMENT_CONFIRMED_BY_DOCTOR',
          resource: 'APPOINTMENT',
          resourceId: appointmentId,
        },
      });

      return updated;
    });
  }

  async completeAppointment(userId: string, appointmentId: string) {
    const doctor = await this.prisma.doctorProfile.findUnique({ where: { userId } });
    if (!doctor) {
      throw new NotFoundException('Doctor profile not found');
    }

    const appointment = await this.prisma.appointment.findUnique({ where: { id: appointmentId } });
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (appointment.doctorId !== doctor.id) {
      throw new ForbiddenException('Cannot complete appointment of another doctor');
    }

    if (appointment.status !== AppointmentStatus.CONFIRMED) {
      throw new BadRequestException('Appointment is not in confirmed status');
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.appointment.update({
        where: { id: appointmentId },
        data: { status: AppointmentStatus.COMPLETED },
      });

      await tx.auditLog.create({
        data: {
          id: uuidv7(),
          actorUserId: userId,
          action: 'APPOINTMENT_COMPLETED_BY_DOCTOR',
          resource: 'APPOINTMENT',
          resourceId: appointmentId,
        },
      });

      return updated;
    });
  }

  async rescheduleAppointment(userId: string, appointmentId: string, scheduledAt: string) {
    const doctor = await this.prisma.doctorProfile.findUnique({
      where: { userId },
      include: { user: { select: { isActive: true, deletedAt: true } } },
    });
    if (!doctor) {
      throw new NotFoundException('Doctor profile not found');
    }

    const appointment = await this.prisma.appointment.findUnique({ where: { id: appointmentId } });
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (appointment.doctorId !== doctor.id) {
      throw new ForbiddenException('Cannot reschedule appointment of another doctor');
    }

    if (
      appointment.status !== AppointmentStatus.PENDING_CONFIRMATION &&
      appointment.status !== AppointmentStatus.CONFIRMED
    ) {
      throw new BadRequestException('Appointment cannot be rescheduled in current status');
    }

    const start = new Date(scheduledAt);
    if (Number.isNaN(start.getTime()) || start <= new Date()) {
      throw new BadRequestException('New appointment time must be in the future');
    }

    const durationMinutes = appointment.durationMinutes;

    return this.prisma.$transaction(async (tx) => {
      const latestDoctor = await tx.doctorProfile.findUnique({
        where: { id: doctor.id },
        include: { user: { select: { isActive: true, deletedAt: true } } },
      });
      if (!latestDoctor) {
        throw new BadRequestException('Doctor is not available for booking');
      }
      this.assertBookableDoctor(latestDoctor);
      this.assertInsideWorkingSchedule(latestDoctor.schedule, start, durationMinutes);
      await this.assertNoAppointmentOverlap(tx, {
        doctorId: doctor.id,
        patientId: appointment.patientId,
        start,
        durationMinutes,
        excludeAppointmentId: appointment.id,
      });

      const updated = await tx.appointment.update({
        where: { id: appointmentId },
        data: { scheduledAt: start },
        include: this.getAppointmentDetailInclude(),
      });

      await tx.auditLog.create({
        data: {
          id: uuidv7(),
          actorUserId: userId,
          action: 'APPOINTMENT_RESCHEDULED_BY_DOCTOR',
          resource: 'APPOINTMENT',
          resourceId: appointmentId,
          metadata: {
            previousScheduledAt: appointment.scheduledAt.toISOString(),
            nextScheduledAt: start.toISOString(),
          },
        },
      });

      await tx.outboxEvent.create({
        data: {
          id: uuidv7(),
          aggregateType: 'APPOINTMENT',
          aggregateId: appointment.id,
          eventType: 'APPOINTMENT_RESCHEDULED',
          payload: {
            appointmentId: appointment.id,
            patientId: appointment.patientId,
            doctorId: appointment.doctorId,
            previousScheduledAt: appointment.scheduledAt.toISOString(),
            scheduledAt: start.toISOString(),
          },
        },
      });

      return updated;
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
  }

  listAllAppointments(query?: ListAppointmentQueryDto) {
    return this.prisma.appointment.findMany({
      where: this.buildAppointmentFilters(query),
      orderBy: { scheduledAt: 'desc' },
      include: {
        patient: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        doctor: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });
  }

  async adminUpdateAppointmentStatus(
    adminUserId: string,
    appointmentId: string,
    status: AppointmentStatus,
  ) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        patient: true,
        doctor: true,
      },
    });
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.appointment.update({
        where: { id: appointmentId },
        data: { status },
      });

      await tx.auditLog.create({
        data: {
          id: uuidv7(),
          actorUserId: adminUserId,
          action: 'APPOINTMENT_STATUS_UPDATED_BY_ADMIN',
          resource: 'APPOINTMENT',
          resourceId: appointmentId,
          metadata: {
            previousStatus: appointment.status,
            nextStatus: status,
          },
        },
      });

      await tx.notificationLog.createMany({
        data: [
          {
            id: uuidv7(),
            userId: appointment.patient.userId,
            type: NotificationType.EMAIL,
            content: `Appointment status changed to ${status}.`,
            status: NotificationStatus.SENT,
            provider: 'IN_APP',
          },
          {
            id: uuidv7(),
            userId: appointment.doctor.userId,
            type: NotificationType.EMAIL,
            content: `Appointment status changed to ${status}.`,
            status: NotificationStatus.SENT,
            provider: 'IN_APP',
          },
        ],
      });
      return updated;
    });
  }
}
