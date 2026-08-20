import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ApprovalStatus, Prisma, RatingStatus } from '@prisma/client';
import { uuidv7 } from 'uuidv7';

import { PrismaService } from '../../prisma/prisma.service';
import { UpdateDoctorProfileDto } from './dto/update-doctor-profile.dto';
import { UpdateDoctorScheduleDto } from './dto/update-doctor-schedule.dto';
import { UpdateDoctorSpecialtiesDto } from './dto/update-doctor-specialties.dto';
import { UpdateDoctorApprovalDto } from './dto/update-doctor-approval.dto';
import { AdminUpdateDoctorProfileDto } from './dto/admin-update-doctor-profile.dto';
import { AdminListDoctorsQueryDto } from './dto/admin-list-doctors-query.dto';
import { ListDoctorPatientsQueryDto } from './dto/list-doctor-patients-query.dto';

@Injectable()
export class DoctorService {
  constructor(private readonly prisma: PrismaService) {}

  private buildProfileUpdateData(dto: UpdateDoctorProfileDto): Prisma.DoctorProfileUpdateInput {
    return {
      ...(dto.bio !== undefined ? { bio: dto.bio } : {}),
      ...(dto.qualificationSummary !== undefined
        ? { qualificationSummary: dto.qualificationSummary }
        : {}),
      ...(dto.consultationDescription !== undefined
        ? { consultationDescription: dto.consultationDescription }
        : {}),
      ...(dto.yearsOfExperience !== undefined
        ? { yearsOfExperience: dto.yearsOfExperience }
        : {}),
      ...(dto.isActive !== undefined ? { isActive: dto.isActive } : {}),
    };
  }

