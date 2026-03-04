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
  /** Specialty selected by the patient; used to auto-assign a doctor when doctorId is absent. */
  specialtyId?: string;
}

export interface CreateAppointmentInput {
  doctorId: string;
  scheduledAt: Date;
  reason: string;
  /** Duration of the appointment slot in minutes. Defaults to 60. */
  durationMinutes?: number;
}

export interface CreateRatingInput {
  appointmentId: string;
  doctorId: string;
  score: number;
  comment?: string;
}

export class PatientService {
  /**
   * Get all specialties that have at least one active doctor.
   * Used by the patient-facing specialty picker so patients can
   * never select a specialty where no doctor is available.
   */
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

    const { firstName, lastName, ...profileFields } = input;

    const [updatedUser, updatedProfile] = await prisma.$transaction([
      // Update User name fields if provided
      prisma.user.update({
        where: { id: userId },
        data: {
          ...(firstName !== undefined && { firstName }),
          ...(lastName !== undefined && { lastName }),
        },
      }),
      // Update PatientProfile fields
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

    // If doctorId is provided, verify doctor exists and is active (RISK-02 fix)
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
      // This guarantees questions always reach a doctor's inbox and are never
      // left with doctorId = null (P0-3 fix).
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
        // RISK-03 fix: originalDoctorId is write-once audit provenance.
        // It captures the assigned doctor at creation time and is never
        // modified — it survives even if doctorId is SET NULL by a hard-delete.
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
    // AUDIT-05 defensive guard: reason is TEXT NOT NULL in the DB.
    // Zod already enforces this at the controller layer; this guard catches
    // any future direct service calls that bypass the HTTP validation path.
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

    // Verify doctor exists and is active (RISK-02 fix).
    // The FE doctor-list sends User.id (from getDoctors controller which sets id=doc.user.id),
    // but appointments store DoctorProfile.id. Try DoctorProfile.id first; if not found,
    // resolve via User.id so both ID forms are accepted.
    // Both lookup paths guard isActive + user.deletedAt so deactivated doctors
    // cannot receive new bookings regardless of which ID form the caller sends.
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

    // Check for appointment conflicts using per-slot overlap detection (RISK-10).
    //
    // Each appointment carries its own durationMinutes so slots with different
    // lengths are handled correctly.
    //
    // Two slots [A, A+dA) and [B, B+dB) overlap when:
    //   A < B+dB  AND  A+dA > B
    //
    // SQL query: fetch candidates where A starts before the new slot ends (A < newEnd)
    //            and A is within a 480-min lookback (generous bound for existing durations).
    // JS check:  exact second condition — A+dA > newStart.
    const newDurationMs = (input.durationMinutes ?? 60) * 60_000;
    const newSlotEnd    = new Date(input.scheduledAt.getTime() + newDurationMs);
    const candidateWhere = {
      status: { in: ['PENDING', 'CONFIRMED'] as AppointmentStatus[] },
      scheduledAt: {
        gt: new Date(input.scheduledAt.getTime() - 480 * 60_000),
        lt: newSlotEnd,
      },
    };

    /** True when an existing appointment slot overlaps the new slot. */
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
          // Return ALL statuses so the patient can see pending/moderated questions too.
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
          // Return ALL statuses: pending/confirmed need cancel button; completed need rating.
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
          // 0..1 relation — a single optional rating per completed appointment
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

    // Validate score (fast pre-flight — no DB round-trip needed)
    if (input.score < 1 || input.score > 5) {
      throw new AppError('Score must be between 1 and 5', 400, ERROR_CODES.INVALID_SCORE);
    }

    // Capture profile ID before transaction to preserve TypeScript narrowing
    const patientProfileId = user.patientProfile.id;

    // Create rating and recalculate doctor stats atomically.
    //
    // RISK-01 fix — TOCTOU guard:
    //   The duplicate-rating check is re-executed INSIDE the transaction so
    //   that two concurrent requests cannot both pass the pre-flight check and
    //   then race to insert.  The DB @@unique([appointmentId, patientId])
    //   constraint remains as a final backstop and is caught below as P2002.
    let rating;
    try {
      rating = await prisma.$transaction(async (tx) => {
        // Re-check for duplicate inside the transaction (TOCTOU fix)
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
      // Prisma unique-constraint violation (P2002): two concurrent requests
      // both passed the in-TX findFirst check in the same instant and the DB
      // rejected the second insert.  Surface this as a clean 409.
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

  /**
   * Get a single question that belongs to this patient, including
   * only approved answers and the assigned doctor's public info.
   */
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
      // Return the same 404 regardless of whether the question exists but
      // belongs to another patient — avoids leaking ownership information.
      throw new AppError('Question not found', 404, ERROR_CODES.QUESTION_NOT_FOUND);
    }

    return question;
  }

  /**
   * Get a single appointment that belongs to this patient, including
   * doctor info and specialty.
   */
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
        // 0..1 relation — at most one rating per appointment
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

  /**
   * Cancel an appointment that belongs to this patient.
   * Only PENDING or CONFIRMED appointments may be cancelled.
   */
  async cancelAppointment(userId: string, appointmentId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { patientProfile: true },
    });

    if (!user || !user.patientProfile) {
      throw new AppError('Patient profile not found', 404, ERROR_CODES.PROFILE_NOT_FOUND);
    }

    // Load the appointment and verify ownership in a single query
    const appointment = await prisma.appointment.findFirst({
      where: {
        id: appointmentId,
        patientId: user.patientProfile.id, // 403-equivalent: not found if not owner
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
