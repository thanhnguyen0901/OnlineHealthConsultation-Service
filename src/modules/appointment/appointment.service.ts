import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AppointmentStatus, Prisma } from '@prisma/client';
import { uuidv7 } from 'uuidv7';

import { PrismaService } from '../../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

const CONFLICT_STATUSES: AppointmentStatus[] = [
  AppointmentStatus.PENDING_CONFIRMATION,
  AppointmentStatus.CONFIRMED,
];

@Injectable()
export class AppointmentService {
  constructor(private readonly prisma: PrismaService) {}

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

    const duration = dto.durationMinutes ?? parseInt(process.env.APPOINTMENT_DURATION_MINUTES ?? '60', 10);
    const end = new Date(start.getTime() + duration * 60 * 1000);

    return this.prisma.$transaction(async (tx) => {
      const doctorConflicts = await tx.appointment.findMany({
        where: {
          doctorId: doctor.id,
          status: { in: CONFLICT_STATUSES },
        },
        select: {
          id: true,
          scheduledAt: true,
          durationMinutes: true,
        },
      });

      const patientConflicts = await tx.appointment.findMany({
        where: {
          patientId: patient.id,
          status: { in: CONFLICT_STATUSES },
        },
        select: {
          id: true,
          scheduledAt: true,
          durationMinutes: true,
        },
      });

      const hasOverlap = (items: { scheduledAt: Date; durationMinutes: number }[]) =>
        items.some((item) => {
          const existingStart = item.scheduledAt;
          const existingEnd = new Date(existingStart.getTime() + item.durationMinutes * 60 * 1000);
          return start < existingEnd && end > existingStart;
        });

      if (hasOverlap(doctorConflicts)) {
        throw new BadRequestException('Doctor already has an appointment in this time slot');
      }

      if (hasOverlap(patientConflicts)) {
        throw new BadRequestException('Patient already has an appointment in this time slot');
      }

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

      return appointment;
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
  }

  async listMyAppointments(userId: string) {
    const patient = await this.prisma.patientProfile.findUnique({ where: { userId } });
    if (!patient) {
      throw new NotFoundException('Patient profile not found');
    }

    return this.prisma.appointment.findMany({
      where: { patientId: patient.id },
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

    const appointment = await this.prisma.appointment.findUnique({ where: { id: appointmentId } });
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

    return this.prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: AppointmentStatus.CANCELLED },
    });
  }

  async listDoctorAppointments(userId: string) {
    const doctor = await this.prisma.doctorProfile.findUnique({ where: { userId } });
    if (!doctor) {
      throw new NotFoundException('Doctor profile not found');
    }

    return this.prisma.appointment.findMany({
      where: { doctorId: doctor.id },
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
      },
    });
  }

  async confirmAppointment(userId: string, appointmentId: string) {
    const doctor = await this.prisma.doctorProfile.findUnique({ where: { userId } });
    if (!doctor) {
      throw new NotFoundException('Doctor profile not found');
    }

    const appointment = await this.prisma.appointment.findUnique({ where: { id: appointmentId } });
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (appointment.doctorId !== doctor.id) {
      throw new ForbiddenException('Cannot confirm appointment of another doctor');
    }

    if (appointment.status !== AppointmentStatus.PENDING_CONFIRMATION) {
      throw new BadRequestException('Appointment is not in pending confirmation status');
    }

    return this.prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: AppointmentStatus.CONFIRMED },
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

    return this.prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: AppointmentStatus.COMPLETED },
    });
  }

  listAllAppointments() {
    return this.prisma.appointment.findMany({
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
}
