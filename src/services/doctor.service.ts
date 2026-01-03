import prisma from '../config/db';
import { AppError } from '../middlewares/error.middleware';
import { isValidAppointmentTransition } from '../constants/statuses';
import { ERROR_CODES } from '../constants/errorCodes';

export interface CreateAnswerInput {
  content: string;
}

export interface UpdateAppointmentInput {
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  notes?: string;
}

export interface UpdateScheduleInput {
  schedule: any; // JSON data for schedule
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
      fullName: user.fullName,
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
                  fullName: true,
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
   * Get appointments for doctor with optional status filter
   */
  async getAppointments(userId: string, status?: string) {
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

    if (status && ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'].includes(status)) {
      where.status = status;
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        patient: {
          include: {
            user: {
              select: {
                fullName: true,
                email: true,
              },
            },
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
                fullName: true,
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

    const schedule = user.doctorProfile.schedule 
      ? JSON.parse(user.doctorProfile.schedule) 
      : null;

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
        schedule: JSON.stringify(input.schedule),
      },
    });

    return {
      schedule: updatedProfile.schedule ? JSON.parse(updatedProfile.schedule) : null,
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
            fullName: true,
          },
        },
        specialty: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      where: {
        user: {
          isActive: true,
        },
      },
    });

    // Transform to match FE expectations
    return doctors.map(doctor => ({
      id: doctor.id,
      fullName: doctor.user.fullName,
      specialtyName: doctor.specialty.name,
      specialtyId: doctor.specialtyId,
      yearsOfExperience: doctor.yearsOfExperience,
      bio: doctor.bio,
      ratingAverage: doctor.ratingAverage,
      ratingCount: doctor.ratingCount,
    }));
  }
}

export default new DoctorService();
