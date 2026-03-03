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
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  notes?: string;
}

export interface UpdateScheduleInput {
  /** Validated array of day-slots; Zod schema in src/utils/schedule.ts */
  schedule: ScheduleArray;
}

export interface UpdateProfileInput {
  bio?: string;
  yearsOfExperience?: number;
  specialtyId?: string;
}

export class DoctorService {
  /**
   * Get doctor profile with stats
   */
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

    // Get stats
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

  /**
   * Get questions for doctor with optional status filter
   */
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

  /**
   * Create or update answer for a question
   */
  async answerQuestion(userId: string, questionId: string, input: CreateAnswerInput) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { doctorProfile: true },
    });

    if (!user || !user.doctorProfile) {
      throw new AppError('Doctor profile not found', 404, 'PROFILE_NOT_FOUND');
    }

    // Verify question exists and is assigned to this doctor
    const question = await prisma.question.findFirst({
      where: {
        id: questionId,
        doctorId: user.doctorProfile.id,
      },
    });

    if (!question) {
      throw new AppError('Question not found or not assigned to you', 404, 'QUESTION_NOT_FOUND');
    }

    // Check if answer already exists
    const existingAnswer = await prisma.answer.findFirst({
      where: {
        questionId,
        doctorId: user.doctorProfile.id,
      },
    });

    let answer;

    if (existingAnswer) {
      // Update existing answer
      answer = await prisma.answer.update({
        where: { id: existingAnswer.id },
        data: {
          content: input.content,
          // P2-4 Fix: Reset approval when updating answer
          isApproved: false,
        },
      });
    } else {
      // Create new answer
      // P2-4 Fix: Explicitly set isApproved to false for moderation
      answer = await prisma.answer.create({
        data: {
          id: newId(),
          questionId,
          doctorId: user.doctorProfile.id,
          content: input.content,
          isApproved: false,
        },
      });
    }

    // Update question status to ANSWERED
    await prisma.question.update({
      where: { id: questionId },
      data: { status: 'ANSWERED' },
    });

    return answer;
  }

  /**
   * Get appointments for doctor with optional status filter and pagination.
   */
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

  /**
   * Get a single appointment by id; only the owning doctor may view it.
   */
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

  /**
   * Get ratings received by this doctor (VISIBLE only) with pagination.
   */
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

  /**
   * Update own doctor profile fields (bio, yearsOfExperience, specialtyId).
   * specialtyId is validated against the specialties table.
   */
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

  /**
   * Update appointment status
   */
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

    // Verify appointment belongs to this doctor
    const appointment = await prisma.appointment.findFirst({
      where: {
        id: appointmentId,
        doctorId: user.doctorProfile.id,
      },
    });

    if (!appointment) {
      throw new AppError('Appointment not found', 404, ERROR_CODES.APPOINTMENT_NOT_FOUND);
    }

    // Validate status transition (state machine)
    if (input.status && input.status !== appointment.status) {
      if (!isValidAppointmentTransition(appointment.status, input.status)) {
        throw new AppError(
          `Cannot transition appointment from ${appointment.status} to ${input.status}`,
          400,
          ERROR_CODES.INVALID_STATUS_TRANSITION
        );
      }
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status: input.status,
        notes: input.notes,
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
      },
    });

    return updatedAppointment;
  }

  /**
   * Get doctor's schedule
   */
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

  /**
   * Update doctor's schedule
   */
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
        // ScheduleArray is a plain JSON-serialisable array; cast to
        // Prisma.InputJsonValue to satisfy the generated Json field type.
        schedule: input.schedule as Prisma.InputJsonValue,
        scheduleUpdatedAt: new Date(),
      },
    });

    return {
      schedule: asScheduleArray(updatedProfile.schedule),
      scheduleUpdatedAt: updatedProfile.scheduleUpdatedAt,
    };
  }

  /**
   * Get a public-safe doctor profile by doctor-profile id.
   * Returns 404 for inactive or soft-deleted doctors.
   */
  async getPublicDoctorById(doctorId: string) {
    const profile = await prisma.doctorProfile.findFirst({
      where: {
        id: doctorId,
        isActive: true,                    // RISK-02: gate on profile flag too
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

  /**
   * Return the parsed schedule for a public doctor profile.
   * Returns 404 for inactive or soft-deleted doctors.
   */
  async getPublicDoctorSchedule(doctorId: string) {
    const profile = await prisma.doctorProfile.findFirst({
      where: {
        id: doctorId,
        isActive: true,                    // RISK-02: gate on profile flag too
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

  /**
   * Public doctor listing used by patients for browsing / booking.
   *
   * Safety guarantees:
   *   - Only doctors whose user account is active (isActive=true) and not
   *     soft-deleted (deletedAt=null) are returned.
   *   - The response shape contains NO admin-only fields (no isActive, no
   *     deletedAt, no email).
   *
   * @param specialtyId  Optional filter by specialty UUID.
   * @param page         1-based page index (default 1).
   * @param limit        Items per page (default 20, max 100).
   */
  async getPublicDoctors(
    specialtyId?: string,
    page: number = 1,
    limit: number = 20
  ) {
    // Clamp limit to avoid massive accidental payloads
    const safLimit = Math.min(limit, 100);
    const skip = (page - 1) * safLimit;

    const where: any = {
      // RISK-02: filter on BOTH the profile flag and the user account flags
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
          // Public user fields only — no email, no isActive, no deletedAt
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

    // Flatten the nested structure for a clean public response shape
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
      // schedule is already a native JsonValue (no JSON.parse needed with Json? column)
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

  /**
   * Get featured doctors (public)
   * P2-3 Fix: Returns top 6 doctors for homepage
   */
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
        // RISK-02: guard on profile flag + full user account guard
        isActive: true,
        user: {
          isActive: true,
          deletedAt: null,
        },
      },
    });

    // Transform to match FE expectations
    return doctors.map(doctor => ({
      id: doctor.id,
      firstName: doctor.user.firstName,
      lastName: doctor.user.lastName,
      specialtyName: doctor.specialty.nameEn,
      specialtyId: doctor.specialtyId,
      yearsOfExperience: doctor.yearsOfExperience,
      bio: doctor.bio,
      ratingAverage: doctor.ratingAverage,
      ratingCount: doctor.ratingCount,
    }));
  }
}

export default new DoctorService();
