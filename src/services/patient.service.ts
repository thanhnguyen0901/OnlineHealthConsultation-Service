import prisma from '../config/db';
import { AppointmentStatus, Prisma } from '@prisma/client';
import { AppError } from '../middlewares/error.middleware';
import { ERROR_CODES } from '../constants/errorCodes';
import { newId } from '../utils/id';
import { recalcDoctorRating } from '../utils/rating';

export interface UpdatePatientProfileInput {
  firstName?: string;
  lastName?: string;
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
  // specialtyId is used for doctor auto-assignment when doctorId is absent; not persisted on Question.
  specialtyId?: string;
}

export interface CreateAppointmentInput {
  doctorId: string;
  scheduledAt: Date;
  reason: string;
  // Duration defaults to 60 min; used in overlap detection.
  durationMinutes?: number;
}

export interface CreateRatingInput {
  appointmentId: string;
  doctorId: string;
  score: number;
  comment?: string;
}

export class PatientService {
  async getAvailableSpecialties() {
    return prisma.specialty.findMany({
      where: {
        isActive: true,
        doctors: {
          some: {
            isActive: true,
            user: { isActive: true, deletedAt: null },
          },
        },
      },
      orderBy: { nameEn: 'asc' },
    });
  }

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

  async updateProfile(userId: string, input: UpdatePatientProfileInput) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { patientProfile: true },
    });

    if (!user || !user.patientProfile) {
      throw new AppError('Patient profile not found', 404, ERROR_CODES.PROFILE_NOT_FOUND);
    }

    const { firstName, lastName, ...profileFields } = input;

    const [updatedUser, updatedProfile] = await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: {
          ...(firstName !== undefined && { firstName }),
          ...(lastName !== undefined && { lastName }),
        },
      }),
      prisma.patientProfile.update({
        where: { id: user.patientProfile.id },
        data: profileFields,
      }),
    ]);

    return {
      ...updatedProfile,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
    };
  }

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
            isApproved: true, // Only approved answers are visible to patients.
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

  async createQuestion(userId: string, input: CreateQuestionInput) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { patientProfile: true },
    });

    if (!user || !user.patientProfile) {
      throw new AppError('Patient profile not found', 404, ERROR_CODES.PROFILE_NOT_FOUND);
    }

    if (input.doctorId) {
      const doctor = await prisma.doctorProfile.findFirst({
        where: {
          id: input.doctorId,
          isActive: true,
          user: { isActive: true, deletedAt: null },
        },
        select: { id: true },
      });
      if (!doctor) {
        throw new AppError('Doctor not found', 404, ERROR_CODES.DOCTOR_NOT_FOUND);
      }
    } else if (input.specialtyId) {
      // Auto-assign: pick the first active doctor of the requested specialty.
      const assignedDoctor = await prisma.doctorProfile.findFirst({
        where: {
          specialtyId: input.specialtyId,
          isActive: true,
          user: { isActive: true, deletedAt: null },
        },
        orderBy: { createdAt: 'asc' },
        select: { id: true },
      });
      if (!assignedDoctor) {
        throw new AppError(
          'No doctor is currently available for this specialty',
          400,
          ERROR_CODES.DOCTOR_NOT_FOUND,
        );
      }
      input.doctorId = assignedDoctor.id;
    }

    const question = await prisma.question.create({
      data: {
        id: newId(),
        patientId: user.patientProfile.id,
        doctorId: input.doctorId,
          // originalDoctorId is write-once: captures assigned doctor at creation; never updated if doctorId is later SET NULL.
        originalDoctorId: input.doctorId ?? null,
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

  async createAppointment(userId: string, input: CreateAppointmentInput) {
    // reason is TEXT NOT NULL in DB; Zod enforces at HTTP layer, this catches programmatic callers.
    if (!input.reason || !input.reason.trim()) {
      throw new AppError(
        'Reason for appointment is required',
        400,
        ERROR_CODES.INVALID_INPUT
      );
    }
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { patientProfile: true },
    });

    if (!user || !user.patientProfile) {
      throw new AppError('Patient profile not found', 404, ERROR_CODES.PROFILE_NOT_FOUND);
    }

    // FE sends either DoctorProfile.id or User.id; try profile ID first, then resolve via User.id.
    // Both paths guard isActive + user.deletedAt so deactivated doctors cannot receive new bookings.
    let doctor = await prisma.doctorProfile.findFirst({
      where: {
        id: input.doctorId,
        isActive: true,
        user: { isActive: true, deletedAt: null },
      },
    });

    if (!doctor) {
      // Fallback: input.doctorId might be a User.id
      const userWithProfile = await prisma.user.findFirst({
        where: {
          id: input.doctorId,
          isActive: true,
          deletedAt: null,
          doctorProfile: { isActive: true },
        },
        include: { doctorProfile: true },
      });
      if (userWithProfile?.doctorProfile) {
        doctor = userWithProfile.doctorProfile;
        // Normalise: downstream code always uses DoctorProfile.id.
        input = { ...input, doctorId: doctor.id };
      }
    }

    if (!doctor) {
      throw new AppError('Doctor not found', 404, ERROR_CODES.DOCTOR_NOT_FOUND);
    }

    if (input.scheduledAt <= new Date()) {
      throw new AppError(
        'Appointment must be scheduled for a future date',
        400,
        ERROR_CODES.INVALID_DATE
      );
    }

    // Overlap formula: slots [A, A+dA) and [B, B+dB) overlap when A < B+dB AND A+dA > B.
    // SQL fetches candidates where A < newEnd; JS confirms A+dA > newStart.
    const newDurationMs = (input.durationMinutes ?? 60) * 60_000;
    const newSlotEnd    = new Date(input.scheduledAt.getTime() + newDurationMs);
    const candidateWhere = {
      status: { in: ['PENDING', 'CONFIRMED'] as AppointmentStatus[] },
      scheduledAt: {
        gt: new Date(input.scheduledAt.getTime() - 480 * 60_000),
        lt: newSlotEnd,
      },
    };

    const isOverlap = (existingStart: Date, existingDurationMinutes: number): boolean =>
      existingStart.getTime() + existingDurationMinutes * 60_000 > input.scheduledAt.getTime();

    // Doctor conflict – a doctor cannot be in two overlapping slots
    const doctorCandidates = await prisma.appointment.findMany({
      where: { doctorId: input.doctorId, ...candidateWhere },
      select: { id: true, scheduledAt: true, durationMinutes: true },
    });
    const doctorConflict = doctorCandidates.find(e => isOverlap(e.scheduledAt, e.durationMinutes));

    if (doctorConflict) {
      throw new AppError(
        `Doctor already has an appointment overlapping this time slot (${doctorConflict.scheduledAt.toISOString()})`,
        409,
        ERROR_CODES.APPOINTMENT_CONFLICT
      );
    }

    // Patient conflict – prevent double-booking from the patient side
    const patientProfileId = user.patientProfile.id;
    const patientCandidates = await prisma.appointment.findMany({
      where: { patientId: patientProfileId, ...candidateWhere },
      select: { id: true, scheduledAt: true, durationMinutes: true },
    });
    const patientConflict = patientCandidates.find(e => isOverlap(e.scheduledAt, e.durationMinutes));

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
        durationMinutes: input.durationMinutes ?? 60,
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
          // ALL statuses returned: patients need to see pending/moderated questions too.
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
              isApproved: true, // Only approved answers visible to patients.
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
          // ALL statuses returned: pending/confirmed need cancel; completed need rating.
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
          // 0..1 relation: at most one rating per appointment.
          rating: true,
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

    // Validate score (fast pre-flight — no DB round-trip needed)
    if (input.score < 1 || input.score > 5) {
      throw new AppError('Score must be between 1 and 5', 400, ERROR_CODES.INVALID_SCORE);
    }

    // Preserve TypeScript narrowing before entering the transaction.
    const patientProfileId = user.patientProfile.id;

    // TOCTOU: duplicate-rating check re-executed inside the transaction; DB @@unique([appointmentId, patientId]) is the final backstop.
    let rating;
    try {
      rating = await prisma.$transaction(async (tx) => {
        const existingRating = await tx.rating.findFirst({
          where: {
            appointmentId: input.appointmentId,
            patientId: patientProfileId,
          },
          select: { id: true },
        });

        if (existingRating) {
          throw new AppError(
            'Rating already exists for this appointment',
            409,
            ERROR_CODES.RATING_EXISTS
          );
        }

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
    } catch (err) {
      // P2002: two concurrent requests both passed the in-TX check; surface as 409.
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        throw new AppError(
          'Rating already exists for this appointment',
          409,
          ERROR_CODES.RATING_EXISTS
        );
      }
      throw err;
    }

    return rating;
  }

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

  async getQuestionById(userId: string, questionId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { patientProfile: true },
    });

    if (!user || !user.patientProfile) {
      throw new AppError('Patient profile not found', 404, ERROR_CODES.PROFILE_NOT_FOUND);
    }

    const question = await prisma.question.findFirst({
      where: {
        id: questionId,
        patientId: user.patientProfile.id, // ownership check
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
            specialty: {
              select: { id: true, nameEn: true, nameVi: true },
            },
          },
        },
        answers: {
          where: { isApproved: true }, // patients see only moderation-approved answers
          include: {
            doctor: {
              include: {
                user: {
                  select: { firstName: true, lastName: true },
                },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!question) {
      // Same 404 regardless of ownership to avoid leaking question existence to non-owners.
      throw new AppError('Question not found', 404, ERROR_CODES.QUESTION_NOT_FOUND);
    }

    return question;
  }

  async getAppointmentById(userId: string, appointmentId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { patientProfile: true },
    });

    if (!user || !user.patientProfile) {
      throw new AppError('Patient profile not found', 404, ERROR_CODES.PROFILE_NOT_FOUND);
    }

    const appointment = await prisma.appointment.findFirst({
      where: {
        id: appointmentId,
        patientId: user.patientProfile.id, // ownership check
      },
      include: {
        doctor: {
          include: {
            user: {
              select: { firstName: true, lastName: true, email: true },
            },
            specialty: {
              select: { id: true, nameEn: true, nameVi: true },
            },
          },
        },
        // 0..1 relation: at most one rating per appointment.
        rating: {
          select: { id: true, score: true, comment: true },
        },
      },
    });

    if (!appointment) {
      throw new AppError('Appointment not found', 404, ERROR_CODES.APPOINTMENT_NOT_FOUND);
    }

    return appointment;
  }

  async cancelAppointment(userId: string, appointmentId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { patientProfile: true },
    });

    if (!user || !user.patientProfile) {
      throw new AppError('Patient profile not found', 404, ERROR_CODES.PROFILE_NOT_FOUND);
    }

    const appointment = await prisma.appointment.findFirst({
      where: {
        id: appointmentId,
        patientId: user.patientProfile.id, // 403-equivalent: returns 404 if caller is not the owner
      },
    });

    if (!appointment) {
      throw new AppError('Appointment not found', 404, ERROR_CODES.APPOINTMENT_NOT_FOUND);
    }

    // Only PENDING and CONFIRMED appointments may be cancelled
    const cancellableStatuses: AppointmentStatus[] = ['PENDING', 'CONFIRMED'];
    if (!cancellableStatuses.includes(appointment.status)) {
      throw new AppError(
        `Cannot cancel an appointment that is already ${appointment.status.toLowerCase()}`,
        409,
        ERROR_CODES.INVALID_STATUS_TRANSITION
      );
    }

    const updated = await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: 'CANCELLED' },
      include: {
        doctor: {
          include: {
            user: {
              select: { firstName: true, lastName: true },
            },
            specialty: {
              select: { id: true, nameEn: true, nameVi: true },
            },
          },
        },
      },
    });

    return updated;
  }
}

export default new PatientService();
