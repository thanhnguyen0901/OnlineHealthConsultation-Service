import prisma from '../config/db';
import { AppError } from '../middlewares/error.middleware';
import { hashPassword } from '../utils/password';
import { newId } from '../utils/id';
import { recalcDoctorRating } from '../utils/rating';

export interface CreateUserInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
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
  firstName?: string;
  lastName?: string;
  role?: 'PATIENT' | 'DOCTOR' | 'ADMIN';
  isActive?: boolean;
}

export interface CreateSpecialtyInput {
  nameEn: string;
  nameVi: string;
  description?: string;
}

export interface UpdateSpecialtyInput {
  nameEn?: string;
  nameVi?: string;
  description?: string;
  isActive?: boolean;
}

export class AdminService {
  async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        deletedAt: true,
        createdAt: true,
        updatedAt: true,
        patientProfile: {
          select: {
            id: true,
            dateOfBirth: true,
            gender: true,
            phone: true,
            address: true,
            medicalHistory: true,
            createdAt: true,
          },
        },
        doctorProfile: {
          select: {
            id: true,
            specialtyId: true,
            bio: true,
            yearsOfExperience: true,
            ratingAverage: true,
            ratingCount: true,
            createdAt: true,
            specialty: {
              select: { id: true, nameEn: true, nameVi: true },
            },
          },
        },
      },
    });

    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    return user;
  }

  async getUsers(filters?: { role?: string; isActive?: boolean; search?: string; page?: number; limit?: number }) {
    const { role, isActive, search, page = 1, limit = 20 } = filters || {};
    
    const where: any = {};
    
    if (role && ['PATIENT', 'DOCTOR', 'ADMIN'].includes(role)) {
      where.role = role;
    }
    
    if (typeof isActive === 'boolean') {
      where.isActive = isActive;
    }
    
    if (search) {
      where.OR = [
        { email: { contains: search } },
        { firstName: { contains: search } },
        { lastName: { contains: search } },
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
          firstName: true,
          lastName: true,
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
                  nameEn: true,
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

  async createUser(input: CreateUserInput) {
    const { email, password, firstName, lastName, role, ...profileData } = input;

    // DOCTOR role requires specialtyId; Zod enforces at the HTTP layer, this catches programmatic callers.
    if (role === 'DOCTOR' && !profileData.specialtyId) {
      throw new AppError(
        'specialtyId is required when role is DOCTOR',
        400,
        'SPECIALTY_REQUIRED'
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError('User with this email already exists', 409, 'USER_EXISTS');
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        id: newId(),
        email,
        passwordHash,
        firstName,
        lastName,
        role,
        ...(role === 'PATIENT' && {
          patientProfile: {
            create: {
              id: newId(),
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
              id: newId(),
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

  async updateUser(userId: string, input: UpdateUserInput) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    const updatedUser = await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: {
          ...input,
          // deactivating stamps deletedAt; reactivating clears it.
          ...(input.isActive === false && { deletedAt: new Date() }),
          ...(input.isActive === true  && { deletedAt: null }),
        },
      });

      // updateMany is a no-op when the user has no doctor profile.
      if (typeof input.isActive === 'boolean') {
        await tx.doctorProfile.updateMany({
          where: { userId },
          data: { isActive: input.isActive },
        });
      }

      return tx.user.findUniqueOrThrow({
        where: { id: userId },
        include: {
          patientProfile: true,
          doctorProfile: {
            include: { specialty: true },
          },
        },
      });
    });

    return updatedUser;
  }

  async deleteUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    // Soft-delete: mirror isActive=false onto DoctorProfile.
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { isActive: false, deletedAt: new Date() },
      }),
      // updateMany is a no-op when the user has no doctor profile.
      prisma.doctorProfile.updateMany({
        where: { userId },
        data: { isActive: false },
      }),
    ]);

    return { message: 'User deactivated successfully' };
  }

  async getDoctors(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [doctors, total] = await Promise.all([
      prisma.doctorProfile.findMany({
        where: { isActive: true },
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              isActive: true,
            },
          },
          specialty: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.doctorProfile.count({ where: { isActive: true } }),
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

  async createDoctor(input: CreateUserInput) {
    const doctorInput = {
      ...input,
      role: 'DOCTOR' as const,
    };

    if (!input.specialtyId) {
      throw new AppError('Specialty ID is required for doctors', 400, 'SPECIALTY_REQUIRED');
    }

    const user = await this.createUser(doctorInput);
    return user;
  }

  async updateDoctor(doctorId: string, input: any) {
    // doctorId is User.id; FE sends user.id rather than DoctorProfile.id.
    const user = await prisma.user.findUnique({
      where: { id: doctorId },
      include: { doctorProfile: true },
    });

    if (!user || user.role !== 'DOCTOR' || !user.doctorProfile) {
      throw new AppError('Doctor not found', 404, 'DOCTOR_NOT_FOUND');
    }

    const { specialtyId, bio, yearsOfExperience, firstName, lastName, ...restUserFields } = input;

    const userFields: any = { ...restUserFields };
    if (firstName !== undefined) userFields.firstName = firstName;
    if (lastName !== undefined) userFields.lastName = lastName;

    // Sync deletedAt with isActive changes
    if (userFields.isActive === false) userFields.deletedAt = new Date();
    if (userFields.isActive === true)  userFields.deletedAt = null;

    const doctorFields: any = {};
    if (specialtyId) doctorFields.specialtyId = specialtyId;
    if (bio !== undefined) doctorFields.bio = bio;
    if (yearsOfExperience !== undefined) doctorFields.yearsOfExperience = yearsOfExperience;

    const profileId = user.doctorProfile.id;

    // Atomic: if specialtyId FK fails, both writes roll back.
    return prisma.$transaction(async (tx) => {
      if (Object.keys(userFields).length > 0) {
        await tx.user.update({
          where: { id: doctorId },
          data: userFields,
        });
      }

      if (Object.keys(doctorFields).length > 0) {
        await tx.doctorProfile.update({
          where: { id: profileId },
          data: doctorFields,
        });
      }

      return tx.user.findUnique({
        where: { id: doctorId },
        include: {
          doctorProfile: {
            include: {
              specialty: true,
            },
          },
        },
      });
    });
  }

  async deleteDoctor(doctorId: string) {
    const user = await prisma.user.findUnique({
      where: { id: doctorId },
      include: { doctorProfile: true },
    });

    if (!user || user.role !== 'DOCTOR') {
      throw new AppError('Doctor not found', 404, 'DOCTOR_NOT_FOUND');
    }

    // Soft-delete: mirror isActive=false onto DoctorProfile.
    await prisma.$transaction([
      prisma.user.update({
        where: { id: doctorId },
        data: { isActive: false, deletedAt: new Date() },
      }),
      // updateMany is a no-op if the profile row is somehow missing
      prisma.doctorProfile.updateMany({
        where: { userId: doctorId },
        data: { isActive: false },
      }),
    ]);

    return { message: 'Doctor deactivated successfully' };
  }

  async getPatients(
    page: number = 1,
    limit: number = 20,
    search?: string,
    isActive?: boolean
  ) {
    const skip = (page - 1) * limit;

    // AND array prevents filters from clobbering each other; isActive always constrains the joined User row.
    const andClauses: any[] = [];

    if (typeof isActive === 'boolean') {
      andClauses.push({ user: { isActive } });
    }

    if (search) {
      andClauses.push({
        OR: [
          { user: { firstName: { contains: search } } },
          { user: { lastName:  { contains: search } } },
          { user: { email:     { contains: search } } },
          { phone: { contains: search } },
        ],
      });
    }

    const where: any = andClauses.length > 0 ? { AND: andClauses } : {};

    const [patients, total] = await Promise.all([
      prisma.patientProfile.findMany({
        skip,
        take: limit,
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              isActive: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
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

  async createPatient(input: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    dateOfBirth?: Date;
    gender?: 'MALE' | 'FEMALE' | 'OTHER';
    phone?: string;
    address?: string;
  }) {
    const created = await this.createUser({
      ...input,
      role: 'PATIENT',
    });

    return {
      id: created.id,
      profileId: (created.patientProfile as any)?.id ?? null,
      email: created.email,
      firstName: created.firstName,
      lastName: created.lastName,
      isActive: created.isActive,
      phone: (created.patientProfile as any)?.phone ?? null,
      gender: (created.patientProfile as any)?.gender ?? null,
      dateOfBirth: (created.patientProfile as any)?.dateOfBirth ?? null,
      address: (created.patientProfile as any)?.address ?? null,
      role: 'PATIENT' as const,
    };
  }

  // userId is User.id; FE transform flattens patientProfile to user.id rather than PatientProfile.id.
  async updatePatient(userId: string, input: { firstName?: string; lastName?: string; email?: string; isActive?: boolean }) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.role !== 'PATIENT') {
      throw new AppError('Patient not found', 404, 'PATIENT_NOT_FOUND');
    }

    const updatedUser = await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: {
          ...(input.firstName !== undefined && { firstName: input.firstName }),
          ...(input.lastName  !== undefined && { lastName:  input.lastName  }),
          ...(input.email     !== undefined && { email:     input.email     }),
          ...(input.isActive === false && { isActive: false, deletedAt: new Date() }),
          ...(input.isActive === true  && { isActive: true,  deletedAt: null }),
        },
      });

      return tx.user.findUniqueOrThrow({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          isActive: true,
          role: true,
          patientProfile: {
            select: { id: true, phone: true, gender: true, dateOfBirth: true, address: true },
          },
        },
      });
    });

    return {
      id: updatedUser.id,
      profileId: (updatedUser.patientProfile as any)?.id ?? null,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      isActive: updatedUser.isActive,
      phone:       (updatedUser.patientProfile as any)?.phone       ?? null,
      gender:      (updatedUser.patientProfile as any)?.gender      ?? null,
      dateOfBirth: (updatedUser.patientProfile as any)?.dateOfBirth ?? null,
      address:     (updatedUser.patientProfile as any)?.address     ?? null,
      role: 'PATIENT',
    };
  }

  async deletePatient(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.role !== 'PATIENT') {
      throw new AppError('Patient not found', 404, 'PATIENT_NOT_FOUND');
    }

    await prisma.user.update({
      where: { id: userId },
      data: { isActive: false, deletedAt: new Date() },
    });

    return { message: 'Patient deactivated successfully' };
  }

  async getSpecialties() {
    const specialties = await prisma.specialty.findMany({
      orderBy: {
        nameEn: 'asc',
      },
    });

    return specialties;
  }

  async createSpecialty(input: CreateSpecialtyInput) {
    const specialty = await prisma.specialty.create({
      data: { id: newId(), ...input },
    });

    return specialty;
  }

  async updateSpecialty(specialtyId: string, input: UpdateSpecialtyInput) {
    const specialty = await prisma.specialty.findUnique({
      where: { id: specialtyId },
    });

    if (!specialty) {
      throw new AppError('Specialty not found', 404, 'SPECIALTY_NOT_FOUND');
    }

    const updateData = { ...input };

    const updatedSpecialty = await prisma.specialty.update({
      where: { id: specialtyId },
      data: updateData,
    });

    return updatedSpecialty;
  }

  async deleteSpecialty(specialtyId: string) {
    const specialty = await prisma.specialty.findUnique({
      where: { id: specialtyId },
    });

    if (!specialty) {
      throw new AppError('Specialty not found', 404, 'SPECIALTY_NOT_FOUND');
    }

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

  async getAppointmentById(appointmentId: string) {
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
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
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
            specialty: {
              select: { id: true, nameEn: true, nameVi: true },
            },
          },
        },
        // 0..1 relation — at most one rating per appointment
        rating: true,
      },
    });

    if (!appointment) {
      throw new AppError('Appointment not found', 404, 'APPOINTMENT_NOT_FOUND');
    }

    return appointment;
  }

  async getAppointments(page: number = 1, limit: number = 20, status?: string, startDate?: string, endDate?: string) {
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) {
      where.status = status.toUpperCase();
    }
    if (startDate || endDate) {
      where.scheduledAt = {};
      if (startDate) where.scheduledAt.gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        where.scheduledAt.lte = end;
      }
    }

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        skip,
        take: limit,
        where,
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
                firstName: true,
                lastName: true,
              },
            },
            specialty: {
              select: { nameEn: true },
            },
          },
        },
      },
    });

    return updatedAppointment;
  }

  // MODERATED is the soft-delete equivalent for Question; the model has no dedicated deletedAt column.
  async archiveQuestion(questionId: string) {
    const question = await prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      throw new AppError('Question not found', 404, 'QUESTION_NOT_FOUND');
    }

    const archived = await prisma.question.update({
      where: { id: questionId },
      data: { status: 'MODERATED' },
    });

    return { message: 'Question archived successfully', id: archived.id, status: archived.status };
  }

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
                  firstName: true,
                  lastName: true,
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

  async moderateQuestion(questionId: string, status: 'PENDING' | 'ANSWERED' | 'MODERATED') {
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
                  firstName: true,
                  lastName: true,
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

  async moderateRating(ratingId: string, status: 'VISIBLE' | 'HIDDEN') {
    const rating = await prisma.rating.findUnique({
      where: { id: ratingId },
    });

    if (!rating) {
      throw new AppError('Rating not found', 404, 'RATING_NOT_FOUND');
    }

    // Update status and recalculate doctor stats atomically.
    const updatedRating = await prisma.$transaction(async (tx) => {
      const updated = await tx.rating.update({
        where: { id: ratingId },
        data: { status },
      });

      await recalcDoctorRating(rating.doctorId, tx);

      return updated;
    });

    return updatedRating;
  }

  async getModerationItems(page: number = 1, limit: number = 20) {
    const [questionCount, answerCount, ratingCount] = await Promise.all([
      prisma.question.count({ where: { status: 'PENDING' } }),
      prisma.answer.count({ where: { isApproved: false } }),
      prisma.rating.count(),
    ]);

    const total = questionCount + answerCount + ratingCount;

    // In-memory pagination: moderation queue should remain small; large queues would need cursor-based per-type queries.
    const [questions, answers, ratings] = await Promise.all([
      questionCount > 0
        ? prisma.question.findMany({
            where: { status: 'PENDING' },
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
            orderBy: { createdAt: 'desc' },
          })
        : Promise.resolve([]),
      answerCount > 0
        ? prisma.answer.findMany({
            where: { isApproved: false },
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
              question: {
                select: {
                  title: true,
                },
              },
            },
            orderBy: { createdAt: 'desc' },
          })
        : Promise.resolve([]),
      ratingCount > 0
        ? prisma.rating.findMany({
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
                      firstName: true,
                      lastName: true,
                    },
                  },
                },
              },
            },
            orderBy: { createdAt: 'desc' },
          })
        : Promise.resolve([]),
    ]);

    // Normalize to unified format
    const items = [
      ...questions.map(q => ({
        id: `QUESTION_${q.id}`,
        type: 'QUESTION' as const,
        contentPreview: q.title,
        content: q.content,
        createdAt: q.createdAt,
        author: `${q.patient.user.firstName} ${q.patient.user.lastName}`,
        authorId: q.patient.user.id,
        status: q.status,
        entityId: q.id,
      })),
      ...answers.map(a => ({
        id: `ANSWER_${a.id}`,
        type: 'ANSWER' as const,
        contentPreview: a.content.substring(0, 100),
        content: a.content,
        createdAt: a.createdAt,
        author: `${a.doctor.user.firstName} ${a.doctor.user.lastName}`,
        authorId: a.doctor.user.id,
        status: a.isApproved ? 'APPROVED' : 'PENDING',
        entityId: a.id,
      })),
      ...ratings.map((r) => ({
        id: `RATING_${r.id}`,
        type: 'RATING' as const,
        contentPreview: r.comment?.trim()
          ? r.comment.substring(0, 100)
          : `${r.score}/5`,
        content: r.comment?.trim() || `${r.score}/5`,
        createdAt: r.createdAt,
        author: `${r.patient.user.firstName} ${r.patient.user.lastName}`,
        authorId: r.patient.user.id,
        status: r.status, // VISIBLE | HIDDEN
        entityId: r.id,
      })),
    ];

    items.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    // In-memory slice for the requested page
    const skip = (page - 1) * limit;
    const paginatedItems = items.slice(skip, skip + limit);

    return {
      items: paginatedItems,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async approveModerationItem(compositeId: string) {
    const [type, entityId] = compositeId.split('_');

    if (!type || !entityId) {
      throw new AppError('Invalid moderation item ID format', 400, 'INVALID_ID_FORMAT');
    }

    switch (type) {
      case 'QUESTION':
        return this.moderateQuestion(entityId, 'ANSWERED');

      case 'ANSWER': {
        // Atomically: approve the answer AND promote the parent question to
        // ANSWERED so patients immediately see the resolved status.
        const answer = await prisma.answer.findUnique({
          where: { id: entityId },
        });
        if (!answer) {
          throw new AppError('Answer not found', 404, 'ANSWER_NOT_FOUND');
        }
        return prisma.$transaction(async (tx) => {
          const updatedAnswer = await tx.answer.update({
            where: { id: entityId },
            data: { isApproved: true },
          });
          // Approve answer and promote parent question to ANSWERED atomically.
          await tx.question.update({
            where: { id: answer.questionId },
            data: { status: 'ANSWERED' },
          });
          return updatedAnswer;
        });
      }

      case 'RATING':
        return this.moderateRating(entityId, 'VISIBLE');

      default:
        throw new AppError('Invalid moderation item type', 400, 'INVALID_TYPE');
    }
  }

  async rejectModerationItem(compositeId: string) {
    const [type, entityId] = compositeId.split('_');

    if (!type || !entityId) {
      throw new AppError('Invalid moderation item ID format', 400, 'INVALID_ID_FORMAT');
    }

    switch (type) {
      case 'QUESTION':
        return this.moderateQuestion(entityId, 'MODERATED');

      case 'ANSWER':
        // Reject leaves parent question PENDING; doctor may submit a revised answer.
        return this.moderateAnswer(entityId, false);

      case 'RATING':
        return this.moderateRating(entityId, 'HIDDEN');

      default:
        throw new AppError('Invalid moderation item type', 400, 'INVALID_TYPE');
    }
  }
}

export default new AdminService();
