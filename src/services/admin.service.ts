import prisma from '../config/db';
import { AppError } from '../middlewares/error.middleware';
import { hashPassword } from '../utils/password';

export interface CreateUserInput {
  email: string;
  password: string;
  fullName: string;
  role: 'PATIENT' | 'DOCTOR' | 'ADMIN';
  specialtyId?: string;
  bio?: string;
  dateOfBirth?: Date;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  phone?: string;
  address?: string;
}

export interface UpdateUserInput {
  email?: string;
  fullName?: string;
  role?: 'PATIENT' | 'DOCTOR' | 'ADMIN';
  isActive?: boolean;
}

export interface CreateSpecialtyInput {
  name: string;
  description?: string;
}

export interface UpdateSpecialtyInput {
  name?: string;
  description?: string;
  isActive?: boolean;
}

export class AdminService {
  /**
   * Get all users with optional filters
   */
  async getUsers(filters?: { role?: string; isActive?: boolean; search?: string; page?: number; limit?: number }) {
    const { role, isActive, search, page = 1, limit = 20 } = filters || {};
    
    const where: any = {};
    
    if (role && ['PATIENT', 'DOCTOR', 'ADMIN'].includes(role)) {
      where.role = role;
    }
    
    if (isActive !== undefined) {
      where.isActive = isActive;
    }
    
    if (search) {
      where.OR = [
        { email: { contains: search } },
        { fullName: { contains: search } },
      ];
    }

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          fullName: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          patientProfile: {
            select: {
              id: true,
              phone: true,
              gender: true,
            },
          },
          doctorProfile: {
            select: {
              id: true,
              specialtyId: true,
              ratingAverage: true,
              ratingCount: true,
              specialty: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Create a new user (any role)
   */
  async createUser(input: CreateUserInput) {
    const { email, password, fullName, role, ...profileData } = input;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError('User with this email already exists', 409, 'USER_EXISTS');
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user with profile if needed
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName,
        role,
        ...(role === 'PATIENT' && {
          patientProfile: {
            create: {
              dateOfBirth: profileData.dateOfBirth,
              gender: profileData.gender,
              phone: profileData.phone,
              address: profileData.address,
            },
          },
        }),
        ...(role === 'DOCTOR' && profileData.specialtyId && {
          doctorProfile: {
            create: {
              specialtyId: profileData.specialtyId,
              bio: profileData.bio,
            },
          },
        }),
      },
      include: {
        patientProfile: true,
        doctorProfile: {
          include: {
            specialty: true,
          },
        },
      },
    });

    return user;
  }

