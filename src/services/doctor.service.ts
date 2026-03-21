import prisma from '../config/db';
import { AppError } from '../middlewares/error.middleware';
import { isValidAppointmentTransition } from '../constants/statuses';
import { ERROR_CODES } from '../constants/errorCodes';
import { newId } from '../utils/id';
import type { ScheduleArray } from '../utils/schedule';
import { asScheduleArray } from '../utils/schedule';
import type { Prisma } from '@prisma/client';

export interface CreateAnswerInput {
  content: string;
}

export interface UpdateAppointmentInput {
  status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  notes?: string;
  scheduledAt?: string;
}

export interface UpdateScheduleInput {
  schedule: ScheduleArray;
}

export interface UpdateProfileInput {
  bio?: string;
  yearsOfExperience?: number;
  specialtyId?: string;
}

export class DoctorService {
  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        doctorProfile: {
          include: {
            specialty: true,
          },
        },
      },
    });

    if (!user || !user.doctorProfile) {
      throw new AppError('Doctor profile not found', 404, 'PROFILE_NOT_FOUND');
    }

    const [questionCount, appointmentCount] = await Promise.all([
      prisma.question.count({
        where: { doctorId: user.doctorProfile.id },
      }),
      prisma.appointment.count({
        where: { doctorId: user.doctorProfile.id },
      }),
    ]);

    return {
      ...user.doctorProfile,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      stats: {
        questionCount,
        appointmentCount,
        ratingAverage: user.doctorProfile.ratingAverage,
        ratingCount: user.doctorProfile.ratingCount,
      },
    };
  }

  async getQuestions(userId: string, status?: string, page: number = 1, limit: number = 20) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { doctorProfile: true },
    });

    if (!user || !user.doctorProfile) {
      throw new AppError('Doctor profile not found', 404, 'PROFILE_NOT_FOUND');
    }

    const where: any = {
      doctorId: user.doctorProfile.id,
    };

    if (status && ['PENDING', 'ANSWERED', 'MODERATED'].includes(status)) {
      where.status = status;
    }

    const skip = (page - 1) * limit;

    const [questions, total] = await Promise.all([
      prisma.question.findMany({
        where,
        skip,
        take: limit,
        include: {
          patient: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
            },
          },
          answers: {
            where: {
              doctorId: user.doctorProfile.id,
            },
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.question.count({ where }),
    ]);

    return {
      questions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async answerQuestion(userId: string, questionId: string, input: CreateAnswerInput) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { doctorProfile: true },
    });

    if (!user || !user.doctorProfile) {
      throw new AppError('Doctor profile not found', 404, 'PROFILE_NOT_FOUND');
    }

    const question = await prisma.question.findFirst({
      where: {
        id: questionId,
        doctorId: user.doctorProfile.id,
      },
    });

    if (!question) {
      throw new AppError('Question not found or not assigned to you', 404, 'QUESTION_NOT_FOUND');
    }

    const existingAnswer = await prisma.answer.findFirst({
      where: {
        questionId,
        doctorId: user.doctorProfile.id,
      },
    });

    let answer;

    if (existingAnswer) {
      answer = await prisma.answer.update({
        where: { id: existingAnswer.id },
        data: {
          content: input.content,
          // Answers are auto-approved; they bypass the moderation queue.
          isApproved: true,
        },
      });
    } else {
      // Answers are auto-approved; they bypass the moderation queue.
      answer = await prisma.answer.create({
        data: {
          id: newId(),
          questionId,
          doctorId: user.doctorProfile.id,
          content: input.content,
          isApproved: true,
        },
      });
    }

    await prisma.question.update({
      where: { id: questionId },
      data: { status: 'ANSWERED' },
    });

    return answer;
  }

  async getAppointments(
    userId: string,
    status?: string,
    page: number = 1,
    limit: number = 20
  ) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { doctorProfile: true },
    });

    if (!user || !user.doctorProfile) {
      throw new AppError('Doctor profile not found', 404, ERROR_CODES.PROFILE_NOT_FOUND);
    }

    const where: any = { doctorId: user.doctorProfile.id };

    if (status && ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'].includes(status)) {
      where.status = status;
    }

    const skip = (page - 1) * limit;

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        skip,
        take: limit,
        include: {
          patient: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
            },
          },
          doctor: {
            select: {
              specialty: {
                select: {
                  nameEn: true,
                  nameVi: true,
                },
              },
            },
          },
        },
        orderBy: { scheduledAt: 'desc' },
      }),
      prisma.appointment.count({ where }),
    ]);

    return {
      appointments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getPatients(userId: string, page: number = 1, limit: number = 20, search?: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { doctorProfile: true },
    });

    if (!user || !user.doctorProfile) {
      throw new AppError('Doctor profile not found', 404, ERROR_CODES.PROFILE_NOT_FOUND);
    }

    const where: any = {
      OR: [
        { appointments: { some: { doctorId: user.doctorProfile.id } } },
        { questions: { some: { doctorId: user.doctorProfile.id } } },
      ],
    };

    if (search?.trim()) {
      where.AND = [
        {
          OR: [
            { user: { firstName: { contains: search.trim() } } },
            { user: { lastName: { contains: search.trim() } } },
            { user: { email: { contains: search.trim() } } },
            { phone: { contains: search.trim() } },
          ],
        },
      ];
    }

    const skip = (page - 1) * limit;

    const [patients, total] = await Promise.all([
      prisma.patientProfile.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              isActive: true,
            },
          },
        },
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.patientProfile.count({ where }),
    ]);

    return {
      patients,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getAppointmentById(userId: string, appointmentId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { doctorProfile: true },
    });

    if (!user || !user.doctorProfile) {
      throw new AppError('Doctor profile not found', 404, ERROR_CODES.PROFILE_NOT_FOUND);
    }

    const appointment = await prisma.appointment.findFirst({
      where: {
        id: appointmentId,
        doctorId: user.doctorProfile.id,
      },
      include: {
        patient: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!appointment) {
      throw new AppError('Appointment not found', 404, ERROR_CODES.APPOINTMENT_NOT_FOUND);
    }

    return appointment;
  }

  async getRatings(userId: string, page: number = 1, limit: number = 20) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { doctorProfile: true },
    });

    if (!user || !user.doctorProfile) {
      throw new AppError('Doctor profile not found', 404, ERROR_CODES.PROFILE_NOT_FOUND);
    }

    const where = {
      doctorId: user.doctorProfile.id,
      status: 'VISIBLE' as const,
    };

    const skip = (page - 1) * limit;

    const [ratings, total] = await Promise.all([
      prisma.rating.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          patient: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
          appointment: {
            select: {
              id: true,
              scheduledAt: true,
            },
          },
        },
      }),
      prisma.rating.count({ where }),
    ]);

    return {
      ratings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateProfile(userId: string, input: UpdateProfileInput) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { doctorProfile: true },
    });

    if (!user || !user.doctorProfile) {
      throw new AppError('Doctor profile not found', 404, ERROR_CODES.PROFILE_NOT_FOUND);
    }

    if (input.specialtyId) {
      const specialty = await prisma.specialty.findUnique({
        where: { id: input.specialtyId },
      });
      if (!specialty || !specialty.isActive) {
        throw new AppError(
          'Specialty not found or inactive',
          404,
          ERROR_CODES.SPECIALTY_NOT_FOUND
        );
      }
    }

    const updatedProfile = await prisma.doctorProfile.update({
      where: { id: user.doctorProfile.id },
      data: {
        ...(input.bio !== undefined && { bio: input.bio }),
        ...(input.yearsOfExperience !== undefined && {
          yearsOfExperience: input.yearsOfExperience,
        }),
        ...(input.specialtyId !== undefined && { specialtyId: input.specialtyId }),
      },
      include: {
        specialty: {
          select: { id: true, nameEn: true, nameVi: true },
        },
      },
    });

    return {
      ...updatedProfile,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };
  }

  async updateAppointment(
    userId: string,
    appointmentId: string,
    input: UpdateAppointmentInput
  ) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { doctorProfile: true },
    });

    if (!user || !user.doctorProfile) {
      throw new AppError('Doctor profile not found', 404, ERROR_CODES.PROFILE_NOT_FOUND);
    }

    const appointment = await prisma.appointment.findFirst({
      where: {
        id: appointmentId,
        doctorId: user.doctorProfile.id,
      },
    });

    if (!appointment) {
      throw new AppError('Appointment not found', 404, ERROR_CODES.APPOINTMENT_NOT_FOUND);
    }

    if (input.status && input.status !== appointment.status) {
      if (!isValidAppointmentTransition(appointment.status, input.status)) {
        throw new AppError(
          `Cannot transition appointment from ${appointment.status} to ${input.status}`,
          400,
          ERROR_CODES.INVALID_STATUS_TRANSITION
        );
      }
    }

    if (input.scheduledAt !== undefined) {
      // Only PENDING/CONFIRMED appointments can be rescheduled.
      const reschedulableStatuses = ['PENDING', 'CONFIRMED'];
      if (!reschedulableStatuses.includes(appointment.status)) {
        throw new AppError(
          `Cannot reschedule an appointment with status ${appointment.status}`,
          400,
          ERROR_CODES.INVALID_STATUS_TRANSITION
        );
      }

      const newScheduledAt = new Date(input.scheduledAt);

      if (newScheduledAt <= new Date()) {
        throw new AppError(
          'Rescheduled time must be in the future',
          400,
          ERROR_CODES.INVALID_SCHEDULED_AT
        );
      }

      // Conflict detection: ±30-min window around the new scheduled time.
      const windowMs = 30 * 60 * 1000;
      const windowStart = new Date(newScheduledAt.getTime() - windowMs);
      const windowEnd = new Date(newScheduledAt.getTime() + windowMs);

      const conflict = await prisma.appointment.findFirst({
        where: {
          id: { not: appointmentId }, // exclude this appointment itself
          doctorId: user.doctorProfile.id,
          status: { in: ['PENDING', 'CONFIRMED'] },
          scheduledAt: {
            gte: windowStart,
            lte: windowEnd,
          },
        },
      });

      if (conflict) {
        throw new AppError(
          'The selected time conflicts with another appointment',
          409,
          'APPOINTMENT_CONFLICT'
        );
      }
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        ...(input.status !== undefined && { status: input.status }),
        ...(input.notes !== undefined && { notes: input.notes }),
        ...(input.scheduledAt !== undefined && {
          scheduledAt: new Date(input.scheduledAt),
        }),
      },
      include: {
        patient: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        doctor: {
          select: {
            specialty: {
              select: {
                nameEn: true,
                nameVi: true,
              },
            },
          },
        },
      },
    });

    return updatedAppointment;
  }

  async getSchedule(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { doctorProfile: true },
    });

    if (!user || !user.doctorProfile) {
      throw new AppError('Doctor profile not found', 404, 'PROFILE_NOT_FOUND');
    }

    const schedule = asScheduleArray(user.doctorProfile.schedule);

    return { schedule };
  }

  async updateSchedule(userId: string, input: UpdateScheduleInput) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { doctorProfile: true },
    });

    if (!user || !user.doctorProfile) {
      throw new AppError('Doctor profile not found', 404, 'PROFILE_NOT_FOUND');
    }

    const updatedProfile = await prisma.doctorProfile.update({
      where: { id: user.doctorProfile.id },
      data: {
        // Cast to Prisma.InputJsonValue to satisfy the generated Json field type.
        schedule: input.schedule as Prisma.InputJsonValue,
        scheduleUpdatedAt: new Date(),
      },
    });

    return {
      schedule: asScheduleArray(updatedProfile.schedule),
      scheduleUpdatedAt: updatedProfile.scheduleUpdatedAt,
    };
  }

  async getPublicDoctorById(doctorId: string) {
    const profile = await prisma.doctorProfile.findFirst({
      where: {
        id: doctorId,
        isActive: true,
        user: { isActive: true, deletedAt: null },
      },
      select: {
        id: true,
        userId: true,
        specialtyId: true,
        bio: true,
        yearsOfExperience: true,
        ratingAverage: true,
        ratingCount: true,
        createdAt: true,
        // Public user fields only
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        specialty: {
          select: {
            id: true,
            nameEn: true,
            nameVi: true,
          },
        },
      },
    });

    if (!profile) {
      throw new AppError('Doctor not found', 404, ERROR_CODES.DOCTOR_NOT_FOUND);
    }

    return {
      id: profile.id,
      userId: profile.userId,
      firstName: profile.user.firstName,
      lastName: profile.user.lastName,
      specialtyId: profile.specialtyId,
      specialtyNameEn: profile.specialty.nameEn,
      specialtyNameVi: profile.specialty.nameVi,
      bio: profile.bio ?? null,
      yearsOfExperience: profile.yearsOfExperience,
      ratingAverage: profile.ratingAverage,
      ratingCount: profile.ratingCount,
      createdAt: profile.createdAt,
    };
  }

  async getPublicDoctorSchedule(doctorId: string) {
    const profile = await prisma.doctorProfile.findFirst({
      where: {
        id: doctorId,
        isActive: true,
        user: { isActive: true, deletedAt: null },
      },
      select: {
        id: true,
        schedule: true,
        scheduleUpdatedAt: true,
      },
    });

    if (!profile) {
      throw new AppError('Doctor not found', 404, ERROR_CODES.DOCTOR_NOT_FOUND);
    }

    return {
      doctorId: profile.id,
      schedule: asScheduleArray(profile.schedule),
      scheduleUpdatedAt: profile.scheduleUpdatedAt ?? null,
    };
  }

  async getPublicDoctors(
    specialtyId?: string,
    page: number = 1,
    limit: number = 20
  ) {
    // Clamp limit to avoid massive accidental payloads.
    const safLimit = Math.min(limit, 100);
    const skip = (page - 1) * safLimit;

    const where: any = {
      isActive: true,
      user: {
        isActive: true,
        deletedAt: null,
      },
    };

    if (specialtyId) {
      where.specialtyId = specialtyId;
    }

    const [profiles, total] = await Promise.all([
      prisma.doctorProfile.findMany({
        where,
        skip,
        take: safLimit,
        orderBy: [
          { ratingAverage: 'desc' },
          { createdAt: 'desc' },
        ],
        select: {
          id: true,
          userId: true,
          specialtyId: true,
          bio: true,
          yearsOfExperience: true,
          ratingAverage: true,
          ratingCount: true,
          schedule: true,
          // Public fields only — no email, no isActive, no deletedAt.
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          specialty: {
            select: {
              id: true,
              nameEn: true,
              nameVi: true,
            },
          },
        },
      }),
      prisma.doctorProfile.count({ where }),
    ]);

    const doctors = profiles.map((p) => ({
      id: p.id,
      userId: p.userId,
      firstName: p.user.firstName,
      lastName: p.user.lastName,
      specialtyId: p.specialtyId,
      specialtyName: p.specialty.nameEn,
      specialtyNameVi: p.specialty.nameVi,
      bio: p.bio ?? null,
      yearsOfExperience: p.yearsOfExperience,
      ratingAverage: p.ratingAverage,
      ratingCount: p.ratingCount,
      schedule: asScheduleArray(p.schedule),
    }));

    return {
      doctors,
      pagination: {
        page,
        limit: safLimit,
        total,
        totalPages: Math.ceil(total / safLimit),
      },
    };
  }

  async getFeaturedDoctors() {
    const doctors = await prisma.doctorProfile.findMany({
      take: 6,
      orderBy: [
        { ratingAverage: 'desc' },
        { createdAt: 'desc' },
      ],
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        specialty: {
          select: {
            id: true,
            nameEn: true,
          },
        },
      },
      where: {
        isActive: true,
        user: {
          isActive: true,
          deletedAt: null,
        },
      },
    });

    return doctors.map(doctor => ({
      id: doctor.id,
      firstName: doctor.user.firstName,
      lastName: doctor.user.lastName,
      name: `${doctor.user.firstName} ${doctor.user.lastName}`.trim(),
      specialtyName: doctor.specialty.nameEn,
      specialty: doctor.specialty.nameEn,
      specialtyId: doctor.specialtyId,
      yearsOfExperience: doctor.yearsOfExperience,
      experienceYears: doctor.yearsOfExperience,
      bio: doctor.bio,
      ratingAverage: doctor.ratingAverage,
      ratingCount: doctor.ratingCount,
    }));
  }
}

export default new DoctorService();
