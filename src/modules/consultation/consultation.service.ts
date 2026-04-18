import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  AppointmentStatus,
  ConsultationStatus,
  RatingStatus,
  Role,
} from '@prisma/client';
import { uuidv7 } from 'uuidv7';

import { PrismaService } from '../../prisma/prisma.service';
import { UpdateConsultationSummaryDto } from './dto/update-consultation-summary.dto';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { CreateRatingDto } from './dto/create-rating.dto';
import { ModerateRatingDto } from './dto/moderate-rating.dto';
import { StartSessionDto } from './dto/start-session.dto';

const STARTABLE_APPOINTMENT_STATUSES: AppointmentStatus[] = [
  AppointmentStatus.CONFIRMED,
  AppointmentStatus.PENDING_CONFIRMATION,
];

@Injectable()
export class ConsultationService {
  constructor(private readonly prisma: PrismaService) {}

  private async getAppointmentOrThrow(appointmentId: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        patient: true,
        doctor: true,
        session: true,
      },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    return appointment;
  }

  async startSession(userId: string, appointmentId: string, dto?: StartSessionDto) {
    const doctor = await this.prisma.doctorProfile.findUnique({ where: { userId } });
    if (!doctor) {
      throw new NotFoundException('Doctor profile not found');
    }

    const appointment = await this.getAppointmentOrThrow(appointmentId);

    if (appointment.doctorId !== doctor.id) {
      throw new ForbiddenException('Cannot start consultation for another doctor');
    }

    if (!STARTABLE_APPOINTMENT_STATUSES.includes(appointment.status)) {
      throw new BadRequestException('Appointment is not in a startable status');
    }

    const requestedChannel = dto?.channel ?? 'CHAT';
    const videoProviderEnabled = process.env.VIDEO_PROVIDER_ENABLED === 'true';
    const channel = requestedChannel === 'VIDEO' && videoProviderEnabled ? 'VIDEO' : 'CHAT';
    const fallbackToChat = requestedChannel === 'VIDEO' && channel === 'CHAT';
    const now = new Date();

    return this.prisma.$transaction(async (tx) => {
      if (appointment.status === AppointmentStatus.PENDING_CONFIRMATION) {
        await tx.appointment.update({
          where: { id: appointment.id },
          data: { status: AppointmentStatus.CONFIRMED },
        });
      }

      if (!appointment.session) {
        const session = await tx.consultationSession.create({
          data: {
            id: uuidv7(),
            appointmentId: appointment.id,
            status: ConsultationStatus.ONGOING,
            startedAt: now,
            channel,
          },
        });

        return {
          ...session,
          requestedChannel,
          fallbackToChat,
        };
      }

      const session = await tx.consultationSession.update({
        where: { appointmentId: appointment.id },
        data: {
          status: ConsultationStatus.ONGOING,
          startedAt: appointment.session.startedAt ?? now,
          channel,
        },
      });

      return {
        ...session,
        requestedChannel,
        fallbackToChat,
      };
    });
  }

  async joinSession(userId: string, role: Role, appointmentId: string) {
    const appointment = await this.getAppointmentOrThrow(appointmentId);

    if (!appointment.session) {
      throw new BadRequestException('Consultation session has not been started');
    }

    if (role === Role.PATIENT) {
      const patient = await this.prisma.patientProfile.findUnique({ where: { userId } });
      if (!patient || appointment.patientId !== patient.id) {
        throw new ForbiddenException('Cannot join consultation of another patient');
      }
    }

    if (role === Role.DOCTOR) {
      const doctor = await this.prisma.doctorProfile.findUnique({ where: { userId } });
      if (!doctor || appointment.doctorId !== doctor.id) {
        throw new ForbiddenException('Cannot join consultation of another doctor');
      }
    }

    return {
      appointmentId,
      sessionId: appointment.session.id,
      status: appointment.session.status,
      channel: appointment.session.channel ?? 'CHAT',
      message: 'Joined consultation session',
    };
  }

  async endSession(userId: string, appointmentId: string) {
    const doctor = await this.prisma.doctorProfile.findUnique({ where: { userId } });
    if (!doctor) {
      throw new NotFoundException('Doctor profile not found');
    }

    const appointment = await this.getAppointmentOrThrow(appointmentId);
    if (!appointment.session) {
      throw new BadRequestException('Consultation session not found');
    }

    if (appointment.doctorId !== doctor.id) {
      throw new ForbiddenException('Cannot end consultation of another doctor');
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.consultationSession.update({
        where: { appointmentId },
        data: {
          status: ConsultationStatus.COMPLETED,
          endedAt: new Date(),
        },
      });

      await tx.appointment.update({
        where: { id: appointmentId },
        data: { status: AppointmentStatus.COMPLETED },
      });

      return tx.consultationSession.findUnique({ where: { appointmentId } });
    });
  }

  async updateSummary(userId: string, appointmentId: string, dto: UpdateConsultationSummaryDto) {
    const doctor = await this.prisma.doctorProfile.findUnique({ where: { userId } });
    if (!doctor) {
      throw new NotFoundException('Doctor profile not found');
    }

    const appointment = await this.getAppointmentOrThrow(appointmentId);
    if (!appointment.session) {
      throw new BadRequestException('Consultation session not found');
    }

    if (appointment.doctorId !== doctor.id) {
      throw new ForbiddenException('Cannot update summary of another doctor session');
    }

    return this.prisma.consultationSession.update({
      where: { appointmentId },
      data: {
        summary: dto.summary,
      },
    });
  }

  async createPrescription(userId: string, appointmentId: string, dto: CreatePrescriptionDto) {
    const doctor = await this.prisma.doctorProfile.findUnique({ where: { userId } });
    if (!doctor) {
      throw new NotFoundException('Doctor profile not found');
    }

    const appointment = await this.getAppointmentOrThrow(appointmentId);
    if (!appointment.session) {
      throw new BadRequestException('Consultation session not found');
    }

    if (appointment.doctorId !== doctor.id) {
      throw new ForbiddenException('Cannot create prescription for another doctor session');
    }

    if (appointment.status !== AppointmentStatus.COMPLETED) {
      throw new BadRequestException('Appointment must be completed before prescription');
    }

    return this.prisma.$transaction(async (tx) => {
      const prescription = await tx.prescription.upsert({
        where: { sessionId: appointment.session!.id },
        create: {
          id: uuidv7(),
          sessionId: appointment.session!.id,
          notes: dto.notes,
        },
        update: {
          notes: dto.notes,
        },
      });

      await tx.prescriptionItem.deleteMany({ where: { prescriptionId: prescription.id } });

      await tx.prescriptionItem.createMany({
        data: dto.items.map((item) => ({
          id: uuidv7(),
          prescriptionId: prescription.id,
          medicationName: item.medicationName,
          dosage: item.dosage,
          frequency: item.frequency,
          duration: item.duration,
          notes: item.notes,
        })),
      });

      return tx.prescription.findUnique({
        where: { id: prescription.id },
        include: {
          items: true,
        },
      });
    });
  }

  async createRating(userId: string, dto: CreateRatingDto) {
    const patient = await this.prisma.patientProfile.findUnique({ where: { userId } });
    if (!patient) {
      throw new NotFoundException('Patient profile not found');
    }

    const appointment = await this.prisma.appointment.findUnique({ where: { id: dto.appointmentId } });
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (appointment.patientId !== patient.id) {
      throw new ForbiddenException('Cannot rate another patient appointment');
    }

    if (appointment.status !== AppointmentStatus.COMPLETED) {
      throw new BadRequestException('Appointment must be completed before rating');
    }

    const existingRating = await this.prisma.rating.findUnique({
      where: { appointmentId: appointment.id },
      select: { id: true },
    });
    if (existingRating) {
      throw new BadRequestException('Rating already exists for this appointment');
    }

    return this.prisma.rating.create({
      data: {
        id: uuidv7(),
        patientId: patient.id,
        doctorId: appointment.doctorId,
        appointmentId: appointment.id,
        score: dto.score,
        comment: dto.comment,
        status: RatingStatus.VISIBLE,
      },
    });
  }

  async listMyRatings(userId: string) {
    const patient = await this.prisma.patientProfile.findUnique({ where: { userId } });
    if (!patient) {
      throw new NotFoundException('Patient profile not found');
    }

    return this.prisma.rating.findMany({
      where: { patientId: patient.id },
      orderBy: { createdAt: 'desc' },
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

  async listMyConsultations(userId: string) {
    const patient = await this.prisma.patientProfile.findUnique({ where: { userId } });
    if (!patient) {
      throw new NotFoundException('Patient profile not found');
    }

    return this.prisma.consultationSession.findMany({
      where: {
        appointment: {
          patientId: patient.id,
        },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        appointment: {
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
        },
        prescription: {
          include: {
            items: true,
          },
        },
      },
    });
  }

  async listDoctorConsultations(userId: string) {
    const doctor = await this.prisma.doctorProfile.findUnique({ where: { userId } });
    if (!doctor) {
      throw new NotFoundException('Doctor profile not found');
    }

    return this.prisma.consultationSession.findMany({
      where: {
        appointment: {
          doctorId: doctor.id,
        },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        appointment: {
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
        },
        prescription: {
          include: {
            items: true,
          },
        },
      },
    });
  }

  async moderateRating(userId: string, ratingId: string, dto: ModerateRatingDto) {
    const admin = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!admin) {
      throw new NotFoundException('Admin user not found');
    }

    const rating = await this.prisma.rating.findUnique({ where: { id: ratingId } });
    if (!rating) {
      throw new NotFoundException('Rating not found');
    }

    const updated = await this.prisma.rating.update({
      where: { id: ratingId },
      data: {
        status: dto.status,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        id: uuidv7(),
        actorUserId: userId,
        action: 'RATING_MODERATED',
        resource: 'RATING',
        resourceId: ratingId,
        metadata: {
          status: dto.status,
        },
      },
    });

    return updated;
  }
}