  /**
   * Update a user
   */
  async updateUser(userId: string, input: UpdateUserInput) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: input,
      include: {
        patientProfile: true,
        doctorProfile: {
          include: {
            specialty: true,
          },
        },
      },
    });

    return updatedUser;
  }

  /**
   * Delete (deactivate) a user
   */
  async deleteUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    // Soft delete by deactivating
    await prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
    });

    return { message: 'User deactivated successfully' };
  }

  /**
   * Get all doctors
   */
  async getDoctors(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [doctors, total] = await Promise.all([
      prisma.doctorProfile.findMany({
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              fullName: true,
              isActive: true,
            },
          },
          specialty: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.doctorProfile.count(),
    ]);

    return {
      doctors,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get all patients
   */
  async getPatients(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [patients, total] = await Promise.all([
      prisma.patientProfile.findMany({
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              fullName: true,
              isActive: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.patientProfile.count(),
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

  /**
   * Get all specialties
   */
  async getSpecialties() {
    const specialties = await prisma.specialty.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return specialties;
  }

  /**
   * Create a specialty
   */
  async createSpecialty(input: CreateSpecialtyInput) {
    const specialty = await prisma.specialty.create({
      data: input,
    });

    return specialty;
  }

  /**
   * Update a specialty
   */
  async updateSpecialty(specialtyId: string, input: UpdateSpecialtyInput) {
    const specialty = await prisma.specialty.findUnique({
      where: { id: specialtyId },
    });

    if (!specialty) {
      throw new AppError('Specialty not found', 404, 'SPECIALTY_NOT_FOUND');
    }

    const updatedSpecialty = await prisma.specialty.update({
      where: { id: specialtyId },
      data: input,
    });

    return updatedSpecialty;
  }

  /**
   * Delete a specialty
   */
  async deleteSpecialty(specialtyId: string) {
    const specialty = await prisma.specialty.findUnique({
      where: { id: specialtyId },
    });

    if (!specialty) {
      throw new AppError('Specialty not found', 404, 'SPECIALTY_NOT_FOUND');
    }

    // Check if any doctors are using this specialty
    const doctorCount = await prisma.doctorProfile.count({
      where: { specialtyId },
    });

    if (doctorCount > 0) {
      throw new AppError(
        'Cannot delete specialty that is assigned to doctors',
        400,
        'SPECIALTY_IN_USE'
      );
    }

    await prisma.specialty.delete({
      where: { id: specialtyId },
    });

    return { message: 'Specialty deleted successfully' };
  }

  /**
   * Get all appointments
   */
  async getAppointments(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
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
      }),
      prisma.appointment.count(),
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
   * Update appointment
   */
  async updateAppointment(appointmentId: string, status: string) {
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      throw new AppError('Appointment not found', 404, 'APPOINTMENT_NOT_FOUND');
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: status as any },
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
    });

    return updatedAppointment;
  }

  /**
   * Get questions for moderation
   */
  async getQuestionsForModeration(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [questions, total] = await Promise.all([
      prisma.question.findMany({
        skip,
        take: limit,
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
          doctor: {
            include: {
              user: {
                select: {
                  fullName: true,
                },
              },
            },
          },
          answers: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.question.count(),
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
   * Moderate a question
   */
  async moderateQuestion(questionId: string, status: string) {
    const question = await prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      throw new AppError('Question not found', 404, 'QUESTION_NOT_FOUND');
    }

    const updatedQuestion = await prisma.question.update({
      where: { id: questionId },
      data: { status: status as any },
    });

    return updatedQuestion;
  }

  /**
   * Moderate an answer
   */
  async moderateAnswer(answerId: string, isApproved: boolean) {
    const answer = await prisma.answer.findUnique({
      where: { id: answerId },
    });

    if (!answer) {
      throw new AppError('Answer not found', 404, 'ANSWER_NOT_FOUND');
    }

    const updatedAnswer = await prisma.answer.update({
      where: { id: answerId },
      data: { isApproved },
    });

    return updatedAnswer;
  }

  /**
   * Get ratings for moderation
   */
  async getRatingsForModeration(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [ratings, total] = await Promise.all([
      prisma.rating.findMany({
        skip,
        take: limit,
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
          doctor: {
            include: {
              user: {
                select: {
                  fullName: true,
                },
              },
            },
          },
          appointment: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.rating.count(),
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
   * Moderate a rating
   */
  async moderateRating(ratingId: string, status: 'VISIBLE' | 'HIDDEN') {
    const rating = await prisma.rating.findUnique({
      where: { id: ratingId },
    });

    if (!rating) {
      throw new AppError('Rating not found', 404, 'RATING_NOT_FOUND');
    }

    const updatedRating = await prisma.rating.update({
      where: { id: ratingId },
      data: { status },
    });

    // Recalculate doctor's rating average
    const doctorRatings = await prisma.rating.findMany({
      where: {
        doctorId: rating.doctorId,
        status: 'VISIBLE',
      },
      select: {
        score: true,
      },
    });

    if (doctorRatings.length > 0) {
      const totalScore = doctorRatings.reduce((sum, r) => sum + r.score, 0);
      const averageRating = totalScore / doctorRatings.length;

      await prisma.doctorProfile.update({
        where: { id: rating.doctorId },
        data: {
          ratingAverage: averageRating,
          ratingCount: doctorRatings.length,
        },
      });
    } else {
      await prisma.doctorProfile.update({
        where: { id: rating.doctorId },
        data: {
          ratingAverage: 0,
          ratingCount: 0,
        },
      });
    }

    return updatedRating;
  }
}

export default new AdminService();