  async getMyProfile(userId: string) {
    const profile = await this.prisma.doctorProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            isActive: true,
          },
        },
        specialties: {
          include: {
            specialty: true,
          },
        },
      },
    });

    if (!profile) {
      throw new NotFoundException('Doctor profile not found');
    }

    const [questionCount, appointmentCount, ratingAggregate] = await this.prisma.$transaction([
      this.prisma.question.count({ where: { doctorId: profile.id } }),
      this.prisma.appointment.count({ where: { doctorId: profile.id } }),
      this.prisma.rating.aggregate({
        where: {
          doctorId: profile.id,
          status: RatingStatus.VISIBLE,
        },
        _avg: {
          score: true,
        },
        _count: {
          _all: true,
        },
      }),
    ]);

    const ratingAverage = ratingAggregate._avg.score ?? 0;
    const ratingCount = ratingAggregate._count._all;

    return {
      ...profile,
      ratingAverage,
      ratingCount,
      stats: {
        questionCount,
        appointmentCount,
        ratingAverage,
        ratingCount,
      },
    };
  }

  async updateMyProfile(userId: string, dto: UpdateDoctorProfileDto) {
    const existing = await this.prisma.doctorProfile.findUnique({ where: { userId } });
    if (!existing) {
      throw new NotFoundException('Doctor profile not found');
    }

    return this.prisma.doctorProfile.update({
      where: { userId },
      data: this.buildProfileUpdateData(dto),
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            isActive: true,
          },
        },
        specialties: {
          include: {
            specialty: true,
          },
        },
      },
    });
  }

  async updateMySchedule(userId: string, dto: UpdateDoctorScheduleDto) {
    const existing = await this.prisma.doctorProfile.findUnique({ where: { userId } });
    if (!existing) {
      throw new NotFoundException('Doctor profile not found');
    }

    return this.prisma.doctorProfile.update({
      where: { userId },
      data: {
        ...(dto.schedule !== undefined
          ? { schedule: dto.schedule as Prisma.InputJsonValue, scheduleUpdatedAt: new Date() }
          : {}),
      },
      include: {
        specialties: {
          include: {
            specialty: true,
          },
        },
      },
    });
  }

  async updateMySpecialties(userId: string, dto: UpdateDoctorSpecialtiesDto) {
    const doctor = await this.prisma.doctorProfile.findUnique({ where: { userId } });
    if (!doctor) {
      throw new NotFoundException('Doctor profile not found');
    }

    await this.replaceDoctorSpecialties(doctor.id, dto.specialtyIds);

    return this.getMyProfile(userId);
  }

  private async replaceDoctorSpecialties(doctorId: string, specialtyIds: string[]) {
    const specialties = await this.prisma.specialty.findMany({
      where: { id: { in: specialtyIds }, isActive: true },
      select: { id: true },
    });

    if (specialties.length !== specialtyIds.length) {
      throw new BadRequestException('One or more specialties are invalid or inactive');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.doctorSpecialty.deleteMany({ where: { doctorId } });

      await tx.doctorSpecialty.createMany({
        data: specialtyIds.map((specialtyId) => ({
          id: uuidv7(),
          doctorId,
          specialtyId,
        })),
      });
    });
  }

  async listMyPatients(userId: string, query: ListDoctorPatientsQueryDto) {
    const doctor = await this.prisma.doctorProfile.findUnique({ where: { userId } });
    if (!doctor) {
      throw new NotFoundException('Doctor profile not found');
    }

    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 10, 100);
    const skip = (page - 1) * limit;
    const search = query.search?.trim();

    const where: Prisma.PatientProfileWhereInput = {
      OR: [
        {
          appointments: {
            some: {
              doctorId: doctor.id,
            },
          },
        },
        {
          questions: {
            some: {
              doctorId: doctor.id,
            },
          },
        },
      ],
      ...(search
        ? {
            AND: [
              {
                OR: [
                  { phone: { contains: search, mode: 'insensitive' } },
                  { user: { email: { contains: search, mode: 'insensitive' } } },
                  { user: { firstName: { contains: search, mode: 'insensitive' } } },
                  { user: { lastName: { contains: search, mode: 'insensitive' } } },
                ],
              },
            ],
          }
        : {}),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.patientProfile.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          updatedAt: 'desc',
        },
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
      }),
      this.prisma.patientProfile.count({ where }),
    ]);

    return {
      data: items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.max(Math.ceil(total / limit), 1),
      },
    };
  }

  async listDoctorsForAdmin(query: AdminListDoctorsQueryDto) {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 20, 100);
    const skip = (page - 1) * limit;
    const keyword = query.keyword?.trim();

    const where: Prisma.DoctorProfileWhereInput = {
      ...(query.approvalStatus ? { approvalStatus: query.approvalStatus } : {}),
      ...(query.isActive !== undefined ? { isActive: query.isActive } : {}),
      ...(keyword
        ? {
            user: {
              OR: [
                { email: { contains: keyword, mode: 'insensitive' } },
                { firstName: { contains: keyword, mode: 'insensitive' } },
                { lastName: { contains: keyword, mode: 'insensitive' } },
              ],
            },
          }
        : {}),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.doctorProfile.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
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
            },
          },
          specialties: {
            include: {
              specialty: true,
            },
          },
        },
      }),
      this.prisma.doctorProfile.count({ where }),
    ]);

    return {
      data: items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.max(Math.ceil(total / limit), 1),
      },
    };
  }

  async updateDoctorApproval(doctorId: string, dto: UpdateDoctorApprovalDto, adminId: string) {
    const doctor = await this.prisma.doctorProfile.findUnique({ where: { id: doctorId } });
    if (!doctor) {
      throw new NotFoundException('Doctor profile not found');
    }

    const updated = await this.prisma.doctorProfile.update({
      where: { id: doctorId },
      data: {
        approvalStatus: dto.approvalStatus,
        ...(dto.isActive !== undefined ? { isActive: dto.isActive } : {}),
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            isActive: true,
          },
        },
        specialties: {
          include: {
            specialty: true,
          },
        },
      },
    });

    await this.prisma.auditLog.create({
      data: {
        id: uuidv7(),
        actorUserId: adminId,
        action: 'DOCTOR_APPROVAL_UPDATED',
        resource: 'DOCTOR_PROFILE',
        resourceId: doctorId,
        metadata: {
          approvalStatus: dto.approvalStatus,
          isActive: dto.isActive ?? null,
        },
      },
    });

    return updated;
  }

  async updateDoctorProfileForAdmin(
    doctorId: string,
    dto: AdminUpdateDoctorProfileDto,
    adminId: string,
  ) {
    const doctor = await this.prisma.doctorProfile.findUnique({ where: { id: doctorId } });
    if (!doctor) {
      throw new NotFoundException('Doctor profile not found');
    }

    const updated = await this.prisma.doctorProfile.update({
      where: { id: doctorId },
      data: this.buildProfileUpdateData(dto),
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            isActive: true,
          },
        },
        specialties: {
          include: {
            specialty: true,
          },
        },
      },
    });

    await this.prisma.auditLog.create({
      data: {
        id: uuidv7(),
        actorUserId: adminId,
        action: 'DOCTOR_PROFILE_UPDATED_BY_ADMIN',
        resource: 'DOCTOR_PROFILE',
        resourceId: doctorId,
        metadata: {
          updatedFields: Object.keys(dto),
        },
      },
    });

    return updated;
  }

  async updateDoctorSpecialtiesForAdmin(
    doctorId: string,
    dto: UpdateDoctorSpecialtiesDto,
    adminId: string,
  ) {
    const doctor = await this.prisma.doctorProfile.findUnique({ where: { id: doctorId } });
    if (!doctor) {
      throw new NotFoundException('Doctor profile not found');
    }

    await this.replaceDoctorSpecialties(doctorId, dto.specialtyIds);

    await this.prisma.auditLog.create({
      data: {
        id: uuidv7(),
        actorUserId: adminId,
        action: 'DOCTOR_SPECIALTIES_UPDATED_BY_ADMIN',
        resource: 'DOCTOR_PROFILE',
        resourceId: doctorId,
        metadata: {
          specialtyIds: dto.specialtyIds,
        },
      },
    });

    return this.prisma.doctorProfile.findUnique({
      where: { id: doctorId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            isActive: true,
          },
        },
        specialties: {
          include: {
            specialty: true,
          },
        },
      },
    });
  }

  getPublicFilter() {
    return {
      isActive: true,
      approvalStatus: ApprovalStatus.APPROVED,
      user: {
        isActive: true,
        deletedAt: null,
      },
    } as const;
  }
}
