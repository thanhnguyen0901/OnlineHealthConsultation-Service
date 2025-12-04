import prisma from '../config/db';
import { AppError } from '../middlewares/error.middleware';

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
      throw new AppError('Patient profile not found', 404, 'PROFILE_NOT_FOUND');
    }

    return {
      ...user.patientProfile,
      fullName: user.fullName,
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
      throw new AppError('Patient profile not found', 404, 'PROFILE_NOT_FOUND');
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
      throw new AppError('Patient profile not found', 404, 'PROFILE_NOT_FOUND');
    }

    const questions = await prisma.question.findMany({
      where: { patientId: user.patientProfile.id },
      include: {
        doctor: {
          include: {
            user: {
              select: {
                fullName: true,
                email: true,
              },
            },
            specialty: true,
          },
        },
        answers: {
          include: {
            doctor: {
              include: {
                user: {
                  select: {
                    fullName: true,
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
      throw new AppError('Patient profile not found', 404, 'PROFILE_NOT_FOUND');
    }

    // If doctorId is provided, verify doctor exists
    if (input.doctorId) {
      const doctor = await prisma.doctorProfile.findUnique({
        where: { id: input.doctorId },
      });
      if (!doctor) {
        throw new AppError('Doctor not found', 404, 'DOCTOR_NOT_FOUND');
      }
    }

    const question = await prisma.question.create({
      data: {
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
                fullName: true,
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
      throw new AppError('Patient profile not found', 404, 'PROFILE_NOT_FOUND');
    }

    const appointments = await prisma.appointment.findMany({
      where: { patientId: user.patientProfile.id },
      include: {
        doctor: {
          include: {
            user: {
              select: {
                fullName: true,
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
      throw new AppError('Patient profile not found', 404, 'PROFILE_NOT_FOUND');
    }

    // Verify doctor exists
    const doctor = await prisma.doctorProfile.findUnique({
      where: { id: input.doctorId },
    });

    if (!doctor) {
      throw new AppError('Doctor not found', 404, 'DOCTOR_NOT_FOUND');
    }

    const appointment = await prisma.appointment.create({
      data: {
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
                fullName: true,
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
      throw new AppError('Patient profile not found', 404, 'PROFILE_NOT_FOUND');
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
                  fullName: true,
                },
              },
              specialty: true,
            },
          },
          answers: {
            include: {
              doctor: {
                include: {
                  user: {
                    select: {
                      fullName: true,
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
                  fullName: true,
                },
              },
              specialty: true,
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
      throw new AppError('Patient profile not found', 404, 'PROFILE_NOT_FOUND');
    }

    // Verify appointment exists and belongs to patient
    const appointment = await prisma.appointment.findFirst({
      where: {
        id: input.appointmentId,
        patientId: user.patientProfile.id,
      },
    });

    if (!appointment) {
      throw new AppError('Appointment not found', 404, 'APPOINTMENT_NOT_FOUND');
    }

    // Check if appointment is completed
    if (appointment.status !== 'COMPLETED') {
      throw new AppError(
        'Can only rate completed appointments',
        400,
        'APPOINTMENT_NOT_COMPLETED'
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
      throw new AppError('Rating already exists for this appointment', 409, 'RATING_EXISTS');
    }

    // Validate score
    if (input.score < 1 || input.score > 5) {
      throw new AppError('Score must be between 1 and 5', 400, 'INVALID_SCORE');
    }

    // Create rating
    const rating = await prisma.rating.create({
      data: {
        patientId: user.patientProfile.id,
        doctorId: input.doctorId,
        appointmentId: input.appointmentId,
        score: input.score,
        comment: input.comment,
      },
    });

    // Update doctor's rating average
    const doctorRatings = await prisma.rating.findMany({
      where: {
        doctorId: input.doctorId,
        status: 'VISIBLE',
      },
      select: {
        score: true,
      },
    });

    const totalScore = doctorRatings.reduce((sum, r) => sum + r.score, 0);
    const averageRating = totalScore / doctorRatings.length;

    await prisma.doctorProfile.update({
      where: { id: input.doctorId },
      data: {
        ratingAverage: averageRating,
        ratingCount: doctorRatings.length,
      },
    });

    return rating;
  }
}

export default new PatientService();
