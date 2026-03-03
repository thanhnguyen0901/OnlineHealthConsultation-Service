import prisma from '../config/db';
import { AppointmentStatus } from '@prisma/client';
import { AppError } from '../middlewares/error.middleware';
import { ERROR_CODES } from '../constants/errorCodes';
import { newId } from '../utils/id';
import { recalcDoctorRating } from '../utils/rating';
import { env } from '../config/env';

export interface UpdatePatientProfileInput {
  dateOfBirth?: Date;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  phone?: string;
  address?: string;
  medicalHistory?: string;
}

export interface CreateQuestionInput {
  title: string;
  content: string;
  doctorId?: string;
}

export interface CreateAppointmentInput {
  doctorId: string;
  scheduledAt: Date;
  reason: string;
}

export interface CreateRatingInput {
  appointmentId: string;
  doctorId: string;
  score: number;
  comment?: string;
}

export class PatientService {
  /**
   * Get patient profile
   */
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        patientProfile: true,
      },
    });

    if (!user || !user.patientProfile) {
      throw new AppError('Patient profile not found', 404, ERROR_CODES.PROFILE_NOT_FOUND);
    }

    return {
      ...user.patientProfile,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };
  }

  /**
   * Update patient profile
   */
  async updateProfile(userId: string, input: UpdatePatientProfileInput) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { patientProfile: true },
    });

    if (!user || !user.patientProfile) {
      throw new AppError('Patient profile not found', 404, ERROR_CODES.PROFILE_NOT_FOUND);
    }

    const updatedProfile = await prisma.patientProfile.update({
      where: { id: user.patientProfile.id },
      data: input,
    });

    return updatedProfile;
  }

  /**
   * Get all questions created by patient
   */
  async getQuestions(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { patientProfile: true },
    });

    if (!user || !user.patientProfile) {
      throw new AppError('Patient profile not found', 404, ERROR_CODES.PROFILE_NOT_FOUND);
    }

    const questions = await prisma.question.findMany({
      where: { patientId: user.patientProfile.id },
      include: {
        doctor: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
            specialty: true,
          },
        },
        answers: {
          where: {
            isApproved: true, // Only show approved answers to patients (moderation visibility)
          },
          include: {
            doctor: {
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
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return questions;
  }

  /**
   * Create a new question
   */
  async createQuestion(userId: string, input: CreateQuestionInput) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { patientProfile: true },
    });

    if (!user || !user.patientProfile) {
      throw new AppError('Patient profile not found', 404, ERROR_CODES.PROFILE_NOT_FOUND);
    }

    // If doctorId is provided, verify doctor exists
    if (input.doctorId) {
      const doctor = await prisma.doctorProfile.findUnique({
        where: { id: input.doctorId },
      });
      if (!doctor) {
        throw new AppError('Doctor not found', 404, ERROR_CODES.DOCTOR_NOT_FOUND);
      }
    }

    const question = await prisma.question.create({
      data: {
        id: newId(),
        patientId: user.patientProfile.id,
        doctorId: input.doctorId,
        title: input.title,
        content: input.content,
      },
      include: {
        doctor: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
            specialty: true,
          },
        },
      },
    });

    return question;
  }

  /**
   * Get all appointments for patient
   */
  async getAppointments(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { patientProfile: true },
    });

    if (!user || !user.patientProfile) {
      throw new AppError('Patient profile not found', 404, ERROR_CODES.PROFILE_NOT_FOUND);
    }

    const appointments = await prisma.appointment.findMany({
      where: { patientId: user.patientProfile.id },
      include: {
        doctor: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
            specialty: true,
          },
        },
      },
      orderBy: {
        scheduledAt: 'desc',
      },
    });

    return appointments;
  }

  /**
   * Create a new appointment
   */
  async createAppointment(userId: string, input: CreateAppointmentInput) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { patientProfile: true },
    });

    if (!user || !user.patientProfile) {
      throw new AppError('Patient profile not found', 404, ERROR_CODES.PROFILE_NOT_FOUND);
    }

    // Verify doctor exists.
    // The FE doctor-list sends User.id (from getDoctors controller which sets id=doc.user.id),
    // but appointments store DoctorProfile.id. Try DoctorProfile.id first; if not found,
    // resolve via User.id so both ID forms are accepted.
    let doctor = await prisma.doctorProfile.findUnique({
      where: { id: input.doctorId },
    });

    if (!doctor) {
      // Fallback: input.doctorId might be a User.id
      const userWithProfile = await prisma.user.findUnique({
        where: { id: input.doctorId },
        include: { doctorProfile: true },
      });
      if (userWithProfile?.doctorProfile) {
        doctor = userWithProfile.doctorProfile;
        // Normalise so downstream code uses the DoctorProfile.id
        input = { ...input, doctorId: doctor.id };
      }
    }

    if (!doctor) {
      throw new AppError('Doctor not found', 404, ERROR_CODES.DOCTOR_NOT_FOUND);
    }

    // P1-2 Fix: Validate appointment date must be in the future
    if (input.scheduledAt <= new Date()) {
      throw new AppError(
        'Appointment must be scheduled for a future date',
        400,
        ERROR_CODES.INVALID_DATE
      );
    }

    // Check for appointment conflicts using overlap detection.
    //
    // Each appointment occupies a fixed slot of APPOINTMENT_DURATION_MINUTES.
    // New slot:      [T,   T+D)    where T = scheduledAt, D = duration
    // Existing slot: [E,   E+D)
    // Overlap condition: E < T+D  AND  E+D > T  => E ∈ (T-D, T+D)
    //
    // We query for existing (PENDING|CONFIRMED) appointments whose scheduledAt
    // falls inside the open interval (windowStart, windowEnd).
    const durationMs = env.APPOINTMENT_DURATION_MINUTES * 60 * 1000;
    const windowStart = new Date(input.scheduledAt.getTime() - durationMs);
    const windowEnd   = new Date(input.scheduledAt.getTime() + durationMs);
    const overlapWhere = {
      status: { in: ['PENDING', 'CONFIRMED'] as AppointmentStatus[] },
      scheduledAt: { gt: windowStart, lt: windowEnd },
    };

    // Doctor conflict – a doctor cannot be in two overlapping slots
    const doctorConflict = await prisma.appointment.findFirst({
      where: { doctorId: input.doctorId, ...overlapWhere },
      select: { id: true, scheduledAt: true },
    });

    if (doctorConflict) {
      throw new AppError(
        `Doctor already has an appointment overlapping this time slot (${doctorConflict.scheduledAt.toISOString()})`,
        409,
        ERROR_CODES.APPOINTMENT_CONFLICT
      );
    }

    // Patient conflict – prevent double-booking from the patient side
    const patientProfileId = user.patientProfile.id;
    const patientConflict = await prisma.appointment.findFirst({
      where: { patientId: patientProfileId, ...overlapWhere },
      select: { id: true, scheduledAt: true },
    });

    if (patientConflict) {
      throw new AppError(
        `You already have an appointment overlapping this time slot (${patientConflict.scheduledAt.toISOString()})`,
        409,
        ERROR_CODES.APPOINTMENT_CONFLICT
      );
    }

    const appointment = await prisma.appointment.create({
      data: {
        id: newId(),
        patientId: user.patientProfile.id,
        doctorId: input.doctorId,
        scheduledAt: input.scheduledAt,
        reason: input.reason,
      },
      include: {
        doctor: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
            specialty: true,
          },
        },
      },
    });

    return appointment;
  }

  /**
   * Get patient consultation history (questions + completed appointments)
   */
  async getHistory(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { patientProfile: true },
    });

    if (!user || !user.patientProfile) {
      throw new AppError('Patient profile not found', 404, ERROR_CODES.PROFILE_NOT_FOUND);
    }

    const [questions, appointments] = await Promise.all([
      prisma.question.findMany({
        where: {
          patientId: user.patientProfile.id,
          status: 'ANSWERED',
        },
        include: {
          doctor: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
              specialty: true,
            },
          },
          answers: {
            where: {
              isApproved: true, // Only show approved answers (moderation visibility)
            },
            include: {
              doctor: {
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
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.appointment.findMany({
        where: {
          patientId: user.patientProfile.id,
          status: 'COMPLETED',
        },
        include: {
          doctor: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
              specialty: true,
            },
          },
          ratings: {
            where: {
              patientId: user.patientProfile.id,
            },
          },
        },
        orderBy: {
          scheduledAt: 'desc',
        },
      }),
    ]);

    return {
      questions,
      appointments,
    };
  }

  /**
   * Create a rating for a doctor after appointment
   */
  async createRating(userId: string, input: CreateRatingInput) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { patientProfile: true },
    });

    if (!user || !user.patientProfile) {
      throw new AppError('Patient profile not found', 404, ERROR_CODES.PROFILE_NOT_FOUND);
    }

    // Verify appointment exists and belongs to patient
    const appointment = await prisma.appointment.findFirst({
      where: {
        id: input.appointmentId,
        patientId: user.patientProfile.id,
      },
    });

    if (!appointment) {
      throw new AppError('Appointment not found', 404, ERROR_CODES.APPOINTMENT_NOT_FOUND);
    }

    // Check if appointment is completed
    if (appointment.status !== 'COMPLETED') {
      throw new AppError(
        'Can only rate completed appointments',
        400,
        ERROR_CODES.APPOINTMENT_NOT_COMPLETED
      );
    }

    // Check if rating already exists
    const existingRating = await prisma.rating.findFirst({
      where: {
        appointmentId: input.appointmentId,
        patientId: user.patientProfile.id,
      },
    });

    if (existingRating) {
      throw new AppError('Rating already exists for this appointment', 409, ERROR_CODES.RATING_EXISTS);
    }

    // Validate score
    if (input.score < 1 || input.score > 5) {
      throw new AppError('Score must be between 1 and 5', 400, ERROR_CODES.INVALID_SCORE);
    }

    // Capture profile ID before transaction to preserve TypeScript narrowing
    const patientProfileId = user.patientProfile.id;

    // Create rating and recalculate doctor stats atomically
    const rating = await prisma.$transaction(async (tx) => {
      const newRating = await tx.rating.create({
        data: {
          id: newId(),
          patientId: patientProfileId,
          doctorId: input.doctorId,
          appointmentId: input.appointmentId,
          score: input.score,
          comment: input.comment,
        },
      });

      await recalcDoctorRating(input.doctorId, tx);

      return newRating;
    });

    return rating;
  }

  /**
   * Get all ratings by patient
   */
  async getRatings(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { patientProfile: true },
    });

    if (!user || !user.patientProfile) {
      throw new AppError('Patient profile not found', 404, ERROR_CODES.PROFILE_NOT_FOUND);
    }

    const ratings = await prisma.rating.findMany({
      where: { patientId: user.patientProfile.id },
      include: {
        doctor: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
            specialty: true,
          },
        },
        appointment: {
          select: {
            scheduledAt: true,
            reason: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return ratings;
  }
}

export default new PatientService();
