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
  /**
   * Get a single user by id (admin view — all fields)
   */
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

  /**
   * Get all users with optional filters
   */
  async getUsers(filters?: { role?: string; isActive?: boolean; search?: string; page?: number; limit?: number }) {
    const { role, isActive, search, page = 1, limit = 20 } = filters || {};
    
    const where: any = {};
    
    if (role && ['PATIENT', 'DOCTOR', 'ADMIN'].includes(role)) {
      where.role = role;
    }
    
    // Only add isActive filter if explicitly set to true or false
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

  /**
   * Create a new user (any role)
   */
  async createUser(input: CreateUserInput) {
    const { email, password, firstName, lastName, role, ...profileData } = input;

    // Defensive guard: DOCTOR role requires a specialtyId so that DoctorProfile
    // can be created atomically.  The Zod schema in the controller enforces this
    // at the HTTP layer; this check is a safety net for programmatic callers.
    if (role === 'DOCTOR' && !profileData.specialtyId) {
      throw new AppError(
        'specialtyId is required when role is DOCTOR',
        400,
        'SPECIALTY_REQUIRED'
      );
    }

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

    // RISK-02 fix: wrap user update + doctorProfile.isActive sync in one
    // transaction so the two columns never diverge on partial failure.
    const updatedUser = await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: {
          ...input,
          // Sync deletedAt with isActive changes:
          // deactivating → stamp deletedAt; reactivating → clear it
          ...(input.isActive === false && { deletedAt: new Date() }),
          ...(input.isActive === true  && { deletedAt: null }),
        },
      });

      // Keep DoctorProfile.isActive mirrored to User.isActive.
      // updateMany is a no-op when the user has no doctor profile.
      if (typeof input.isActive === 'boolean') {
        await tx.doctorProfile.updateMany({
          where: { userId },
          data: { isActive: input.isActive },
        });
      }

      // Re-fetch after all writes so every included field is up-to-date
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

    // Soft delete: deactivate user and mirror onto DoctorProfile (RISK-02 fix)
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { isActive: false, deletedAt: new Date() },
      }),
      // updateMany is a no-op when the user has no doctor profile
      prisma.doctorProfile.updateMany({
        where: { userId },
        data: { isActive: false },
      }),
    ]);

    return { message: 'User deactivated successfully' };
  }

  /**
   * Get all doctors
   */
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

  /**
   * Create a doctor (wrapper around createUser for FE compatibility)
   */
  async createDoctor(input: CreateUserInput) {
    // Force role to be DOCTOR
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

  /**
   * Update a doctor
   */
  async updateDoctor(doctorId: string, input: any) {
    // doctorId here is the user ID (FE sends user.id)
    const user = await prisma.user.findUnique({
      where: { id: doctorId },
      include: { doctorProfile: true },
    });

    if (!user || user.role !== 'DOCTOR' || !user.doctorProfile) {
      throw new AppError('Doctor not found', 404, 'DOCTOR_NOT_FOUND');
    }

    // Separate user fields from doctor profile fields
    const { specialtyId, bio, yearsOfExperience, firstName, lastName, ...restUserFields } = input;

    // Build user update payload
    const userFields: any = { ...restUserFields };
    if (firstName !== undefined) userFields.firstName = firstName;
    if (lastName !== undefined) userFields.lastName = lastName;

    // Sync deletedAt with isActive changes
    if (userFields.isActive === false) userFields.deletedAt = new Date();
    if (userFields.isActive === true)  userFields.deletedAt = null;

    // Build doctor profile update payload
    const doctorFields: any = {};
    if (specialtyId) doctorFields.specialtyId = specialtyId;
    if (bio !== undefined) doctorFields.bio = bio;
    if (yearsOfExperience !== undefined) doctorFields.yearsOfExperience = yearsOfExperience;

    const profileId = user.doctorProfile.id;

    // Perform both writes atomically — if either fails (e.g. FK violation on
    // specialtyId) the entire transaction is rolled back and no partial state
    // is persisted.
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

      // Return consistent snapshot of post-update state (still inside tx)
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

  /**
   * Delete a doctor (deactivate)
   */
  async deleteDoctor(doctorId: string) {
    const user = await prisma.user.findUnique({
      where: { id: doctorId },
      include: { doctorProfile: true },
    });

    if (!user || user.role !== 'DOCTOR') {
      throw new AppError('Doctor not found', 404, 'DOCTOR_NOT_FOUND');
    }

    // Atomic soft-delete: mirror isActive=false onto DoctorProfile so stat
    // queries (prisma.doctorProfile.count) and isActive filters stay correct.
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

  /**
   * Get all patients with optional search and isActive filter
   */
  async getPatients(
    page: number = 1,
    limit: number = 20,
    search?: string,
    isActive?: boolean
  ) {
    const skip = (page - 1) * limit;

    // Build a stable AND array so filters never clobber each other.
    // isActive always constrains the joined User row.
    // search matches any of firstName / lastName / email (on User) or phone
    // (on PatientProfile) — both arms carry the isActive constraint via AND.
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
  /**
   * Update a patient's user info (name, email, isActive).
   * :userId is the User.id (the FE flattens patientProfile → user.id in the
   * transform, so the FE always sends User.id, not PatientProfile.id).
   */
  async updatePatient(userId: string, input: { firstName?: string; lastName?: string; email?: string; isActive?: boolean }) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.role !== 'PATIENT') {
      throw new AppError('Patient not found', 404, 'PATIENT_NOT_FOUND');
    }

    // Atomic update: user fields + optional isActive mirror on PatientProfile
    // (PatientProfile has no dedicated isActive column, but we synchronise
    // deletedAt / isActive on the User row consistently with other service methods)
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

    // Return same flat shape as getPatients transform
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

  /**
   * Deactivate (soft-delete) a patient.
   * Mirrors the pattern in deleteUser / deleteDoctor.
   */
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

  /**
   * Get all specialties
   */
  async getSpecialties() {
    const specialties = await prisma.specialty.findMany({
      orderBy: {
        nameEn: 'asc',
      },
    });

    return specialties;
  }

  /**
   * Create a specialty
   */
  async createSpecialty(input: CreateSpecialtyInput) {
    const specialty = await prisma.specialty.create({
      data: { id: newId(), ...input },
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

    const updateData = { ...input };

    const updatedSpecialty = await prisma.specialty.update({
      where: { id: specialtyId },
      data: updateData,
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
   * Get a single appointment by id (admin view — full detail)
   */
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

  /**
   * Get all appointments
   */
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
        // Include the entire end day
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

  /**
   * Archive (soft-delete) a question by setting its status to MODERATED.
   *
   * The Question model has no dedicated deletedAt column, so MODERATED is the
   * domain-consistent way to remove a question from public visibility while
   * preserving the record for audit purposes.
   */
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

  /**
   * Moderate a question
   */
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

    // Update status and recalculate doctor stats atomically
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

  /**
   * Get unified moderation items (pending questions + unapproved answers).
   *
   * Ratings are intentionally excluded from this queue — they have a dedicated
   * PATCH /admin/ratings/:id/moderate endpoint and no "pending" status in the
   * DB schema.  Including VISIBLE ratings here polluted the list with items
   * that were already approved and had no actionable approve/reject path.
   *
   * Pagination totals are derived from accurate DB counts so the paginator
   * is always correct regardless of how many items exist.
   * Returns items with composite ID format: type_entityId
   */
  async getModerationItems(page: number = 1, limit: number = 20) {
    // Accurate DB counts — no hard take cap
    const [questionCount, answerCount] = await Promise.all([
      prisma.question.count({ where: { status: 'PENDING' } }),
      prisma.answer.count({ where: { isApproved: false } }),
    ]);

    const total = questionCount + answerCount;

    // Fetch all pending items so cross-type sort is correct before slicing.
    // In practice the moderation queue should stay small; if it grows large
    // a cursor-based approach per type would be more efficient.
    const [questions, answers] = await Promise.all([
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
    ];

    // Sort by createdAt desc (cross-type)
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

  /**
   * Approve a moderation item (QUESTION or ANSWER only).
   * Ratings are moderated via the dedicated PATCH /admin/ratings/:id/moderate
   * endpoint and do not appear in the unified queue.
   */
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
          await tx.question.update({
            where: { id: answer.questionId },
            data: { status: 'ANSWERED' },
          });
          return updatedAnswer;
        });
      }

      default:
        throw new AppError('Invalid moderation item type', 400, 'INVALID_TYPE');
    }
  }

  /**
   * Reject a moderation item (QUESTION or ANSWER only).
   * Ratings are moderated via the dedicated PATCH /admin/ratings/:id/moderate
   * endpoint and do not appear in the unified queue.
   */
  async rejectModerationItem(compositeId: string) {
    const [type, entityId] = compositeId.split('_');

    if (!type || !entityId) {
      throw new AppError('Invalid moderation item ID format', 400, 'INVALID_ID_FORMAT');
    }

    switch (type) {
      case 'QUESTION':
        return this.moderateQuestion(entityId, 'MODERATED');

      case 'ANSWER':
        // Reject = mark answer as not approved. The parent question intentionally
        // stays PENDING: the question is still unanswered, the admin has only
        // rejected this particular answer. The doctor may submit a revised answer.
        return this.moderateAnswer(entityId, false);

      default:
        throw new AppError('Invalid moderation item type', 400, 'INVALID_TYPE');
    }
  }
}

export default new AdminService();
